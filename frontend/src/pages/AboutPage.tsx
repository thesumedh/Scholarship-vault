import React from 'react';
import { Shield, BookOpen, Code, Terminal, ExternalLink } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../config';

export default function AboutPage() {
  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-lg mb-xs">About Scholarship Vault</h1>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Zero-Knowledge cryptographic model for private student credential verification on Midnight.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div className="card">
          <h2 className="title-sm mb-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <BookOpen size={16} />
            <span>Problem &amp; Motivation</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Traditional scholarship procedures demand students to upload transcripts, tax returns, and bank statements to centralized web databases. This exposes sensitive personal and financial data to leaks, identity theft, and unnecessary disclosure to administrative reviewers.
          </p>
        </div>

        <div className="card">
          <h2 className="title-sm mb-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Shield size={16} />
            <span>The Midnight Privacy Approach</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Scholarship Vault shifts evaluation to the user's browser using client-side WASM zk-SNARK circuits:
          </p>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li><strong>Private Witnesses:</strong> Your GPA and family income never leave your device.</li>
            <li><strong>Circuit Evaluation:</strong> Math assertion runs locally: <code>gpa &gt;= min_gpa &amp;&amp; income &lt;= max_income</code>.</li>
            <li><strong>Public Ledger State:</strong> Only threshold definitions and proof verification booleans are stored on-chain.</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="title-sm mb-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Code size={16} />
            <span>Compact Smart Contract</span>
          </h2>
          <pre className="font-mono" style={{ 
            background: 'var(--bg-input)', 
            padding: '0.85rem', 
            borderRadius: 'var(--radius-xs)', 
            border: '1px solid var(--border-subtle)', 
            fontSize: '0.8rem', 
            color: 'var(--text-primary)',
            overflowX: 'auto',
            lineHeight: 1.45,
            marginTop: '0.5rem'
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
        </div>

        <div className="card">
          <h2 className="title-sm mb-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Terminal size={16} />
            <span>Builder &amp; Open Source</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Created by <a href="https://github.com/thesumedh" target="_blank" rel="noreferrer" style={{ color: '#fff', fontWeight: 600 }}>@thesumedh</a> for the Midnight Buildthon.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a href="https://github.com/thesumedh/Scholarship-vault" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              <span>GitHub</span>
              <ExternalLink size={11} />
            </a>
            <a href="https://x.com/ScholrshipVault" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              <span>𝕏 @ScholrshipVault</span>
              <ExternalLink size={11} />
            </a>
            <a href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              <span>1AM Explorer</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
