import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import PrivacyFlowViz from '../components/PrivacyFlowViz';
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export default function VerifyPage() {
  const { session, isConnected, walletStatus } = useWallet();
  const [gpaRaw, setGpaRaw] = useState('');
  const [incomeRaw, setIncomeRaw] = useState('');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    if (!session || !isConnected) return;

    const gpaValue = parseFloat(gpaRaw);
    const incomeValue = parseInt(incomeRaw, 10);

    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 10) {
      setErrorMsg('Please enter a valid GPA between 0.0 and 10.0');
      setStatus('error');
      return;
    }
    if (isNaN(incomeValue) || incomeValue < 0) {
      setErrorMsg('Please enter a valid annual income in INR');
      setStatus('error');
      return;
    }

    const gpaScaled = BigInt(Math.round(gpaValue * 100));
    const incomeBig = BigInt(incomeValue);

    setStatus('proving');
    setErrorMsg(null);
    setTxId(null);

    try {
      const compiledContract = getCompiledContract();

      const callTxData = await createUnprovenCallTx(session.providers as any, {
        compiledContract,
        contractAddress: PREPROD_CONTRACT_ADDRESS,
        circuitId: 'verify_eligibility',
        args: [gpaScaled, incomeBig],
      });

      setStatus('submitting');

      const id = await submitTxAsync(session.providers as any, {
        unprovenTx: callTxData.private.unprovenTx,
        circuitId: 'verify_eligibility',
      });

      setTxId(typeof id === 'string' ? id : id?.txHash ?? 'confirmed');

      const passes = gpaScaled >= BigInt(MIN_GPA_THRESHOLD) && incomeBig <= BigInt(MAX_INCOME_THRESHOLD);
      setStatus(passes ? 'eligible' : 'ineligible');
    } catch (e: any) {
      const msg: string = e?.message ?? String(e);
      if (msg.includes('GPA too low') || msg.includes('Income too high') || msg.toLowerCase().includes('assert')) {
        setStatus('ineligible');
      } else {
        setStatus('error');
        setErrorMsg(msg);
      }
    }
  }, [session, isConnected, gpaRaw, incomeRaw]);

  const reset = () => {
    setStatus('idle');
    setErrorMsg(null);
    setTxId(null);
    setGpaRaw('');
    setIncomeRaw('');
  };

  const isProcessing = status === 'proving' || status === 'submitting';

  if (!isConnected) {
    return (
      <div className="page-container flex-center">
        <div className="card text-center max-w-md mx-auto">
          <LockCircleIcon />
          <h2 className="title-md">Connect Wallet</h2>
          <p className="text-secondary mb-lg">
            You must connect your 1AM or Lace wallet on the Preprod network to verify your eligibility.
          </p>
        </div>
      </div>
    );
  }

  if (PREPROD_CONTRACT_ADDRESS === 'UPDATE_WITH_YOUR_PREPROD_CONTRACT_ADDRESS') {
    return (
      <div className="page-container flex-center">
        <div className="card text-center max-w-md mx-auto">
          <AlertCircle size={48} className="text-warning mx-auto mb-md" />
          <h2 className="title-md">Contract Not Deployed</h2>
          <p className="text-secondary mb-lg">
            Please ask an administrator to deploy the contract via the Admin portal first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-xl">
          <h1 className="title-lg mb-sm">Verify Eligibility</h1>
          <p className="text-secondary">Provide your private credentials below to generate a zero-knowledge proof.</p>
        </div>

        <PrivacyFlowViz status={status} />

        <div className="card">
          <div className="rules-grid mb-lg">
            <div className="rule-box">
              <div className="rule-label">Min GPA (Public)</div>
              <div className="rule-value">≥ 8.00</div>
            </div>
            <div className="rule-box">
              <div className="rule-label">Max Income (Public)</div>
              <div className="rule-value">≤ ₹2,50,000</div>
            </div>
          </div>

          <div className="form-grid mb-lg">
            <div className="input-group">
              <label htmlFor="input-gpa">Your GPA</label>
              <input
                id="input-gpa"
                type="number"
                className="input-field"
                placeholder="e.g. 9.1"
                min="0"
                max="10"
                step="0.01"
                value={gpaRaw}
                onChange={(e) => setGpaRaw(e.target.value)}
                disabled={isProcessing || status === 'eligible' || status === 'ineligible'}
              />
              <div className="text-secondary mt-xs" style={{ fontSize: '0.8rem' }}>Enter a value between 0.0 and 10.0</div>
            </div>
            <div className="input-group">
              <label htmlFor="input-income">Annual Family Income (₹)</label>
              <input
                id="input-income"
                type="number"
                className="input-field"
                placeholder="e.g. 180000"
                min="0"
                step="1000"
                value={incomeRaw}
                onChange={(e) => setIncomeRaw(e.target.value)}
                disabled={isProcessing || status === 'eligible' || status === 'ineligible'}
              />
              <div className="text-secondary mt-xs" style={{ fontSize: '0.8rem' }}>Enter total income in INR</div>
            </div>
          </div>

          {status === 'idle' || status === 'error' ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={handleVerify}
                disabled={!gpaRaw || !incomeRaw || !isConnected}
              >
                Verify Eligibility
              </button>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={reset}
                disabled={!gpaRaw && !incomeRaw && !errorMsg}
              >
                Clear
              </button>
            </div>
          ) : isProcessing ? (
            <button className="btn btn-primary btn-block" disabled>
              <Loader2 className="spinner-icon mr-sm" size={18} />
              {status === 'proving' ? 'Generating ZK Proof Locally…' : 'Submitting Proof to Preprod…'}
            </button>
          ) : (
            <button className="btn btn-secondary btn-block" onClick={reset}>
              Verify Another Application
            </button>
          )}

          {status === 'eligible' && (
            <div className="result-box success mt-lg">
              <CheckCircle size={32} className="mb-sm" />
              <div className="result-title">Eligible for Scholarship!</div>
              <div className="result-desc mb-sm">Your ZK proof was verified on-chain. Your data remained private.</div>
              {txId && (
                <a 
                  href={`https://explorer.1am.xyz/tx/${txId}?network=preprod`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary inline-flex items-center gap-xs mt-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  View on Explorer <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}

          {status === 'ineligible' && (
            <div className="result-box error mt-lg">
              <XCircle size={32} className="mb-sm" />
              <div className="result-title">Not Eligible</div>
              <div className="result-desc mb-sm">Your credentials do not satisfy the thresholds. Data remained private.</div>
              {txId && (
                <a 
                  href={`https://explorer.1am.xyz/tx/${txId}?network=preprod`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary inline-flex items-center gap-xs mt-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  View on Explorer <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}

          {status === 'error' && errorMsg && (
            <div className="result-box warning mt-lg">
              <AlertCircle size={24} className="mb-sm" />
              <div className="result-title">Verification Error</div>
              <div className="result-desc">{errorMsg}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LockCircleIcon() {
  return (
    <div className="mx-auto mb-md" style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AlertCircle size={32} className="text-secondary" />
    </div>
  );
}
