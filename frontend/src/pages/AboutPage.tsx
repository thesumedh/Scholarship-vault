import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Code, Terminal } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--accent-glow)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--accent-color)' }}>
            <Shield size={32} />
          </div>
          <h1 className="title-lg mb-sm">About ScholarShield</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Privacy-preserving eligibility verification built on the Midnight Network.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            {
              icon: <BookOpen size={20} />,
              title: 'The Problem',
              delay: 0.1,
              content: (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Traditional scholarship applications require students to submit highly sensitive personal information —
                  family income, academic transcripts — stored on centralized servers, creating significant privacy risks
                  and potential for data breaches.
                </p>
              ),
            },
            {
              icon: <Code size={20} />,
              title: 'The ZK Solution',
              delay: 0.2,
              content: (
                <>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    ScholarShield uses Midnight's Zero-Knowledge capabilities to invert this model. Instead of sending
                    your data to an authority, the authority's rules (the smart contract) are sent to your device.
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li>Your GPA and Income act as <strong style={{ color: 'var(--text-primary)' }}>private witnesses</strong>.</li>
                    <li>A local WASM circuit computes whether you meet the criteria.</li>
                    <li>Only a cryptographic proof is submitted to the blockchain.</li>
                    <li>Your private data never leaves your browser.</li>
                  </ul>
                </>
              ),
            },
            {
              icon: <Terminal size={20} />,
              title: 'Open Source · Midnight Buildthon',
              delay: 0.3,
              content: (
                <>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                    Built for the <strong style={{ color: 'var(--text-primary)' }}>Midnight Buildthon</strong> by{' '}
                    <a href="https://github.com/thesumedh" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>@thesumedh</a>.
                    Smart contract written in Compact; frontend uses React + Midnight.js SDK.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a href="https://github.com/thesumedh/Scholarship-vault" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> View Source
                    </a>
                    <a href="https://x.com/thesumedh_" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> @thesumedh_
                    </a>
                  </div>
                </>
              ),
            },
          ].map(({ icon, title, delay, content }) => (
            <motion.section
              key={title}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-color)' }}>{icon}</span> {title}
              </h2>
              {content}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
