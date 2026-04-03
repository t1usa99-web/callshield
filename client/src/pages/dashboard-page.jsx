import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, FileText, Scale, Plus } from 'lucide-react';
import { getCalls } from '../api/calls.js';
import { useAuth } from '../hooks/use-auth.js';
import { styles } from '../utils/styles.js';
import { BRAND, STATUS_MAP, fmtDate } from '../utils/constants.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    loadCalls();
  }, []);

  const total = calls.length;
  const complaints = calls.filter((c) => c.status === "complaint-filed" || c.status === "claim-filed" || c.status === "resolved").length;
  const claims = calls.filter((c) => c.status === "claim-filed" || c.status === "resolved").length;
  const potentialComp = calls.reduce((sum, c) => {
    if (c.callType === "robocall") return sum + 1500;
    if (c.callType === "live-telemarketer") return sum + 500;
    return sum + 500;
  }, 0);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...styles.heading, fontSize: 30 }}>Welcome to CallShield</h1>
          <p style={styles.subheading}>
            Track unwanted calls, file complaints, and pursue compensation for Do Not Call violations.
            {user?.phoneNumber && (
              <span style={{ display: "block", marginTop: 6 }}>
                <span style={styles.tag}><Shield size={12} /> Protecting: {user.phoneNumber}</span>
                {user?.dncStatus === "yes" && <span style={{ ...styles.badge(BRAND.success), marginLeft: 8 }}>DNC Registered</span>}
                {user?.dncStatus !== "yes" && <span style={{ ...styles.badge(BRAND.accent), marginLeft: 8 }}>DNC Pending</span>}
              </span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div style={{ ...styles.grid3, marginBottom: 28 }}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{total}</div>
            <div style={styles.statLabel}>Calls Logged</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNum, color: BRAND.accent }}>{complaints}</div>
            <div style={styles.statLabel}>Complaints Filed</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNum, color: BRAND.success }}>${potentialComp.toLocaleString()}</div>
            <div style={styles.statLabel}>Potential Compensation</div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={styles.card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 16 }}>Quick Actions</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate('/log')}
            >
              <Plus size={16} /> Log a Call
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate('/file')}
            >
              <FileText size={16} /> File a Complaint
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate('/claims')}
            >
              <Scale size={16} /> Start a Claim
            </button>
          </div>
        </div>

        {/* Recent calls */}
        <div style={styles.card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: BRAND.primary, marginBottom: 16 }}>Recent Violations</h2>
          {calls.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: BRAND.muted }}>
              <Phone size={40} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 15 }}>No calls logged yet. Start by logging your first violation.</p>
              <button
                style={{ ...styles.btnPrimary, marginTop: 16 }}
                onClick={() => navigate('/log')}
              >
                <Plus size={16} /> Log Your First Call
              </button>
            </div>
          ) : (
            <div>
              {calls.slice(0, 5).map((call) => {
                const st = STATUS_MAP[call.status] || STATUS_MAP.logged;
                return (
                  <div
                    key={call.id}
                    onClick={() => navigate(`/calls/${call.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 0",
                      borderBottom: "1px solid #edf2f7",
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: BRAND.primary + "10",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Phone size={18} color={BRAND.primary} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{call.callerNumber || "Unknown Number"}</div>
                        <div style={{ fontSize: 12, color: BRAND.muted }}>
                          {call.callerName ? call.callerName + " · " : ""}
                          {fmtDate(call.date)}
                        </div>
                      </div>
                    </div>
                    <span style={styles.badge(st.color)}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
