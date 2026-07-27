import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { Settings, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export default function AdminPage() {
  const { session, isConnected } = useWallet();
  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

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
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  }, [session, isConnected]);

  if (!isConnected) {
    return (
      <div className="page-container flex-center">
        <div className="card text-center max-w-md mx-auto">
          <Settings size={48} className="text-secondary mx-auto mb-md" />
          <h2 className="title-md">Admin Portal</h2>
          <p className="text-secondary">Please connect your wallet to access the deployer interface.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="mb-xl">
          <h1 className="title-lg mb-sm">Admin Settings</h1>
          <p className="text-secondary">Deploy the ScholarShield contract to the Midnight network.</p>
        </div>

        <div className="card border-accent">
          <h2 className="title-md mb-sm flex items-center">
            <Settings size={20} className="mr-sm" /> Deploy Contract
          </h2>
          <p className="text-secondary mb-lg">
            Deploy the scholarship contract to the Preprod network. The contract will be initialized with the criteria defined in the application config.
          </p>

          <div className="rules-grid mb-lg">
            <div className="rule-box">
              <div className="rule-label">Initial GPA Threshold</div>
              <div className="rule-value">8.00</div>
            </div>
            <div className="rule-box">
              <div className="rule-label">Initial Income Threshold</div>
              <div className="rule-value">₹2,50,000</div>
            </div>
          </div>

          {status === 'idle' || status === 'error' ? (
            <button className="btn btn-primary btn-block" onClick={handleDeploy}>
              Deploy Contract to Preprod
            </button>
          ) : status === 'deploying' ? (
            <button className="btn btn-primary btn-block" disabled>
              <Loader2 className="spinner-icon mr-sm" size={18} />
              Deploying... Please check your wallet extension
            </button>
          ) : (
            <div className="result-box success mt-md">
              <CheckCircle size={32} className="mb-sm" />
              <div className="result-title">Successfully Deployed!</div>
              <div className="result-tx font-mono">{deployedAddress}</div>
              <div className="mt-sm text-sm opacity-80">Reloading application...</div>
            </div>
          )}

          {status === 'error' && errorMsg && (
            <div className="result-box error mt-md">
              <AlertCircle size={24} className="mb-sm" />
              <div className="result-title">Deployment Failed</div>
              <div className="result-desc break-words">{errorMsg}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
