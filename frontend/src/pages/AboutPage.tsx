import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Code, Terminal, Layers, Lock, Cpu, Database, ExternalLink } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../config';

export default function AboutPage() {
  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <motion.div
        className="mb-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ 
          width: 56, 
          height: 56, 
          borderRadius: 'var(--radius-md)', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.15))', 
          border: '1px solid rgba(167, 139, 250, 0.3)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1.25rem', 
          color: 'var(--accent-light)',
          boxShadow: '0 0 25px var(--accent-glow)'
        }}>
          <Shield size={28} />
        </div>
        <h1 className="title-lg mb-xs">
          About <span className="text-gradient">Scholarship Vault</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Zero-Knowledge cryptographic architecture on the Midnight Privacy Network.
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* The Problem & Solution Card */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="title-sm mb-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-light)' }}>
            <BookOpen size={18} />
            <span>The Traditional Privacy Dilemma</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.925rem' }}>
            Conventional scholarship programs require applicants to hand over highly sensitive financial records, tax filings, and academic transcripts. These are retained on centralized cloud servers where they are vulnerable to hacks, credential harvesting, and unauthorized employee inspection.
          </p>
        </motion.div>

        {/* Midnight Privacy Architecture */}
        <motion.div 
          className="card card-accent"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="title-sm mb-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <Lock size={18} />
            <span>The Midnight Privacy Model</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
            In Midnight's <strong>Compact</strong> smart contract language, data only crosses into public domains when explicitly disclosed. The verification circuit runs entirely in the student's browser sandbox:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                🔒 Private Witnesses
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Actual GPA (e.g. 8.75)</li>
                <li>Actual Family Income (e.g. ₹1,80,000)</li>
                <li>Client Secret Proving Keys</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                🌐 Public Ledger State
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Minimum GPA Threshold (8.00)</li>
                <li>Maximum Income Threshold (₹2,50,000)</li>
                <li>Proof Verification Boolean (True/False)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Smart Contract Source Snippet */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="title-sm mb-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
            <Code size={18} />
            <span>Compact Smart Contract (`contracts/scholarship.compact`)</span>
          </h2>
          <pre className="font-mono" style={{ 
            background: 'rgba(5, 5, 10, 0.9)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-subtle)', 
            fontSize: '0.825rem', 
            color: '#c4b5fd',
            overflowX: 'auto',
            lineHeight: 1.5
          }}>
{`pragma language_version >=0.22.0;

export ledger min_gpa: Uint<32>;
export ledger max_income: Uint<32>;

constructor(initial_min_gpa: Uint<32>, initial_max_income: Uint<32>) {
    min_gpa = disclose(initial_min_gpa);
    max_income = disclose(initial_max_income);
}

export circuit verify_eligibility(gpa: Uint<32>, income: Uint<32>): [] {
    assert(gpa >= min_gpa, "GPA does not meet minimum requirement");
    assert(income <= max_income, "Income exceeds maximum threshold");
}`}
          </pre>
        </motion.div>

        {/* Builder Profile & Links */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="title-sm mb-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <Terminal size={18} style={{ color: 'var(--accent-light)' }} />
            <span>Open Source &amp; Builder Info</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Built for the <strong>Midnight Buildthon</strong> by <a href="https://github.com/thesumedh" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>@thesumedh</a>.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="https://github.com/thesumedh/Scholarship-vault" target="_blank" rel="noreferrer" className="btn btn-secondary">
              <span>GitHub Repository</span>
              <ExternalLink size={13} />
            </a>
            <a href="https://x.com/thesumedh_" target="_blank" rel="noreferrer" className="btn btn-secondary">
              <span>𝕏 @thesumedh_</span>
              <ExternalLink size={13} />
            </a>
            <a href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <span>1AM Preprod Explorer</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
