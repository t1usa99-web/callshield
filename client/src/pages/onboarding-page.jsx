import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, ArrowRight, ClipboardList, Phone, FileText, Scale } from 'lucide-react';
import { useAuth } from '../hooks/use-auth.js';
import { styles } from '../utils/styles.js';
import { BRAND } from '../utils/constants.js';

const ONBOARDING_STEPS = [
  { title: "Welcome", desc: "Get started" },
  { title: "Your Info", desc: "Phone & email" },
  { title: "Check DNC", desc: "Registry status" },
  { title: "Register", desc: "Sign up for DNC" },
  { title: "All Set", desc: "Start using app" },
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { updateUser, isLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    phoneNumber: "",
    email: "",
    dncStatus: "",
    registrationDate: "",
    confirmationNote: "",
  });

  const upd = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const next = () => setStep((s) => Math.min(s + 1, ONBOARDING_STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleComplete = async () => {
    try {
      await updateUser({
        phoneNumber: form.phoneNumber,
        dncStatus: form.dncStatus,
        dncRegistrationDate: form.registrationDate,
        onboardingComplete: true,
      });
      navigate('/');
    } catch (err) {
      console.error('Onboarding completion error:', err);
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: BRAND.gradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: 20,
    overflowY: "auto",
  };

  const panelStyle = {
    background: BRAND.white,
    borderRadius: 20,
    padding: "40px 36px",
    maxWidth: 580,
    width: "100%",
    boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: BRAND.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Shield size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: BRAND.primary }}>CallShield</div>
            <div style={{ fontSize: 12, color: BRAND.muted }}>Setup Wizard</div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30, padding: "0 4px" }}>
          {ONBOARDING_STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < ONBOARDING_STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={styles.stepIndicator(i === step, i < step)}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <div style={{
                  fontSize: 9,
                  color: i <= step ? BRAND.primary : BRAND.muted,
                  fontWeight: 600,
                  marginTop: 3,
                  whiteSpace: "nowrap",
                }}>{s.title}</div>
              </div>
              {i < ONBOARDING_STEPS.length - 1 && <div style={styles.stepLine(i < step)} />}
            </div>
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: BRAND.primary, marginBottom: 8 }}>Welcome to CallShield</h2>
            <p style={{ fontSize: 15, color: BRAND.dark, lineHeight: 1.7, marginBottom: 20 }}>
              We'll help you fight back against illegal telemarketing calls. This quick setup will walk you through registering on the <strong>National Do Not Call Registry</strong> — the most important first step in protecting yourself and building a legal case against violators.
            </p>
            <div style={{ background: BRAND.light, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <h4 style={{ fontWeight: 700, color: BRAND.primary, marginBottom: 10, fontSize: 14 }}>Here's what we'll cover:</h4>
              <div style={{ fontSize: 14, lineHeight: 2, color: BRAND.dark }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: BRAND.accent + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.accent }}>1</span>
                  </div>
                  Enter your phone number and email
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: BRAND.accent + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.accent }}>2</span>
                  </div>
                  Check if you're already on the Do Not Call list
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: BRAND.accent + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.accent }}>3</span>
                  </div>
                  Register your number (if not already registered)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: BRAND.accent + "20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.accent }}>4</span>
                  </div>
                  Start logging violations and filing claims
                </div>
              </div>
            </div>
            <div style={{
              padding: 16,
              background: BRAND.primary + "08",
              borderRadius: 10,
              border: `1px solid ${BRAND.primary}15`,
              fontSize: 13,
              lineHeight: 1.6,
              color: BRAND.dark,
            }}>
              <strong style={{ color: BRAND.primary }}>Why does this matter?</strong> Being on the DNC Registry is the legal foundation for any complaint or lawsuit. Once you're registered and 31 days have passed, telemarketers who call you are breaking the law — and you can collect $500–$1,500 per violation.
            </div>
          </div>
        )}

        {/* Step 1: Your Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: BRAND.primary, marginBottom: 6 }}>Your Information</h2>
            <p style={{ fontSize: 14, color: BRAND.muted, marginBottom: 24, lineHeight: 1.5 }}>
              Enter the phone number(s) you want to protect and your email address for registry confirmation.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={styles.label}>Phone Number to Protect *</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phoneNumber}
                onChange={(e) => upd("phoneNumber", e.target.value)}
              />
              <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
                This is the number you want registered on the Do Not Call list. You can add additional numbers later.
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={styles.label}>Email Address *</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => upd("email", e.target.value)}
              />
              <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
                The FTC will send a confirmation email to verify your DNC registration. Use a valid email you can access.
              </div>
            </div>

            <div style={{
              padding: 16,
              background: BRAND.accent + "10",
              borderRadius: 10,
              border: `1px solid ${BRAND.accent}25`,
              fontSize: 13,
              lineHeight: 1.6,
            }}>
              <AlertTriangle size={16} color={BRAND.accent} style={{ verticalAlign: "middle", marginRight: 6 }} />
              <strong style={{ color: BRAND.accent }}>Important:</strong> You can only register numbers you own or use. Landlines and mobile phones are both eligible. VoIP numbers may also qualify.
            </div>
          </div>
        )}

        {/* Step 2: Check DNC Status */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: BRAND.primary, marginBottom: 6 }}>Check Your DNC Status</h2>
            <p style={{ fontSize: 14, color: BRAND.muted, marginBottom: 24, lineHeight: 1.5 }}>
              Before registering, let's check if your number is already on the Do Not Call list.
            </p>

            <div style={{ background: BRAND.light, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <h4 style={{ fontWeight: 700, color: BRAND.primary, marginBottom: 12, fontSize: 15 }}>How to Check:</h4>
              <div style={{ fontSize: 14, lineHeight: 2, color: BRAND.dark }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent, flexShrink: 0 }}>1.</span>
                  <span>Visit <strong style={{ color: BRAND.primary }}>www.donotcall.gov/confirm</strong></span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent, flexShrink: 0 }}>2.</span>
                  <span>Enter your phone number: <strong>{form.phoneNumber || "(enter on previous step)"}</strong></span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent, flexShrink: 0 }}>3.</span>
                  <span>Enter your email: <strong>{form.email || "(enter on previous step)"}</strong></span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 700, color: BRAND.accent, flexShrink: 0 }}>4.</span>
                  <span>Check your email for results from the FTC</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={styles.label}>Is your number already on the DNC Registry?</label>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {[
                  { val: "yes", label: "Yes, it's registered", color: BRAND.success },
                  { val: "no", label: "No, not registered", color: BRAND.accent },
                  { val: "unsure", label: "I'm not sure yet", color: BRAND.muted },
                ].map((opt) => (
                  <div
                    key={opt.val}
                    onClick={() => upd("dncStatus", opt.val)}
                    style={{
                      flex: 1,
                      padding: "14px 12px",
                      borderRadius: 10,
                      border: `2px solid ${form.dncStatus === opt.val ? opt.color : "#e2e8f0"}`,
                      background: form.dncStatus === opt.val ? opt.color + "10" : BRAND.white,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: form.dncStatus === opt.val ? opt.color : BRAND.dark,
                    }}>
                      {opt.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {form.dncStatus === "yes" && (
              <div style={{ padding: 16, background: BRAND.success + "10", borderRadius: 10, border: `1px solid ${BRAND.success}30` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <CheckCircle size={18} color={BRAND.success} />
                  <strong style={{ color: BRAND.success, fontSize: 14 }}>Great, you're already protected!</strong>
                </div>
                <p style={{ fontSize: 13, color: BRAND.dark, lineHeight: 1.6, margin: 0 }}>
                  Your number is on the registry. Any telemarketing calls you receive (without your consent) may be TCPA violations. You can skip the registration step.
                </p>
                <div style={{ marginTop: 12 }}>
                  <label style={{ ...styles.label, fontSize: 12 }}>Do you know when you registered? (optional)</label>
                  <input
                    style={{ ...styles.input, maxWidth: 220 }}
                    type="date"
                    value={form.registrationDate}
                    onChange={(e) => upd("registrationDate", e.target.value)}
                  />
                </div>
              </div>
            )}

            {form.dncStatus === "no" && (
              <div style={{ padding: 16, background: BRAND.accent + "10", borderRadius: 10, border: `1px solid ${BRAND.accent}30` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <ArrowRight size={18} color={BRAND.accent} />
                  <strong style={{ color: BRAND.accent, fontSize: 14 }}>No problem — we'll register you next!</strong>
                </div>
                <p style={{ fontSize: 13, color: BRAND.dark, lineHeight: 1.6, margin: 0 }}>
                  The next step will walk you through the free registration process. It takes about 2 minutes. Your number becomes active on the list after 31 days.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Register on DNC */}
        {step === 3 && (
          <div>
            <h2 style={{
              fontSize: 22,
              fontWeight: 800,
              color: BRAND.primary,
              marginBottom: 6,
            }}>
              {form.dncStatus === "yes" ? "Confirm Your Registration" : "Register on the Do Not Call List"}
            </h2>
            <p style={{ fontSize: 14, color: BRAND.muted, marginBottom: 24, lineHeight: 1.5 }}>
              {form.dncStatus === "yes"
                ? "Your number is already registered. Review the details below and continue."
                : "Follow these steps to add your number to the National Do Not Call Registry. It's free and only takes a couple of minutes."}
            </p>

            {form.dncStatus !== "yes" && (
              <>
                <div style={{ background: BRAND.light, borderRadius: 12, padding: 24, marginBottom: 20 }}>
                  <h4 style={{
                    fontWeight: 700,
                    color: BRAND.primary,
                    marginBottom: 14,
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <ClipboardList size={18} /> Registration Steps
                  </h4>
                  <div style={{ fontSize: 14, color: BRAND.dark }}>
                    <div style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: BRAND.accent,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>1</div>
                      <div>
                        <strong>Visit the Registry Website</strong>
                        <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 2 }}>
                          Go to <strong style={{ color: BRAND.primary }}>www.donotcall.gov</strong> and click "Register Your Phone"
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: BRAND.accent,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>2</div>
                      <div>
                        <strong>Enter Your Phone Number</strong>
                        <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 2 }}>
                          Type in: <strong style={{ color: BRAND.primary }}>{form.phoneNumber || "your phone number"}</strong>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: BRAND.accent,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>3</div>
                      <div>
                        <strong>Enter Your Email Address</strong>
                        <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 2 }}>
                          Use: <strong style={{ color: BRAND.primary }}>{form.email || "your email"}</strong>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: BRAND.accent,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>4</div>
                      <div>
                        <strong>Check Your Email</strong>
                        <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 2 }}>
                          You'll receive a confirmation email from the FTC. Click the link to verify your registration.
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 0", display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: BRAND.accent,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>5</div>
                      <div>
                        <strong>Wait 31 Days</strong>
                        <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 2 }}>
                          Your number becomes active on the registry after 31 days. Telemarketers who call after that are violating the law.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: 16,
                  background: BRAND.primary + "08",
                  borderRadius: 10,
                  border: `1px solid ${BRAND.primary}15`,
                  marginBottom: 20,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: BRAND.dark,
                }}>
                  <strong style={{ color: BRAND.primary }}>Alternative: Register by Phone</strong><br />
                  You can also call <strong>1-888-382-1222</strong> from the phone number you want to register. The call is free and registration is immediate.
                </div>
              </>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Add any notes about your registration (optional)</label>
              <textarea
                style={styles.textarea}
                placeholder="e.g., Confirmation number, date registered, additional numbers to add later..."
                value={form.confirmationNote}
                onChange={(e) => upd("confirmationNote", e.target.value)}
              />
            </div>

            <div style={{
              padding: 16,
              background: BRAND.success + "08",
              borderRadius: 10,
              border: `1px solid ${BRAND.success}25`,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}>
              <AlertTriangle size={18} color={BRAND.success} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 13, color: BRAND.dark, lineHeight: 1.6 }}>
                <strong style={{ color: BRAND.success }}>Good to know:</strong> Once registered, your number stays on the list permanently (it no longer expires). You can register up to 3 numbers online per email address. Political calls, charities, surveys, and companies you have an existing relationship with can still call you.
              </div>
            </div>
          </div>
        )}

        {/* Step 4: All Set */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: BRAND.success + "15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <CheckCircle size={42} color={BRAND.success} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: BRAND.primary, marginBottom: 8 }}>You're All Set!</h2>
            <p style={{
              fontSize: 15,
              color: BRAND.muted,
              lineHeight: 1.7,
              maxWidth: 440,
              margin: "0 auto 28px",
            }}>
              {form.dncStatus === "yes"
                ? "Your number is registered and you're ready to start tracking violations. Any unwanted telemarketing calls you receive may be worth $500–$1,500 each."
                : "Once you've completed registration at donotcall.gov, your number will be active after 31 days. In the meantime, you can start logging any unwanted calls you receive."}
            </p>

            <div style={{ background: BRAND.light, borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 28 }}>
              <h4 style={{ fontWeight: 700, color: BRAND.primary, marginBottom: 12, fontSize: 14 }}>What to do next:</h4>
              <div style={{ fontSize: 14, lineHeight: 2, color: BRAND.dark }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Phone size={16} color={BRAND.accent} /> <span><strong>Log every unwanted call</strong> — documentation is your strongest weapon</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <FileText size={16} color={BRAND.accent} /> <span><strong>File FTC/FCC complaints</strong> — free and takes 5 minutes</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Scale size={16} color={BRAND.accent} /> <span><strong>Pursue small claims</strong> — collect $500–$1,500 per violation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          {step > 0 && (
            <button
              onClick={prev}
              disabled={isLoading}
              style={{
                ...styles.btnSecondary,
                flex: 1,
                justifyContent: "center",
              }}
            >
              Back
            </button>
          )}
          {step < ONBOARDING_STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={isLoading || (step === 1 && (!form.phoneNumber || !form.email)) || (step === 2 && !form.dncStatus)}
              style={{
                ...styles.btnPrimary,
                flex: 1,
                justifyContent: "center",
                opacity: (step === 1 && (!form.phoneNumber || !form.email)) || (step === 2 && !form.dncStatus) ? 0.5 : 1,
                cursor: (step === 1 && (!form.phoneNumber || !form.email)) || (step === 2 && !form.dncStatus) ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              style={{
                ...styles.btnPrimary,
                flex: 1,
                justifyContent: "center",
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Setting up...' : 'Start Using CallShield'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
