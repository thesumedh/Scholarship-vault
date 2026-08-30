import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock,
  ArrowRight,
  Shield,
  FileCheck,
  ServerOff
} from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

export default function LandingPage() {
  const [copied, setCopied] = useState(false);

  const copyContract = () => {
    navigator.clipboard.writeText(PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="badge-pill mb-md" style={{ margin: '0 auto 1.25rem' }}>
          <span className="badge-dot" />
          <span>Midnight Preprod Live</span>
        </div>

        <h1 className="hero-title title-hero">
          Private Scholarship Verification
        </h1>

        <p className="hero-subtitle">
          Prove your academic qualification and income eligibility using Zero-Knowledge proofs.
          Your private GPA and financial records never leave your browser.
        </p>

        <div className="hero-actions mb-xl">
          <Link to="/verify" className="btn btn-primary btn-lg">
            <span>Verify Eligibility</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="btn btn-secondary btn-lg">
            <span>How it Works</span>
          </Link>
        </div>

        {/* Live Preprod Contract Strip */}
        <div className="card max-w-2xl mx-auto" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <span className="badge-dot" />
            <span style={{ fontWeight: 500, color: '#fff' }}>Contract:</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
              {PREPROD_CONTRACT_ADDRESS.slice(0, 8)}…{PREPROD_CONTRACT_ADDRESS.slice(-6)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={copyContract}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            >
              <span>Explorer</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </section>

      {/* Criteria Summary Cards */}
      <section className="my-xl">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Minimum GPA Requirement
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0.35rem 0 0.2rem' }}>
              ≥ {(MIN_GPA_THRESHOLD / 100).toFixed(2)} / 10.0
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Public on-chain criterion
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Maximum Family Income
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0.35rem 0 0.2rem' }}>
              ≤ ₹{MAX_INCOME_THRESHOLD.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Annual household ceiling
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Privacy Guarantee
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981', margin: '0.35rem 0 0.2rem' }}>
              100% Client-Side
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Zero raw data stored or shared
            </div>
          </div>

        </div>
      </section>

      {/* How it works - 3 Simple Steps */}
      <section className="my-xl max-w-3xl mx-auto">
        <h2 className="title-md mb-lg text-center">How Verification Works</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div className="card">
            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#18181b', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
              <Lock size={15} style={{ color: '#fafafa' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>1. Enter Locally</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Input your GPA and Income. They stay in your browser as private witnesses.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#18181b', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
              <FileCheck size={15} style={{ color: '#fafafa' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>2. Generate Proof</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              A WASM zk-SNARK circuit proves you meet the criteria without exposing the values.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#18181b', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
              <ShieldCheck size={15} style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>3. On-Chain Check</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Midnight contract verifies the math and marks your address eligible on Preprod.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="my-xl max-w-3xl mx-auto text-center">
        <div className="card" style={{ padding: '2.5rem 1.5rem', background: '#141418' }}>
          <h2 className="title-md mb-xs">Ready to test eligibility?</h2>
          <p className="text-secondary mb-lg max-w-md mx-auto" style={{ fontSize: '0.9rem' }}>
            Test with our interactive sandbox or connect your Lace/1AM wallet on Preprod.
          </p>
          <Link to="/verify" className="btn btn-primary btn-lg">
            <span>Open Verification Portal</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
