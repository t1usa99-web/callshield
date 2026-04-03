import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCalls, deleteCall, updateCallStatus, getCall } from '../api/calls.js';
import { ChevronLeft, Eye, Edit3, Trash2, Phone } from 'lucide-react';
import { styles } from '../utils/styles.js';
import { BRAND, STATUS_MAP, fmtDate } from '../utils/constants.js';

export const MyCallsPage = () => {
  const navigate = useNavigate();
  const { id: viewingId } = useParams();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState(viewingId || null);
  const [viewedCall, setViewedCall] = useState(null);

  useEffect(() => {
    loadCalls();
  }, []);

  useEffect(() => {
    if (viewing && !viewedCall) {
      loadViewedCall();
    }
  }, [viewing]);

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

  const loadViewedCall = async () => {
    try {
      const data = await getCall(viewing);
      setViewedCall(data);
    } catch (err) {
      console.error('Failed to load call:', err);
    }
  };

  const handleDelete = async (callId) => {
    if (!window.confirm('Are you sure you want to delete this call?')) return;

    try {
      await deleteCall(callId);
      setCalls(prev => prev.filter(c => c.id !== callId));
      if (viewing === callId) {
        setViewing(null);
        setViewedCall(null);
      }
    } catch (err) {
      setError('Failed to delete call');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (callId, newStatus) => {
    try {
      await updateCallStatus(callId, newStatus);
      setCalls(prev => prev.map(c => c.id === callId ? { ...c, status: newStatus } : c));
      if (viewing === callId) {
        setViewedCall(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
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

  // Detail view
  if (viewing && viewedCall) {
    const st = STATUS_MAP[viewedCall.status] || STATUS_MAP.logged;

    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={{ ...styles.btnSecondary, marginBottom: 20, border: "none", padding: "6px 0" }}
            onClick={() => {
              setViewing(null);
              setViewedCall(null);
              navigate('/calls');
            }}
          >
            <ChevronLeft size={16} /> Back to All Calls
          </button>

          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: BRAND.primary }}>
                  {viewedCall.callerNumber || "Unknown Number"}
                </h2>
                <p style={{ fontSize: 14, color: BRAND.muted, marginTop: 4 }}>
                  {viewedCall.callerName}{viewedCall.callerCompany ? ` · ${viewedCall.callerCompany}` : ""} · {fmtDate(viewedCall.date)} {viewedCall.time && `at ${viewedCall.time}`}
                </p>
              </div>
              <span style={styles.badge(st.color)}>{st.label}</span>
            </div>

            <div style={{ ...styles.grid2, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: BRAND.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                  Type of Call
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.primary }}>
                  {viewedCall.callType === 'robocall' && 'Automated/Robocall'}
                  {viewedCall.callType === 'live-telemarketer' && 'Live Telemarketer'}
                  {viewedCall.callType === 'prerecorded' && 'Prerecorded Message'}
                  {viewedCall.callType === 'text' && 'Text Message (SMS)'}
                  {viewedCall.callType === 'other' && 'Other'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: BRAND.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                  State
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.primary }}>
                  {viewedCall.state || 'Not specified'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: BRAND.primary, marginBottom: 12 }}>Eligibility</h4>
              <div style={{ ...styles.grid2, gap: 12 }}>
                <div style={{ padding: 12, background: BRAND.light, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>DNC Registry</div>
                  <div style={{ fontWeight: 700, color: BRAND.primary }}>
                    {viewedCall.registeredOnDNC === 'yes' ? 'Yes' : viewedCall.registeredOnDNC === 'no' ? 'No' : 'Unsure'}
                  </div>
                </div>
                <div style={{ padding: 12, background: BRAND.light, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>Consent Given</div>
                  <div style={{ fontWeight: 700, color: BRAND.primary }}>
                    {viewedCall.consentGiven === 'no' ? 'No' : viewedCall.consentGiven === 'yes' ? 'Yes' : 'Unsure'}
                  </div>
                </div>
              </div>
            </div>

            {viewedCall.notes && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: BRAND.primary, marginBottom: 12 }}>Notes</h4>
                <p style={{ fontSize: 14, color: BRAND.dark, lineHeight: 1.6, margin: 0 }}>
                  {viewedCall.notes}
                </p>
              </div>
            )}

            {viewedCall.registeredOnDNC === "yes" && viewedCall.consentGiven === "no" && viewedCall.existingRelationship === "no" && (
              <div style={{
                padding: 16,
                background: BRAND.success + "10",
                borderRadius: 12,
                border: `1px solid ${BRAND.success}30`,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.success, marginBottom: 8 }}>
                  Strong Potential Claim
                </div>
                <p style={{ fontSize: 13, color: BRAND.dark, margin: 0, lineHeight: 1.6 }}>
                  Based on the information, this call likely violates the TCPA. You may be entitled to $500–$1,500 in damages.
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, borderTop: `1px solid #e2e8f0`, paddingTop: 20 }}>
              <select
                value={viewedCall.status}
                onChange={(e) => handleUpdateStatus(viewedCall.id, e.target.value)}
                style={{
                  ...styles.select,
                  flex: 1,
                }}
              >
                <option value="logged">Logged</option>
                <option value="complaint-filed">Complaint Filed</option>
                <option value="claim-filed">Claim Filed</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                style={styles.btnSecondary}
                onClick={() => navigate(`/calls/${viewedCall.id}/edit`)}
              >
                <Edit3 size={16} /> Edit
              </button>
              <button
                style={styles.btnDanger}
                onClick={() => handleDelete(viewedCall.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>My Calls</h1>
        <p style={styles.subheading}>
          {calls.length === 0
            ? "You haven't logged any calls yet. Start documenting violations to build your case."
            : `You have ${calls.length} call${calls.length !== 1 ? 's' : ''} logged.`}
        </p>

        {error && (
          <div style={{
            padding: 12,
            background: BRAND.danger + '10',
            borderRadius: 8,
            border: `1px solid ${BRAND.danger}30`,
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 13, color: BRAND.dark }}>{error}</span>
          </div>
        )}

        {calls.length === 0 ? (
          <div style={styles.card}>
            <div style={{ textAlign: "center", padding: "40px 0", color: BRAND.muted }}>
              <Phone size={40} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 15 }}>No calls logged yet.</p>
              <button
                style={{ ...styles.btnPrimary, marginTop: 16 }}
                onClick={() => navigate('/log')}
              >
                Log Your First Call
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.card}>
            {calls.map((call) => {
              const st = STATUS_MAP[call.status] || STATUS_MAP.logged;
              return (
                <div
                  key={call.id}
                  style={{
                    padding: "16px",
                    marginBottom: "12px",
                    background: BRAND.light,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div
                    onClick={() => {
                      setViewing(call.id);
                      navigate(`/calls/${call.id}`);
                    }}
                    style={{
                      flex: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: BRAND.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {call.callerNumber || "Unknown Number"}
                      </div>
                      <div style={{ fontSize: 12, color: BRAND.muted }}>
                        {call.callerName ? call.callerName + " · " : ""}
                        {fmtDate(call.date)}
                      </div>
                    </div>
                  </div>

                  <span style={styles.badge(st.color)}>{st.label}</span>

                  <button
                    style={{ ...styles.btnSecondary, padding: '6px 12px' }}
                    onClick={() => {
                      setViewing(call.id);
                      navigate(`/calls/${call.id}`);
                    }}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
