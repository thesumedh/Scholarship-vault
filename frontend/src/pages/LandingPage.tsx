import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Zap, ChevronRight, User, Cpu, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="badge-pill">
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-color)', display: 'inline-block' }} />
            Powered by Midnight Network
          </div>
          <h1 className="hero-title">
            Verify Eligibility with{' '}
            <span className="text-gradient">Zero-Knowledge</span>
          </h1>
          <p className="hero-subtitle">
            Prove your scholarship qualifications without revealing your GPA or Family Income.
            True privacy, fully on-chain.
          </p>
          <div className="hero-actions">
            <Link to="/verify" className="btn btn-primary btn-lg">
              Start Verification <ChevronRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              How it works
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="stats-section my-xl">
        <div className="card max-w-3xl mx-auto" style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', background: 'linear-gradient(135deg, rgba(167,139,250,0.05), rgba(129,140,248,0.05))', borderColor: 'rgba(167,139,250,0.2)' }}>
          {[['5,000+', 'Proofs Verified'], ['$1.2M', 'Scholarships Awarded'], ['100%', 'Data Privacy']].map(([val, label]) => (
            <div key={label} style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section mb-xl">
        <div className="features-grid">
          {[
            { icon: <LockKeyhole size={28} />, title: 'Absolute Privacy', desc: 'Your data stays on your device. Only a cryptographic proof is sent to the network.', delay: 0.1 },
            { icon: <ShieldCheck size={28} />, title: 'On-Chain Verification', desc: 'The Midnight blockchain verifies the ZK proof transparently and immutably.', delay: 0.2 },
            { icon: <Zap size={28} />, title: 'Instant Decisions', desc: 'Get an immediate, verifiable decision on your scholarship application.', delay: 0.3 },
          ].map(({ icon, title, desc, delay }) => (
            <motion.div
              key={title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay }}
            >
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works my-xl max-w-3xl mx-auto">
        <h2 className="title-md text-center mb-xl">How ScholarShield Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { icon: <User size={22} />, step: '01', title: 'Enter Credentials Locally', desc: 'Input your GPA and Income into the app. It never leaves your browser.' },
            { icon: <Cpu size={22} />, step: '02', title: 'ZK Proof Generation', desc: 'A WASM circuit compiles your inputs into a zero-knowledge proof, asserting you meet the criteria without exposing the actual numbers.' },
            { icon: <Database size={22} />, step: '03', title: 'Blockchain Verification', desc: "The proof is submitted to the Midnight Preprod Network. If valid, the contract marks your address as 'eligible'." },
          ].map(({ icon, step, title, desc }) => (
            <div key={step} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: 44, height: 44, borderRadius: 10, background: 'var(--accent-glow)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.2rem' }}>STEP {step}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: '2rem' }}>
        <h2 className="title-md mb-md">Ready to prove your eligibility?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No data leaves your device. Ever.</p>
        <Link to="/verify" className="btn btn-primary btn-lg">
          Launch App <ChevronRight size={18} />
        </Link>
      </section>
    </div>
  );
}
