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
  Shield,
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
  const { session, isConnected, connect, address } = useWallet();
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
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="badge-pill mb-sm">
          <Sliders size={13} />
          <span>Contract Administration</span>
        </div>
        <h1 className="title-lg mb-xs">
          Scholarship Vault <span className="text-gradient">Admin &amp; Deployer</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
          Manage and deploy instance criteria on the Midnight Preprod Network.
        </p>
      </div>

      {/* Current Active Contract */}
      <div className="card card-accent mb-lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge-dot" />
            <h2 className="title-sm">Current Active Preprod Contract</h2>
          </div>
          <a
            href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
          >
            <span>View on 1AM Explorer</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ 
          background: 'rgba(0, 0, 0, 0.45)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--accent-light)', wordBreak: 'break-all' }}>
            {PREPROD_CONTRACT_ADDRESS}
          </div>
          <button
            onClick={copyContract}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Criteria Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum GPA Criterion</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>8.00 / 10.0</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Disclosed constructor arg: {MIN_GPA_THRESHOLD}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maximum Income Criterion</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>₹2,50,000</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Disclosed constructor arg: {MAX_INCOME_THRESHOLD}</div>
          </div>
        </div>
      </div>

      {/* Deploy Card */}
      <div className="card">
        <h2 className="title-sm mb-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Rocket size={18} style={{ color: 'var(--accent-light)' }} />
          <span>Deploy Fresh Smart Contract Instance</span>
        </h2>
        <p className="text-secondary mb-lg" style={{ fontSize: '0.9rem' }}>
          Compile and publish a new Scholarship Vault contract to Midnight Preprod with custom constructor thresholds.
        </p>

        {!isConnected ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p className="text-secondary mb-md" style={{ fontSize: '0.9rem' }}>
              Connect your Lace or 1AM wallet to authorize contract deployment.
            </p>
            <button className="btn btn-primary" onClick={() => connect('preprod')}>
              <Key size={16} />
              <span>Connect Deployer Wallet</span>
            </button>
          </div>
        ) : (
          <div>
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleDeploy}
              disabled={status === 'deploying'}
            >
              {status === 'deploying' ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Submitting Deployment to Preprod…</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Deploy Contract to Preprod</span>
                </>
              )}
            </button>
          </div>
        )}

        {status === 'deployed' && deployedAddress && (
          <div className="result-box success" style={{ marginTop: '1.5rem' }}>
            <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#10b981' }}>Contract Successfully Deployed!</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              New Preprod Contract Address:
            </p>
            <div className="result-tx font-mono">
              <span>{deployedAddress}</span>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <a
                href={`https://explorer.1am.xyz/contract/${deployedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <span>View on 1AM Explorer</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div className="result-box error" style={{ marginTop: '1.5rem' }}>
            <AlertCircle size={36} style={{ color: '#f43f5e', margin: '0 auto 0.5rem' }} />
            <div className="result-title" style={{ color: '#f43f5e' }}>Deployment Error</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {errorMsg}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
