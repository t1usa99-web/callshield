import { Routes, Route, Navigate } from 'react-router-dom';
import { styles } from './utils/styles.js';
import { BRAND } from './utils/constants.js';
import { ProtectedRoute } from './components/protected-route.jsx';
import { NavBar } from './components/nav-bar.jsx';
import { LoginPage } from './pages/login-page.jsx';
import { RegisterPage } from './pages/register-page.jsx';
import { OnboardingPage } from './pages/onboarding-page.jsx';
import { DashboardPage } from './pages/dashboard-page.jsx';
import { LogCallPage } from './pages/log-call-page.jsx';
import { MyCallsPage } from './pages/my-calls-page.jsx';
import { FileComplaintPage } from './pages/file-complaint-page.jsx';
import { SmallClaimsPage } from './pages/small-claims-page.jsx';

const Footer = () => (
  <footer style={{
    background: BRAND.dark,
    color: '#fff',
    padding: '40px 24px',
    marginTop: '60px',
    borderTop: `1px solid ${BRAND.primary}`,
  }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, marginBottom: 40 }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: BRAND.accent }}>
            CallShield
          </h4>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
            Fight back against illegal telemarketing calls. Document violations and pursue legal compensation.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: BRAND.accent }}>
            Quick Links
          </h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, opacity: 0.8 }}>
                About Do Not Call
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, opacity: 0.8 }}>
                TCPA Overview
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, opacity: 0.8 }}>
                Filing Resources
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: BRAND.accent }}>
            Legal
          </h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, opacity: 0.8 }}>
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, opacity: 0.8 }}>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{
        borderTop: `1px solid ${BRAND.primary}30`,
        paddingTop: 20,
        fontSize: 13,
        opacity: 0.6,
        textAlign: 'center',
      }}>
        <p style={{ margin: 0 }}>
          CallShield is an informational tool. This is not legal advice. Always consult with an attorney for legal matters.
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div style={styles.page}>
      <Routes>
        {/* Auth Pages (no nav) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Onboarding (protected, no nav) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Pages (with nav) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NavBar />
              <DashboardPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <NavBar />
              <LogCallPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <NavBar />
              <MyCallsPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calls/:id"
          element={
            <ProtectedRoute>
              <NavBar />
              <MyCallsPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calls/:id/edit"
          element={
            <ProtectedRoute>
              <NavBar />
              <LogCallPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/file"
          element={
            <ProtectedRoute>
              <NavBar />
              <FileComplaintPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <ProtectedRoute>
              <NavBar />
              <SmallClaimsPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
