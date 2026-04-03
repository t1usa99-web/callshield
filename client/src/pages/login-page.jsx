import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/use-auth.js';
import { styles } from '../utils/styles.js';
import { BRAND } from '../utils/constants.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: BRAND.gradient,
      }}>
        <div style={{
          background: BRAND.white,
          borderRadius: 16,
          padding: 40,
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            justifyContent: 'center',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: BRAND.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={28} color="#fff" />
            </div>
            <h1 style={{
              fontSize: 26,
              fontWeight: 800,
              color: BRAND.primary,
              margin: 0,
            }}>CallShield</h1>
          </div>

          <h2 style={{
            fontSize: 20,
            fontWeight: 800,
            color: BRAND.primary,
            marginBottom: 8,
            textAlign: 'center',
          }}>Welcome Back</h2>

          <p style={{
            fontSize: 14,
            color: BRAND.muted,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>Sign in to continue protecting yourself from unwanted calls</p>

          {(error || localError) && (
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
              <AlertCircle size={18} color={BRAND.danger} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: BRAND.dark }}>
                {error || localError}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.btnPrimary,
                width: '100%',
                justifyContent: 'center',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 14,
            color: BRAND.muted,
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: BRAND.accent,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
