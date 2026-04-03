import { Shield, Home, Phone, FileText, Scale, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styles } from '../utils/styles.js';
import { useAuth } from '../hooks/use-auth.js';

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
    }
    return location.pathname === paths || location.pathname.startsWith(paths + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.logo}>
            <Shield size={26} />
            CallShield
          </div>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={styles.navBtn(isActive('/'))}>
              <Home size={16} />
              Home
            </button>
          </Link>

          <Link to="/log" style={{ textDecoration: 'none' }}>
            <button style={styles.navBtn(isActive('/log'))}>
              <Phone size={16} />
              Log Call
            </button>
          </Link>

          <Link to="/calls" style={{ textDecoration: 'none' }}>
            <button style={styles.navBtn(isActive(['/calls']))}>
              <FileText size={16} />
              My Calls
            </button>
          </Link>

          <Link to="/file" style={{ textDecoration: 'none' }}>
            <button style={styles.navBtn(isActive('/file'))}>
              <FileText size={16} />
              Complain
            </button>
          </Link>

          <Link to="/claims" style={{ textDecoration: 'none' }}>
            <button style={styles.navBtn(isActive('/claims'))}>
              <Scale size={16} />
              Claims
            </button>
          </Link>

          <button
            style={{
              ...styles.navBtn(false),
              color: '#fff',
              marginLeft: 12,
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              paddingLeft: 16,
            }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
