import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { 
  Sliders, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Rocket,
  Key
} from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export default function AdminPage() {
  const { session, isConnected, connect } = useWallet();
  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyContract = () => {
    navigator.clipboard.writeText(deployedAddress || PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = useCallback(async () => {
    if (!session || !isConnected) return;
    setStatus('deploying');
    setErrorMsg(null);

    try {
      const compiledContract = getCompiledContract();
      const initialPrivateState = {};

      const deployTxData = await createUnprovenDeployTx(session.providers as any, {
        compiledContract,
        args: [BigInt(MIN_GPA_THRESHOLD), BigInt(MAX_INCOME_THRESHOLD)],
        privateStateId: 'DeployerState',
        initialPrivateState,
        signingKey: sampleSigningKey(),
      });

      const contractAddress = deployTxData.public.contractAddress;
      
      await submitTxAsync(session.providers as any, {
        unprovenTx: deployTxData.private.unprovenTx,
      });

      setDeployedAddress(contractAddress);
      localStorage.setItem('PREPROD_CONTRACT_ADDRESS', contractAddress);
      setStatus('deployed');
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  }, [session, isConnected]);

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="title-lg mb-xs">Admin Portal</h1>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Inspect active criteria and deploy smart contract instances to Midnight Preprod.
        </p>
      </div>

      {/* Active Contract Details */}
      <div className="card mb-lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Active Contract Instance</span>
          <a
            href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <span>1AM Explorer</span>
            <ExternalLink size={11} />
          </a>
        </div>

        <div style={{ 
          background: 'var(--bg-input)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          fontSize: '0.8rem'
        }}>
          <span className="font-mono" style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
            {PREPROD_CONTRACT_ADDRESS}
          </span>
          <button
            onClick={copyContract}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
          >
            {copied ? <Check size={11} style={{ color: '#10b981' }} /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Configured GPA Threshold</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>≥ 8.00 / 10.0</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Configured Income Ceiling</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '0.15rem' }}>≤ ₹2,50,000</div>
          </div>
        </div>
      </div>

      {/* Deploy Section */}
      <div className="card">
        <h2 className="title-sm mb-xs">Deploy Contract</h2>
        <p className="text-secondary mb-md" style={{ fontSize: '0.85rem' }}>
          Publish a new instance of `contracts/scholarship.compact` to Midnight Preprod with Lace / 1AM.
        </p>

        {!isConnected ? (
          <button className="btn btn-primary btn-block" onClick={() => connect('preprod')}>
            <Key size={14} />
            <span>Connect Wallet to Deploy</span>
          </button>
        ) : (
          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={handleDeploy}
            disabled={status === 'deploying'}
          >
            {status === 'deploying' ? (
              <>
                <Loader2 size={16} className="spinner-icon" />
                <span>Deploying to Preprod…</span>
              </>
            ) : (
              <span>Deploy Contract Instance</span>
            )}
          </button>
        )}

        {status === 'deployed' && deployedAddress && (
          <div className="result-box success" style={{ marginTop: '1rem' }}>
            <CheckCircle2 size={28} style={{ color: '#10b981', margin: '0 auto 0.35rem' }} />
            <div className="result-title" style={{ color: '#10b981', fontSize: '1.05rem' }}>Deployment Complete</div>
            <div className="result-tx font-mono" style={{ fontSize: '0.75rem' }}>
              <span>{deployedAddress}</span>
            </div>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div className="result-box error" style={{ marginTop: '1rem' }}>
            <AlertCircle size={28} style={{ color: '#ef4444', margin: '0 auto 0.35rem' }} />
            <div className="result-title" style={{ color: '#ef4444', fontSize: '1rem' }}>Deployment Error</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
