import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { getCalls, updateCallStatus } from '../api/calls.js';
import { createComplaint } from '../api/complaints.js';
import { styles } from '../utils/styles.js';
import { BRAND, fmtDate } from '../utils/constants.js';

const COMPLAINT_STEPS = [
  { title: "Choose Agency", desc: "Select where to file" },
  { title: "Select Call", desc: "Link a logged violation" },
  { title: "Review Info", desc: "Confirm your details" },
  { title: "File", desc: "Submit your complaint" },
];

export const FileComplaintPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [agency, setAgency] = useState("");
  const [selectedCall, setSelectedCall] = useState(null);
  const [filed, setFiled] = useState(false);
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

  const next = () => setStep((s) => Math.min(s + 1, COMPLAINT_STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setAgency("");
    setSelectedCall(null);
    setFiled(false);
    setError('');
  };

  const handleFile = async () => {
    if (!selectedCall) return;

    setSubmitting(true);
    try {
      await createComplaint({
        callId: selectedCall.id,
        agency: agency,
        status: 'filed',
      });

      await updateCallStatus(selectedCall.id, 'complaint-filed');
      setFiled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file complaint');
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

  if (filed) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, textAlign: "center", padding: "50px 30px" }}>
            <CheckCircle size={56} color={BRAND.success} style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, color: BRAND.success, marginBottom: 8 }}>Complaint Guide Ready!</h2>
            <p style={{
              fontSize: 15,
              color: BRAND.muted,
              maxWidth: 500,
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}>
              We've prepared everything you need. Follow the link below to submit your complaint to the {agency === "ftc" ? "FTC" : "FCC"}.
            </p>
            <div style={{ ...styles.card, background: BRAND.light, textAlign: "left", maxWidth: 500, margin: "0 auto 24px" }}>
              <h4 style={{ fontWeight: 700, color: BRAND.primary, marginBottom: 10 }}>Next Steps:</h4>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: BRAND.dark }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent }}>1.</span>
                  Visit <strong>{agency === "ftc" ? "ReportFraud.ftc.gov" : "consumercomplaints.fcc.gov"}</strong>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent }}>2.</span>
                  Select "<strong>{agency === "ftc" ? "Unwanted Telemarketing, Calls, or Texts" : "Unwanted Calls"}</strong>"
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent }}>3.</span>
                  Enter the caller details from your logged record
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent }}>4.</span>
                  Submit and save your confirmation number
                </div>
              </div>
            </div>
            <button style={styles.btnPrimary} onClick={reset}>
              File Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>File a Complaint</h1>
        <p style={styles.subheading}>
          We'll walk you through filing a complaint with the FTC or FCC step by step.
        </p>

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
          {COMPLAINT_STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < COMPLAINT_STEPS.length - 1 ? 1 : "none" }}>
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
              {i < COMPLAINT_STEPS.length - 1 && <div style={styles.stepLine(i < step)} />}
            </div>
          ))}
        </div>

        <div style={styles.card}>
          {/* Step 0: Choose agency */}
          {step === 0 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>Where would you like to file?</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 20 }}>Both are free. You can file with both agencies for maximum impact.</p>
              <div style={styles.grid2}>
                {[
                  { key: "ftc", name: "FTC (Federal Trade Commission)", desc: "Enforces the Do Not Call Registry. Best for telemarketing violations." },
                  { key: "fcc", name: "FCC (Federal Communications Commission)", desc: "Regulates phone communications. Best for robocalls and caller ID spoofing." },
                ].map((a) => (
                  <div
                    key={a.key}
                    onClick={() => setAgency(a.key)}
                    style={{
                      padding: 20,
                      border: `2px solid ${agency === a.key ? BRAND.accent : "#e2e8f0"}`,
                      borderRadius: 12,
                      background: agency === a.key ? BRAND.accent + "10" : BRAND.white,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>
                      {a.name}
                    </div>
                    <p style={{ fontSize: 13, color: BRAND.muted, margin: 0 }}>
                      {a.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Select Call */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>Which call do you want to report?</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 20 }}>
                Select a logged call to link to this complaint.
              </p>
              {calls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: BRAND.muted }}>
                  <p style={{ marginBottom: 16 }}>You don't have any logged calls yet.</p>
                  <button
                    style={styles.btnPrimary}
                    onClick={() => navigate('/log')}
                  >
                    Log a Call First
                  </button>
                </div>
              ) : (
                <div>
                  {calls.map((call) => (
                    <div
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      style={{
                        padding: 16,
                        marginBottom: 12,
                        border: `2px solid ${selectedCall?.id === call.id ? BRAND.accent : "#e2e8f0"}`,
                        borderRadius: 10,
                        background: selectedCall?.id === call.id ? BRAND.accent + "10" : BRAND.white,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.primary }}>
                        {call.callerNumber || "Unknown Number"}
                      </div>
                      <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 4 }}>
                        {call.callerName}{call.callerCompany ? ` · ${call.callerCompany}` : ""} · {fmtDate(call.date)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Review Info */}
          {step === 2 && selectedCall && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>Confirm Your Details</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 20 }}>
                Make sure everything looks correct before filing.
              </p>

              <div style={{ background: BRAND.light, padding: 20, borderRadius: 12, marginBottom: 20 }}>
                <div style={styles.grid2}>
                  <div>
                    <div style={{ fontSize: 12, color: BRAND.muted, fontWeight: 600, marginBottom: 4 }}>Caller Number</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.primary }}>
                      {selectedCall.callerNumber || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: BRAND.muted, fontWeight: 600, marginBottom: 4 }}>Date</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.primary }}>
                      {fmtDate(selectedCall.date)}
                    </div>
                  </div>
                </div>
                {selectedCall.callerName && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, color: BRAND.muted, fontWeight: 600, marginBottom: 4 }}>Caller Name</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.primary }}>
                      {selectedCall.callerName}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                padding: 16,
                background: BRAND.primary + "08",
                borderRadius: 10,
                border: `1px solid ${BRAND.primary}15`,
                fontSize: 13,
                lineHeight: 1.6,
              }}>
                <strong style={{ color: BRAND.primary }}>Ready to file?</strong>
                <p style={{ margin: '8px 0 0 0', color: BRAND.dark }}>
                  The next step will show you exactly where to submit your complaint online.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: File */}
          {step === 3 && selectedCall && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 12 }}>
                Ready to Submit?
              </h3>
              <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 24 }}>
                Click the button below to file your complaint with the {agency === "ftc" ? "FTC" : "FCC"}.
              </p>
              <button
                onClick={handleFile}
                disabled={submitting}
                style={{
                  ...styles.btnPrimary,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Filing...' : 'File Complaint'}
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
          {step < COMPLAINT_STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={(step === 0 && !agency) || (step === 1 && !selectedCall)}
              style={{
                ...styles.btnPrimary,
                flex: 1,
                justifyContent: "center",
                opacity: (step === 0 && !agency) || (step === 1 && !selectedCall) ? 0.5 : 1,
                cursor: (step === 0 && !agency) || (step === 1 && !selectedCall) ? 'not-allowed' : 'pointer',
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
