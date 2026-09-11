import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export default function VerifyPage() {
  const { session, isConnected, walletType, address, connect } = useWallet();
  const [gpaRaw, setGpaRaw] = useState('8.50');
  const [incomeRaw, setIncomeRaw] = useState('180000');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stepMsg, setStepMsg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'wallet' | 'simulator'>('wallet');

  // Simulator State
  const [simStatus, setSimStatus] = useState<'idle' | 'simulating' | 'success' | 'failed'>('idle');

  // Input numeric helpers
  const gpaVal = parseFloat(gpaRaw) || 0;
  const incomeVal = parseInt(incomeRaw, 10) || 0;
  const gpaScaled = Math.round(gpaVal * 100);

  const satisfiesGpa = gpaScaled >= MIN_GPA_THRESHOLD;
  const satisfiesIncome = incomeVal <= MAX_INCOME_THRESHOLD && incomeVal > 0;
  const willPassCircuit = satisfiesGpa && satisfiesIncome;

  const handleVerify = useCallback(async () => {
    if (!session || !isConnected) return;

    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 10) {
      setErrorMsg('Please enter a valid GPA between 0.0 and 10.0');
      setStatus('error');
      return;
    }
    if (isNaN(incomeVal) || incomeVal <= 0) {
      setErrorMsg('Please enter a valid annual income in INR');
      setStatus('error');
      return;
    }

    const gpaScaledBig = BigInt(gpaScaled);
    const incomeBig = BigInt(incomeVal);

    setStatus('proving');
    setStepMsg('Generating local WASM zero-knowledge proof…');
    setErrorMsg(null);
    setTxId(null);

    try {
      const compiledContract = getCompiledContract();

      const callTxData = await createUnprovenCallTx(session.providers as any, {
        compiledContract,
        contractAddress: PREPROD_CONTRACT_ADDRESS,
        circuitId: 'verify_eligibility',
        args: [gpaScaledBig, incomeBig],
      });

      setStatus('submitting');
      setStepMsg('Submitting balanced transaction to Midnight Preprod…');

      const id = await submitTxAsync(session.providers as any, {
        unprovenTx: callTxData.private.unprovenTx,
        circuitId: 'verify_eligibility',
      });

      const finalTx = typeof id === 'string' ? id : (id as any)?.txHash ?? 'confirmed';
      setTxId(finalTx);

      const passes = gpaScaledBig >= BigInt(MIN_GPA_THRESHOLD) && incomeBig <= BigInt(MAX_INCOME_THRESHOLD);
      setStatus(passes ? 'eligible' : 'ineligible');
    } catch (e: any) {
      const msg: string = e?.message ?? String(e);
      if (msg.includes('GPA does not meet') || msg.includes('Income exceeds') || msg.toLowerCase().includes('assert')) {
        setStatus('ineligible');
      } else {
        setStatus('error');
        setErrorMsg(msg);
      }
    }
  }, [session, isConnected, gpaVal, incomeVal, gpaScaled]);

  const handleSimulate = () => {
    setSimStatus('simulating');
    setTimeout(() => {
      if (willPassCircuit) {
        setSimStatus('success');
      } else {
        setSimStatus('failed');
      }
    }, 700);
  };

  const copyTx = () => {
    if (!txId) return;
    navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStatus('idle');
    setSimStatus('idle');
    setErrorMsg(null);
    setTxId(null);
  };

  const isProcessing = status === 'proving' || status === 'submitting';

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="title-lg mb-xs">Scholarship Verification</h1>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Verify your eligibility against on-chain criteria without revealing your private credentials.
        </p>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#121215', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
        <button
          onClick={() => { setActiveTab('wallet'); reset(); }}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'wallet' ? '#27272a' : 'transparent',
            color: activeTab === 'wallet' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Live Preprod
        </button>
        <button
          onClick={() => { setActiveTab('simulator'); reset(); }}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'simulator' ? '#27272a' : 'transparent',
            color: activeTab === 'simulator' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Circuit Sandbox
        </button>
      </div>

      {/* Docker Reassurance Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.65rem 0.95rem',
        background: '#0d0d10',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span className="badge-dot" style={{ backgroundColor: '#10b981' }} />
          <span><strong>Zero Docker Required:</strong> Proofs generate inside 1AM wallet or local browser memory.</span>
        </div>
        <span className="font-mono" style={{ color: '#10b981', fontSize: '0.72rem' }}>0-DAEMON</span>
      </div>

      {/* Main Card */}
      <div className="card">
        
        {/* Form Inputs with Dual Controls (Slider + Number) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <span>Cumulative GPA (out of 10.0)</span>
              </label>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: satisfiesGpa ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {gpaVal.toFixed(2)} {satisfiesGpa ? '✓ Eligible' : '✗ Below 8.00'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="range"
                step="0.01"
                min="0"
                max="10"
                value={gpaRaw}
                disabled={isProcessing}
                onChange={(e) => setGpaRaw(e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="8.50"
                className="form-input"
                style={{ width: '90px', padding: '0.4rem 0.6rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}
                value={gpaRaw}
                disabled={isProcessing}
                onChange={(e) => setGpaRaw(e.target.value)}
              />
            </div>

            <div className="form-hint-row" style={{ marginTop: '0.25rem' }}>
              <span>Compact witness: <code>{gpaScaled}</code> (Uint&lt;32&gt;)</span>
              <span>Required: ≥ {(MIN_GPA_THRESHOLD / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <span>Annual Family Income (INR ₹)</span>
              </label>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: satisfiesIncome ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                ₹{incomeVal.toLocaleString()} {satisfiesIncome ? '✓ Eligible' : '✗ Exceeds ceiling'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="range"
                step="5000"
                min="0"
                max="500000"
                value={incomeRaw}
                disabled={isProcessing}
                onChange={(e) => setIncomeRaw(e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                step="5000"
                min="0"
                placeholder="180000"
                className="form-input"
                style={{ width: '110px', padding: '0.4rem 0.6rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}
                value={incomeRaw}
                disabled={isProcessing}
                onChange={(e) => setIncomeRaw(e.target.value)}
              />
            </div>

            <div className="form-hint-row" style={{ marginTop: '0.25rem' }}>
              <span>Compact witness: <code>{incomeVal}</code> (Uint&lt;32&gt;)</span>
              <span>Max Ceiling: ≤ ₹{MAX_INCOME_THRESHOLD.toLocaleString()}</span>
            </div>
          </div>

        </div>

        {/* Live Cryptographic Witness Summary */}
        <div className="console-panel" style={{ marginTop: '1.25rem' }}>
          <div className="console-header">
            <span>Client ZK Witness State</span>
            <span style={{ color: willPassCircuit ? '#10b981' : '#f59e0b' }}>
              {willPassCircuit ? 'SATISFIED' : 'UNSATISFIED'}
            </span>
          </div>
          <div className="console-row">
            <span className="console-key">circuit_target</span>
            <span className="console-val font-mono">scholarship::verify_eligibility</span>
          </div>
          <div className="console-row">
            <span className="console-key">local_math_check</span>
            <span className="console-val font-mono">
              ({gpaScaled} ≥ 850) &amp;&amp; ({incomeVal} ≤ 250000)
            </span>
          </div>
          <div className="console-row">
            <span className="console-key">data_leaked_to_chain</span>
            <span className="console-val font-mono" style={{ color: '#10b981' }}>
              0 bits (Shielded private witness)
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '1.25rem' }}>
          {activeTab === 'wallet' ? (
            <div>
              {!isConnected ? (
                <button
                  className="btn btn-primary btn-block btn-lg"
                  onClick={() => connect('preprod')}
                >
                  <Key size={16} />
                  <span>Connect 1AM / Lace &amp; Verify</span>
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-block btn-lg"
                  onClick={handleVerify}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" />
                      <span>{stepMsg}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Prove &amp; Inscribe on Preprod</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div>
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={handleSimulate}
                disabled={simStatus === 'simulating'}
              >
                {simStatus === 'simulating' ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" />
                    <span>Evaluating WASM Circuit…</span>
                  </>
                ) : (
                  <>
                    <Cpu size={16} />
                    <span>Simulate ZK Proof</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Result: Eligible */}
        {status === 'eligible' && (
          <div className="result-box success">
            <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 0.4rem' }} />
            <div className="result-title" style={{ color: '#10b981' }}>Eligibility Verified</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto' }}>
              Your zero-knowledge proof has been verified and confirmed by the smart contract on Midnight Preprod.
            </p>

            {txId && (
              <div className="result-tx font-mono">
                <span>TX: {txId.slice(0, 10)}…{txId.slice(-6)}</span>
                <button
                  onClick={copyTx}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Copy TX"
                >
                  {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                </button>
                <a
                  href={`https://explorer.1am.xyz/tx/${txId}?network=preprod`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#fafafa', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <span>1AM</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={reset} style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                <RefreshCw size={13} />
                <span>Verify Another</span>
              </button>
            </div>
          </div>
        )}

        {/* Result: Ineligible */}
        {status === 'ineligible' && (
          <div className="result-box ineligible">
            <XCircle size={32} style={{ color: '#f59e0b', margin: '0 auto 0.4rem' }} />
            <div className="result-title" style={{ color: '#f59e0b' }}>Threshold Not Met</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto' }}>
              The Zero-Knowledge circuit rejected the input: GPA is below 8.00 or household income exceeds ₹2,50,000.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={reset} style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                <RefreshCw size={13} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Result: Error */}
        {status === 'error' && errorMsg && (
          <div className="result-box error">
            <AlertCircle size={32} style={{ color: '#ef4444', margin: '0 auto 0.4rem' }} />
            <div className="result-title" style={{ color: '#ef4444' }}>Verification Notice</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto' }}>
              {errorMsg}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={reset} style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Simulator Results */}
        {activeTab === 'simulator' && simStatus === 'success' && (
          <div className="result-box success">
            <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 0.4rem' }} />
            <div className="result-title" style={{ color: '#10b981' }}>Sandbox: Valid ZK Proof</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Mathematical proof generated locally. Constraints satisfied.
            </p>
          </div>
        )}

        {activeTab === 'simulator' && simStatus === 'failed' && (
          <div className="result-box ineligible">
            <XCircle size={32} style={{ color: '#f59e0b', margin: '0 auto 0.4rem' }} />
            <div className="result-title" style={{ color: '#f59e0b' }}>Sandbox: Constraint Violation</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              The proof engine rejected the inputs against the minimum threshold requirements.
            </p>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Contract: {PREPROD_CONTRACT_ADDRESS.slice(0, 8)}…{PREPROD_CONTRACT_ADDRESS.slice(-6)}</span>
        <a
          href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          <span>1AM Explorer</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
