import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Hash, Phone, MessageSquare, MapPin, CheckCircle, ClipboardList, AlertTriangle } from 'lucide-react';
import { createCall, updateCall, getCall } from '../api/calls.js';
import { styles } from '../utils/styles.js';
import { BRAND, fmtDate } from '../utils/constants.js';

export const LogCallPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    callerNumber: '',
    callerName: '',
    callerCompany: '',
    callType: 'robocall',
    registeredOnDNC: 'yes',
    consentGiven: 'no',
    existingRelationship: 'no',
    state: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadCall();
    }
  }, [id]);

  const loadCall = async () => {
    try {
      const data = await getCall(id);
      setForm(data);
    } catch (err) {
      setError('Failed to load call');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const upd = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.callerNumber) {
      setError('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (id) {
        await updateCall(id, form);
      } else {
        await createCall(form);
      }
      navigate('/calls');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save call');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/calls');
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>{id ? 'Edit Call' : 'Log a Call'}</h1>
        <p style={styles.subheading}>
          {id
            ? 'Update the details of this call to ensure accurate records.'
            : 'Document every unwanted call. Detailed records are essential for building your case.'}
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

        <form onSubmit={handleSubmit}>
          {/* Call Details */}
          <div style={styles.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} /> Call Details
            </h3>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Date of Call *</label>
                <input
                  style={styles.input}
                  type="date"
                  value={form.date}
                  onChange={(e) => upd('date', e.target.value)}
                />
              </div>
              <div>
                <label style={styles.label}>Time (optional)</label>
                <input
                  style={styles.input}
                  type="time"
                  value={form.time}
                  onChange={(e) => upd('time', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Caller Information */}
          <div style={styles.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={18} /> Caller Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={styles.label}>Phone Number *</label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={form.callerNumber}
                  onChange={(e) => upd('callerNumber', e.target.value)}
                />
              </div>
              <div>
                <label style={styles.label}>Caller Name (if known)</label>
                <input
                  style={styles.input}
                  placeholder="e.g., John Smith"
                  value={form.callerName}
                  onChange={(e) => upd('callerName', e.target.value)}
                />
              </div>
              <div>
                <label style={styles.label}>Company (if known)</label>
                <input
                  style={styles.input}
                  placeholder="e.g., ABC Telemarketing"
                  value={form.callerCompany}
                  onChange={(e) => upd('callerCompany', e.target.value)}
                />
              </div>
              <div>
                <label style={styles.label}>Type of Call</label>
                <select style={styles.select} value={form.callType} onChange={(e) => upd('callType', e.target.value)}>
                  <option value="robocall">Automated/Robocall</option>
                  <option value="live-telemarketer">Live Telemarketer</option>
                  <option value="prerecorded">Prerecorded Message</option>
                  <option value="text">Text Message (SMS)</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Your State</label>
                <input
                  style={styles.input}
                  placeholder="e.g. California"
                  value={form.state}
                  onChange={(e) => upd('state', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Eligibility Questions */}
          <div style={styles.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <ClipboardList size={18} /> Eligibility Questions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={styles.label}>Is your number registered on the National Do Not Call Registry?</label>
                <select style={styles.select} value={form.registeredOnDNC} onChange={(e) => upd('registeredOnDNC', e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unsure">I'm not sure</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Did you give this company permission to call you?</label>
                <select style={styles.select} value={form.consentGiven} onChange={(e) => upd('consentGiven', e.target.value)}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="unsure">I'm not sure</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Do you have an existing business relationship with the caller?</label>
                <select style={styles.select} value={form.existingRelationship} onChange={(e) => upd('existingRelationship', e.target.value)}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="unsure">I'm not sure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div style={styles.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={18} /> Additional Notes
            </h3>
            <textarea
              style={styles.textarea}
              placeholder="Describe what happened on the call, what was said, any products or services pitched, etc."
              value={form.notes}
              onChange={(e) => upd('notes', e.target.value)}
            />
          </div>

          {/* Eligibility indicator */}
          {form.registeredOnDNC === "yes" && form.consentGiven === "no" && form.existingRelationship === "no" && (
            <div style={{ ...styles.card, background: BRAND.success + "10", border: `1px solid ${BRAND.success}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={22} color={BRAND.success} />
                <div>
                  <div style={{ fontWeight: 700, color: BRAND.success, fontSize: 15 }}>Strong Potential Claim</div>
                  <div style={{ fontSize: 13, color: BRAND.dark, marginTop: 2 }}>
                    Based on your answers, this call likely violates the TCPA. You may be entitled to $500–$1,500 in damages.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.btnPrimary,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              <CheckCircle size={16} /> {submitting ? 'Saving...' : (id ? "Save Changes" : "Log This Call")}
            </button>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
