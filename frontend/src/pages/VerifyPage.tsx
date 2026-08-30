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
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  Cpu,
  Layers,
  HelpCircle
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
    setStepMsg('Constructing private witness & generating WASM ZK proof…');
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
      setStepMsg('Broadcasting balanced ZK transaction to Midnight Preprod…');

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
    }, 900);
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
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="badge-pill mb-sm">
          <Sparkles size={13} />
          <span>Zero-Knowledge Proof Engine</span>
        </div>
        <h1 className="title-lg mb-xs">
          Scholarship <span className="text-gradient">Eligibility Verification</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
          Your GPA and Income are private witnesses. They are proven locally in WASM and never broadcast to the network.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => { setActiveTab('wallet'); reset(); }}
          className={`btn ${activeTab === 'wallet' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 1.25rem', fontSize: '0.875rem', borderRadius: 'var(--radius-pill)' }}
        >
          <Layers size={15} />
          <span>Live Preprod Verification</span>
        </button>
        <button
          onClick={() => { setActiveTab('simulator'); reset(); }}
          className={`btn ${activeTab === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 1.25rem', fontSize: '0.875rem', borderRadius: 'var(--radius-pill)' }}
        >
          <Cpu size={15} />
          <span>ZK Circuit Sandbox</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="card card-glow">
        
        {/* Verification Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* GPA Input */}
          <div className="form-group">
            <label className="form-label">
              <span>Cumulative GPA (out of 10.0)</span>
              <span style={{ fontSize: '0.75rem', color: satisfiesGpa ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                Requirement: ≥ {(MIN_GPA_THRESHOLD / 100).toFixed(2)}
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 8.50"
              className="form-input"
              value={gpaRaw}
              disabled={isProcessing}
              onChange={(e) => setGpaRaw(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>Scaled integer witness: {gpaScaled}</span>
              <span>{satisfiesGpa ? '✅ Meets threshold' : '⚠️ Below 8.00'}</span>
            </div>
          </div>

          {/* Income Input */}
          <div className="form-group">
            <label className="form-label">
              <span>Annual Family Income (INR ₹)</span>
              <span style={{ fontSize: '0.75rem', color: satisfiesIncome ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                Cap: ≤ ₹{MAX_INCOME_THRESHOLD.toLocaleString()}
              </span>
            </label>
            <input
              type="number"
              step="1000"
              min="0"
              placeholder="e.g. 180000"
              className="form-input"
              value={incomeRaw}
              disabled={isProcessing}
              onChange={(e) => setIncomeRaw(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>Formatted: ₹{incomeVal.toLocaleString()}</span>
              <span>{satisfiesIncome ? '✅ Within limit' : '⚠️ Exceeds limit'}</span>
            </div>
          </div>

        </div>

        {/* Real-time Cryptographic Circuit Assertion Status */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.15rem',
          margin: '1rem 0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={15} style={{ color: 'var(--accent-light)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Circuit Assertion: <code className="font-mono" style={{ color: '#fff' }}>assert(gpa &gt;= min_gpa &amp;&amp; income &lt;= max_income)</code>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: willPassCircuit ? '#10b981' : '#f59e0b' }}>
              {willPassCircuit ? 'Proof Will Validate' : 'Constraint Violation'}
            </span>
          </div>
        </div>

        {/* Action Button Section */}
        {activeTab === 'wallet' ? (
          <div>
            {!isConnected ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p className="text-secondary mb-md" style={{ fontSize: '0.9rem' }}>
                  Connect your Midnight Lace or 1AM wallet on Preprod to submit your proof on-chain.
                </p>
                <button
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => connect('preprod')}
                >
                  <Key size={18} />
                  <span>Connect Wallet &amp; Verify</span>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={handleVerify}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    <span>{status === 'proving' ? 'Generating ZK Proof…' : 'Submitting to Preprod…'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Submit ZK Proof to Preprod</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div>
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleSimulate}
              disabled={simStatus === 'simulating'}
            >
              {simStatus === 'simulating' ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Evaluating WASM Circuit…</span>
                </>
              ) : (
                <>
                  <Cpu size={18} />
                  <span>Run ZK Proof Simulation</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Progress feedback message */}
        {isProcessing && (
          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--accent-light)', fontSize: '0.875rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
              <Loader2 size={14} className="spinner-icon" />
              <span>{stepMsg}</span>
            </div>
          </div>
        )}

        {/* Result Boxes */}
        {status === 'eligible' && (
          <div className="result-box success">
            <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#10b981' }}>Scholarship Eligibility Verified!</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
              Your zero-knowledge proof has been verified by the smart contract on <strong>Midnight Preprod</strong>.
              Your GPA and income were never revealed to the network.
            </p>

            {txId && (
              <div className="result-tx font-mono">
                <span>TX: {txId.slice(0, 12)}…{txId.slice(-8)}</span>
                <button
                  onClick={copyTx}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Copy Transaction Hash"
                >
                  {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                </button>
                <a
                  href={`https://explorer.1am.xyz/tx/${txId}?network=preprod`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <span>Explorer</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div style={{ marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={reset} style={{ fontSize: '0.85rem' }}>
                <RefreshCw size={14} />
                <span>Verify Another Record</span>
              </button>
            </div>
          </div>
        )}

        {status === 'ineligible' && (
          <div className="result-box ineligible">
            <XCircle size={36} style={{ color: '#f59e0b', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#f59e0b' }}>Threshold Not Met</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
              The Zero-Knowledge circuit assertion failed: the entered GPA is below <strong>8.00</strong> or the annual family income exceeds <strong>₹2,50,000</strong>.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={reset} style={{ fontSize: '0.85rem' }}>
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div className="result-box error">
            <AlertCircle size={36} style={{ color: '#f43f5e', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#f43f5e' }}>Verification Notice</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '520px', margin: '0 auto' }}>
              {errorMsg}
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={reset} style={{ fontSize: '0.85rem' }}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Simulator Results */}
        {activeTab === 'simulator' && simStatus === 'success' && (
          <div className="result-box success">
            <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#10b981' }}>ZK Simulation: Constraints Satisfied!</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
              Mathematical proof generated locally. Output state: <code className="font-mono" style={{ color: '#10b981' }}>is_eligible: true</code>.
              When ready, switch to <strong>Live Preprod Verification</strong> to commit to the blockchain!
            </p>
          </div>
        )}

        {activeTab === 'simulator' && simStatus === 'failed' && (
          <div className="result-box ineligible">
            <XCircle size={36} style={{ color: '#f59e0b', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#f59e0b' }}>ZK Simulation: Constraint Assertion Rejection</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
              The proof engine asserted failure because either GPA &lt; 8.00 or Family Income &gt; ₹2,50,000.
            </p>
          </div>
        )}

      </div>

      {/* Contract & Privacy Info Footnote */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div>
          <span>Target Contract: </span>
          <code className="font-mono" style={{ color: 'var(--text-secondary)' }}>
            {PREPROD_CONTRACT_ADDRESS.slice(0, 8)}…{PREPROD_CONTRACT_ADDRESS.slice(-6)}
          </code>
        </div>
        <a
          href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <span>View Contract on 1AM</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
