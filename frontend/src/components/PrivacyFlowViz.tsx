import React from 'react';
import { Lock, Cpu, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

export default function PrivacyFlowViz({ status }: { status: VerifyStatus }) {
  const steps = [
    { 
      id: 'local', 
      label: 'Your Private Data', 
      sublabel: 'GPA & Income stay on device', 
      icon: <Lock size={24} />, 
      active: status === 'proving' || status === 'submitting' || status === 'eligible' || status === 'ineligible' 
    },
    { 
      id: 'circuit', 
      label: 'ZK Circuit (Local)', 
      sublabel: 'Proof computed in WASM', 
      icon: <Cpu size={24} />, 
      active: status === 'proving' 
    },
    { 
      id: 'chain', 
      label: 'Midnight Blockchain', 
      sublabel: 'Cryptographic proof recorded', 
      icon: <LinkIcon size={24} />, 
      active: status === 'submitting' || status === 'eligible' || status === 'ineligible' 
    },
  ];

  return (
    <div className="card privacy-viz-card">
      <h3 className="section-title">Observable Privacy Behavior</h3>
      <div className="privacy-steps-container">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <motion.div
              className={`privacy-step ${step.active ? 'active' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.label}</div>
              <div className="step-sublabel">{step.sublabel}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="step-arrow">
                <ArrowRight size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="privacy-notice">
        <Lock size={16} className="inline-icon" />
        <span><strong>Your actual GPA and income are never sent to the network.</strong> The Midnight blockchain only records a cryptographic proof that you satisfy the eligibility threshold — nothing more.</span>
      </div>
    </div>
  );
}
