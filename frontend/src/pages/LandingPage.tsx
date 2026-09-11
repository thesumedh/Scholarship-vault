import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Shield, 
  Cpu, 
  Zap, 
  Lock, 
  Sliders, 
  FileCheck2,
  Database
} from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  
  // Interactive mini-playground state
  const [demoGpa, setDemoGpa] = useState('8.50');
  const [demoIncome, setDemoIncome] = useState('180000');

  const gpaNum = parseFloat(demoGpa) || 0;
  const incomeNum = parseInt(demoIncome, 10) || 0;
  const gpaScaled = Math.round(gpaNum * 100);
  const isEligible = gpaScaled >= MIN_GPA_THRESHOLD && incomeNum <= MAX_INCOME_THRESHOLD && incomeNum > 0;

  const copyContract = () => {
    navigator.clipboard.writeText(PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing-page" style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Hero Header */}
      <section style={{ textAlign: 'center', padding: '2rem 0 1.5rem' }}>
        <div className="badge-pill mb-md" style={{ margin: '0 auto 1.25rem' }}>
          <span className="badge-dot" />
          <span>Midnight Preprod Network Live</span>
        </div>

        <h1 className="hero-title title-hero" style={{ maxWidth: '800px', margin: '0 auto 1rem' }}>
          Zero-Knowledge Scholarship Credential Gateway
        </h1>

        <p className="hero-subtitle text-secondary" style={{ maxWidth: '640px', margin: '0 auto 1.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
          Prove academic standing and financial need on Midnight's dual-state ledger.
          Your private GPA and financial records never leave your browser memory.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link to="/verify" className="btn btn-primary btn-lg">
            <span>Launch Verifier</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            <span>Preprod Contract</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* Protocol Telemetry Strip */}
      <div className="protocol-telemetry">
        <div className="protocol-telemetry-cell">
          <div className="protocol-telemetry-label">
            <Database size={12} />
            <span>Deployed Contract</span>
          </div>
          <div className="protocol-telemetry-val" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{PREPROD_CONTRACT_ADDRESS.slice(0, 8)}…{PREPROD_CONTRACT_ADDRESS.slice(-6)}</span>
            <button
              onClick={copyContract}
              title="Copy full contract address"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
            >
              {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <div className="protocol-telemetry-cell">
          <div className="protocol-telemetry-label">
            <Cpu size={12} />
            <span>Proof Engine</span>
          </div>
          <div className="protocol-telemetry-val" style={{ color: '#10b981', fontSize: '0.85rem' }}>
            1AM Wallet / Client WASM
          </div>
        </div>

        <div className="protocol-telemetry-cell">
          <div className="protocol-telemetry-label">
            <Zap size={12} />
            <span>Docker Container</span>
          </div>
          <div className="protocol-telemetry-val" style={{ fontSize: '0.85rem' }}>
            Not Required (0-daemon)
          </div>
        </div>

        <div className="protocol-telemetry-cell">
          <div className="protocol-telemetry-label">
            <Shield size={12} />
            <span>On-Chain Gas Fee</span>
          </div>
          <div className="protocol-telemetry-val" style={{ fontSize: '0.85rem' }}>
            1 speck DUST (Sponsored)
          </div>
        </div>
      </div>

      {/* Interactive Circuit Witness Playground */}
      <section style={{ margin: '2.5rem 0' }}>
        <div className="card" style={{ padding: '1.75rem', background: '#0e0e12' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                <Sliders size={15} style={{ color: '#fafafa' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Interactive Witness Playground</h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Test how the Compact circuit evaluates thresholds client-side before any blockchain transaction is signed.
              </p>
            </div>
            <div className="badge-pill">
              <span className="badge-dot" style={{ backgroundColor: isEligible ? '#10b981' : '#ef4444' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: isEligible ? '#10b981' : '#ef4444' }}>
                {isEligible ? 'CIRCUIT CONSTRAINTS SATISFIED' : 'CIRCUIT CONSTRAINT FAILED'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Input Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#fafafa', fontWeight: 500 }}>Cumulative GPA (out of 10.0)</span>
                  <span className="font-mono" style={{ color: gpaScaled >= MIN_GPA_THRESHOLD ? '#10b981' : '#f59e0b' }}>
                    {gpaNum.toFixed(2)} (scaled: {gpaScaled})
                  </span>
                </div>
                <input
                  type="range"
                  min="5.00"
                  max="10.00"
                  step="0.05"
                  value={demoGpa}
                  onChange={(e) => setDemoGpa(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>5.00</span>
                  <span>Threshold: ≥ {(MIN_GPA_THRESHOLD / 100).toFixed(2)}</span>
                  <span>10.00</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#fafafa', fontWeight: 500 }}>Annual Household Income</span>
                  <span className="font-mono" style={{ color: incomeNum <= MAX_INCOME_THRESHOLD ? '#10b981' : '#f59e0b' }}>
                    ₹{incomeNum.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="10000"
                  value={demoIncome}
                  onChange={(e) => setDemoIncome(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>₹50k</span>
                  <span>Ceiling: ≤ ₹{MAX_INCOME_THRESHOLD.toLocaleString()}</span>
                  <span>₹500k</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Witness Telemetry Box */}
            <div className="console-panel">
              <div className="console-header">
                <span>Client Witness Terminal</span>
                <span>Compact zkIR</span>
              </div>
              
              <div className="console-row">
                <span className="console-key">circuit_id</span>
                <span className="console-val">verify_eligibility</span>
              </div>
              <div className="console-row">
                <span className="console-key">private_witness.gpa</span>
                <span className="console-val" style={{ color: gpaScaled >= MIN_GPA_THRESHOLD ? '#10b981' : '#f87171' }}>
                  {gpaScaled} (Uint&lt;32&gt;)
                </span>
              </div>
              <div className="console-row">
                <span className="console-key">private_witness.income</span>
                <span className="console-val" style={{ color: incomeNum <= MAX_INCOME_THRESHOLD ? '#10b981' : '#f87171' }}>
                  {incomeNum} (Uint&lt;32&gt;)
                </span>
              </div>
              <div className="console-row">
                <span className="console-key">public_assert(gpa &gt;= 850)</span>
                <span className="console-val" style={{ color: gpaScaled >= MIN_GPA_THRESHOLD ? '#10b981' : '#f87171' }}>
                  {gpaScaled >= MIN_GPA_THRESHOLD ? 'TRUE' : 'ASSERTION_FAIL'}
                </span>
              </div>
              <div className="console-row">
                <span className="console-key">public_assert(inc &lt;= 250000)</span>
                <span className="console-val" style={{ color: incomeNum <= MAX_INCOME_THRESHOLD ? '#10b981' : '#f87171' }}>
                  {incomeNum <= MAX_INCOME_THRESHOLD ? 'TRUE' : 'ASSERTION_FAIL'}
                </span>
              </div>
              <div className="console-row" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                <span className="console-key">on_chain_exposure</span>
                <span className="console-val" style={{ color: '#10b981' }}>0 bits (zk-SNARK proof only)</span>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <Link to="/verify" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
              <span>Prove with 1AM Wallet</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture: Dual-State Model */}
      <section style={{ margin: '2.5rem 0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem' }}>
          Midnight Dual-State Ledger Architecture
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Unlike standard public blockchains, Midnight segregates computation between off-chain private witnesses and transparent public state.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          
          <div className="card" style={{ borderLeft: '3px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Lock size={16} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>1. Shielded Witness (Local Device)</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Contains sensitive private variables provided by the student. Computed inside the user's browser or 1AM wallet:
            </p>
            <ul style={{ color: '#d4d4d8', fontSize: '0.8rem', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>Exact Cumulative GPA (e.g. 8.72)</li>
              <li>Actual Family Income (e.g. ₹1,80,000)</li>
              <li>Identity Private Key &amp; Nullifier Secret</li>
              <li><strong>Zero bytes sent across network</strong></li>
            </ul>
          </div>

          <div className="card" style={{ borderLeft: '3px solid #60a5fa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileCheck2 size={16} style={{ color: '#60a5fa' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>2. Public Ledger (Midnight Preprod)</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Contains immutable verifiable proof artifacts and global criteria managed by the smart contract:
            </p>
            <ul style={{ color: '#d4d4d8', fontSize: '0.8rem', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>Public Criteria: <code>min_gpa = 850</code>, <code>max_income = 250000</code></li>
              <li>Zero-Knowledge Proof (zk-SNARK wire commitment)</li>
              <li>Nullifier hash (prevents double-verification)</li>
              <li>Boolean verification status on Preprod</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Action Footer */}
      <section style={{ margin: '3rem 0 2rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem 1.5rem', background: '#111115' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            Connect 1AM &amp; Run Preprod Verification
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
            No background Docker containers required. 1AM wallet handles transaction balance, ZK proving, and Preprod submission.
          </p>
          <Link to="/verify" className="btn btn-primary btn-lg">
            <span>Open Verification Portal</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}

