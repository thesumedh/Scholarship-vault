import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Code, Terminal, Github, Twitter } from 'lucide-react';

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
                    <a href="https://github.com/DeepSaha25/ScholarShield" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Github size={16} /> View Source
                    </a>
                    <a href="https://x.com/thesumedh_" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Twitter size={16} /> @thesumedh_
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
