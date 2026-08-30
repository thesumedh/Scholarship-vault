import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  LockKeyhole, 
  Zap, 
  ChevronRight, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  Users,
  Code2,
  Lock
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
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge-pill badge-live mb-md">
            <span className="badge-dot" />
            <span>Midnight Preprod Network Live</span>
          </div>

          <h1 className="hero-title title-hero">
            Zero-Knowledge <br />
            <span className="text-gradient">Scholarship Verification</span>
          </h1>

          <p className="hero-subtitle">
            Prove your academic merit and financial eligibility on-chain with mathematical certainty —
            <strong> without ever disclosing your actual GPA or family income</strong>.
          </p>

          <div className="hero-actions mb-xl">
            <Link to="/verify" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              <span>Verify Eligibility</span>
              <ChevronRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              <span>Explore Cryptographic Model</span>
            </Link>
          </div>

          {/* Live Contract Banner */}
          <motion.div 
            className="contract-banner card-glow mx-auto max-w-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Active Preprod Contract:</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div className="contract-address-box font-mono">
                <span>{PREPROD_CONTRACT_ADDRESS.slice(0, 10)}…{PREPROD_CONTRACT_ADDRESS.slice(-8)}</span>
                <button
                  onClick={copyContract}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Copy full address"
                >
                  {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                </button>
              </div>
              
              <a
                href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-xs)' }}
              >
                <span>1AM Explorer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Thresholds Banner */}
      <section className="my-lg">
        <div className="card card-accent max-w-3xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Minimum GPA Criterion</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c4b5fd' }}>{(MIN_GPA_THRESHOLD / 100).toFixed(2)} / 10.0</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Scaled integer: {MIN_GPA_THRESHOLD}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Maximum Family Income</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>₹{(MAX_INCOME_THRESHOLD).toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Annual threshold limit</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Zero-Knowledge Privacy</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>100% Client-Side</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Zero raw data leakage</div>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs Scholarship Vault */}
      <section className="my-xl max-w-3xl mx-auto">
        <h2 className="title-md text-center mb-lg">The Privacy Paradigm Shift</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="card" style={{ background: 'rgba(30, 15, 20, 0.4)', borderColor: 'rgba(244, 63, 94, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontWeight: 700, marginBottom: '1rem' }}>
              <XCircle size={20} />
              <span>Traditional Application</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>❌ Upload full marksheets & tax returns to third-party databases.</li>
              <li>❌ Vulnerable to hacks, data breaches, and identity theft.</li>
              <li>❌ Human reviewers see sensitive private financial details.</li>
              <li>❌ Permanent audit trail of personal income stored on servers.</li>
            </ul>
          </div>

          <div className="card card-accent" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, marginBottom: '1rem' }}>
              <CheckCircle2 size={20} />
              <span>Scholarship Vault (ZK)</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <li>✅ Pure zero-knowledge proof computed locally in your browser.</li>
              <li>✅ Only cryptographic truth is submitted to Midnight Preprod.</li>
              <li>✅ Impossible for anyone (including reviewers) to learn exact GPA/income.</li>
              <li>✅ Tamper-proof on-chain verification certificate.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3 Step Interactive Flow */}
      <section className="my-xl max-w-3xl mx-auto">
        <h2 className="title-md text-center mb-lg">How Verification Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              step: '01',
              title: 'Private Witness Inputs',
              desc: 'Enter your GPA and family income. These remain in your local browser sandbox as unexposed private witnesses.',
              icon: <EyeOff size={20} />,
              tag: 'Client-Side Private',
            },
            {
              step: '02',
              title: 'Compact WASM ZK Circuit',
              desc: 'The Midnight zk-SNARK compiler generates a proof proving (GPA >= min_gpa && income <= max_income).',
              icon: <Code2 size={20} />,
              tag: 'Prover Key Execution',
            },
            {
              step: '03',
              title: 'On-Chain Ledger Confirmation',
              desc: 'The proof is validated by Midnight validators. Your wallet address is verified eligible on Preprod with 0 data exposed.',
              icon: <ShieldCheck size={20} />,
              tag: 'Midnight Preprod',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              className="card"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1))',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent-light)'
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-light)', letterSpacing: '0.05em' }}>STEP {item.step}</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '480px' }}>{item.desc}</p>
                </div>
              </div>
              <span className="badge-pill" style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                {item.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Card */}
      <section className="my-2xl text-center">
        <div className="card card-accent max-w-2xl mx-auto card-glow" style={{ padding: '3rem 2rem' }}>
          <h2 className="title-lg mb-sm">Ready to generate your first ZK Proof?</h2>
          <p className="text-secondary mb-lg max-w-md mx-auto">
            Experience true privacy in action on Midnight Preprod. Test live with your Lace or 1AM wallet.
          </p>
          <Link to="/verify" className="btn btn-primary btn-lg">
            <ShieldCheck size={18} />
            <span>Launch Verification DApp</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
