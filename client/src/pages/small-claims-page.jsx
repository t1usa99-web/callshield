import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Scale } from 'lucide-react';
import { getCalls, updateCallStatus } from '../api/calls.js';
import { createClaim } from '../api/claims.js';
import { styles } from '../utils/styles.js';
import { BRAND, fmtDate } from '../utils/constants.js';

const CLAIM_STEPS = [
  { title: "Evaluate", desc: "Check eligibility" },
  { title: "Prepare", desc: "Gather evidence" },
  { title: "Documents", desc: "Prepare court forms" },
  { title: "File & Serve", desc: "Submit and notify" },
];

const EVIDENCE_CHECKLIST = [
  { key: "dnc_confirm", label: "DNC Registry confirmation (donotcall.gov)" },
  { key: "phone_records", label: "Phone records showing incoming call(s)" },
  { key: "call_log", label: "Your detailed call log from this app" },
  { key: "caller_research", label: "Research on the caller/company" },
  { key: "recording", label: "Call recording (if legal in your state)" },
  { key: "screenshots", label: "Screenshots of caller ID / voicemails" },
  { key: "prior_requests", label: "Evidence of prior do-not-call requests" },
  { key: "pattern", label: "Pattern of repeated calls documented" },
];

export const SmallClaimsPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedCall, setSelectedCall] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [completed, setCompleted] = useState(false);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      const data = await getCalls();
      setCalls(data);
    } catch (err) {
      setError('Failed to load calls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (key) => setChecklist((c) => ({ ...c, [key]: !c[key] }));
  const next = () => setStep((s) => Math.min(s + 1, CLAIM_STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setSelectedCall(null);
    setChecklist({});
    setCompleted(false);
    setError('');
  };

  const handleComplete = async () => {
    if (!selectedCall) return;

    setSubmitting(true);
    try {
      await createClaim({
        callId: selectedCall.id,
        status: 'filed',
        evidence: checklist,
      });

      await updateCallStatus(selectedCall.id, 'claim-filed');
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, textAlign: "center", padding: "50px 30px" }}>
            <Scale size={56} color={BRAND.success} style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, color: BRAND.success, marginBottom: 8 }}>You're Ready to File!</h2>
            <p style={{
              fontSize: 15,
              color: BRAND.muted,
              maxWidth: 520,
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}>
              Your case preparation is complete. Follow the steps below to file in your local small claims court.
            </p>
            <div style={{ ...styles.card, background: BRAND.light, textAlign: "left", maxWidth: 520, margin: "0 auto 24px" }}>
              <h4 style={{ fontWeight: 700, color: BRAND.primary, marginBottom: 10 }}>Filing Checklist:</h4>
              <div style={{ fontSize: 14, lineHeight: 2, color: BRAND.dark }}>
                <div><span style={{ fontWeight: 700, color: BRAND.accent }}>1.</span> Locate your local small claims court (search "[your county] small claims court")</div>
                <div><span style={{ fontWeight: 700, color: BRAND.accent }}>2.</span> Obtain and complete the plaintiff's claim form</div>
                <div><span style={{ fontWeight: 700, color: BRAND.accent }}>3.</span> Pay the filing fee (typically $30–$75)</div>
                <div><span style={{ fontWeight: 700, color: BRAND.accent }}>4.</span> File the claim and get your court date</div>
                <div><span style={{ fontWeight: 700, color: BRAND.accent }}>5.</span> Serve the defendant (the telemarketing company)</div>
                <div><span style={{ fontWeight: 700, color: BRAND.accent }}>6.</span> Attend your hearing with all evidence organized</div>
              </div>
            </div>
            <div style={{
              ...styles.card,
              background: BRAND.accent + "10",
              border: `1px solid ${BRAND.accent}30`,
              textAlign: "left",
              maxWidth: 520,
              margin: "0 auto 24px",
            }}>
              <h4 style={{ fontWeight: 700, color: BRAND.accent, marginBottom: 6 }}>Damages You Can Claim:</h4>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                <div><strong>$500</strong> per violation (standard TCPA damages)</div>
                <div><strong>$1,500</strong> per violation if willful/knowing (treble damages)</div>
                <div>Plus court filing fees and service costs</div>
              </div>
            </div>
            <button style={styles.btnPrimary} onClick={reset}>
              Prepare Another Claim
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Small Claims Court</h1>
        <p style={styles.subheading}>Pursue monetary compensation for TCPA violations. No lawyer needed.</p>

        {error && (
          <div style={{
            padding: 12,
            background: BRAND.danger + '10',
            borderRadius: 8,
            border: `1px solid ${BRAND.danger}30`,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <AlertTriangle size={18} color={BRAND.danger} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: BRAND.dark }}>{error}</span>
          </div>
        )}

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28, padding: "0 20px" }}>
          {CLAIM_STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < CLAIM_STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={styles.stepIndicator(i === step, i < step)}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <div style={{
                  fontSize: 10,
                  color: i <= step ? BRAND.primary : BRAND.muted,
                  fontWeight: 600,
                  marginTop: 4,
                  whiteSpace: "nowrap",
                }}>{s.title}</div>
              </div>
              {i < CLAIM_STEPS.length - 1 && <div style={styles.stepLine(i < step)} />}
            </div>
          ))}
        </div>

        <div style={styles.card}>
          {/* Step 0: Evaluate */}
          {step === 0 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>Evaluate Your Case</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 20 }}>Select a logged call to evaluate for a small claims filing.</p>
              {calls.length === 0 ? (
                <p style={{ fontSize: 14, color: BRAND.muted }}>No calls logged. Please log a violation first.</p>
              ) : (
                calls.map((call) => {
                  const strong = call.registeredOnDNC === "yes" && call.consentGiven === "no" && call.existingRelationship === "no";
                  return (
                    <div
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      style={{
                        padding: "14px 18px",
                        borderRadius: 10,
                        border: `2px solid ${selectedCall?.id === call.id ? BRAND.accent : "#e2e8f0"}`,
                        background: selectedCall?.id === call.id ? BRAND.accent + "08" : BRAND.white,
                        cursor: "pointer",
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{call.callerNumber || "Unknown"}</div>
                        <div style={{ fontSize: 12, color: BRAND.muted }}>
                          {fmtDate(call.date)} · {call.callType?.replace("-", " ")}
                        </div>
                      </div>
                      {strong && (
                        <span style={styles.badge(BRAND.success)}>Strong Case</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Step 1: Prepare Evidence */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>Gather Your Evidence</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 20 }}>
                Check off the evidence you have. Strong evidence = stronger case.
              </p>

              <div style={{ background: BRAND.light, padding: 20, borderRadius: 12, marginBottom: 20 }}>
                {EVIDENCE_CHECKLIST.map((item) => (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checklist[item.key]}
                      onChange={() => {}}
                      style={{
                        width: 18,
                        height: 18,
                        cursor: "pointer",
                      }}
                    />
                    <label style={{ cursor: "pointer", flex: 1, margin: 0, fontSize: 13, color: BRAND.dark }}>
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>

              <div style={{
                padding: 16,
                background: BRAND.primary + "08",
                borderRadius: 10,
                border: `1px solid ${BRAND.primary}15`,
                fontSize: 13,
                color: BRAND.dark,
              }}>
                <strong style={{ color: BRAND.primary }}>Pro tip:</strong> The more evidence you have, the better your case. At minimum, collect your call log from this app, your phone records, and DNC registry confirmation.
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>Prepare Your Documents</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 20 }}>
                Create a file with these documents organized for court.
              </p>

              <div style={{ background: BRAND.light, padding: 20, borderRadius: 12 }}>
                <div style={{ fontSize: 14, lineHeight: 2, color: BRAND.dark }}>
                  <div style={{ paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
                    <strong style={{ color: BRAND.primary }}>1. Complaint Form</strong>
                    <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 2 }}>
                      Obtain from your county's small claims court website
                    </div>
                  </div>
                  <div style={{ paddingTop: 12, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
                    <strong style={{ color: BRAND.primary }}>2. Evidence Packet</strong>
                    <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 2 }}>
                      All documents you checked off (DNC confirmation, call logs, phone records)
                    </div>
                  </div>
                  <div style={{ paddingTop: 12 }}>
                    <strong style={{ color: BRAND.primary }}>3. Demand Letter</strong>
                    <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 2 }}>
                      A letter sent to the defendant before filing (often required)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: File & Serve */}
          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 12 }}>
                Ready to File?
              </h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
                Complete your claim preparation. You'll receive a guide with all the steps to file and serve your case.
              </p>
              <button
                onClick={handleComplete}
                disabled={submitting}
                style={{
                  ...styles.btnPrimary,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Completing...' : 'Complete Claim Prep'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {step > 0 && (
            <button
              onClick={prev}
              style={{
                ...styles.btnSecondary,
                flex: 1,
                justifyContent: "center",
              }}
            >
              Back
            </button>
          )}
          {step < CLAIM_STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={step === 0 && !selectedCall}
              style={{
                ...styles.btnPrimary,
                flex: 1,
                justifyContent: "center",
                opacity: step === 0 && !selectedCall ? 0.5 : 1,
                cursor: step === 0 && !selectedCall ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
