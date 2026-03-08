import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/projects', label: 'Projects', icon: '◈' },
  { to: '/admin/skills', label: 'Skills', icon: '◉' },
  { to: '/admin/about', label: 'About', icon: '◎' },
  { to: '/admin/contact', label: 'Messages', icon: '✉' },
  { to: '/admin/resume', label: 'Resume', icon: '◱' },
  { to: '/admin/analytics', label: 'Analytics', icon: '◈' },
];

const S = {
  sidebar: {
    width: '220px',
    background: '#12141c',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    fontFamily: 'Inter, sans-serif',
    zIndex: 40,
  },
  brandArea: {
    padding: '20px 16px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  logoBox: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    flexShrink: 0,
  },
  userCard: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 700,
    flexShrink: 0,
  },
  navArea: {
    flex: 1,
    padding: '12px',
    overflowY: 'auto',
  },
  navLabel: {
    color: '#334155',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '0 10px',
    marginBottom: '6px',
    display: 'block',
  },
  bottomArea: {
    padding: '12px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
};

function NavLink({ to, label, icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 10px',
        borderRadius: '10px',
        marginBottom: '2px',
        fontSize: '13px',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.15s',
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        color: active ? '#818cf8' : '#64748b',
        border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
      }}
    >
      <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{icon}</span>
      {label}
    </Link>
  );
}

function BottomLink({ onClick, children, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 10px',
        borderRadius: '10px',
        marginBottom: '2px',
        fontSize: '13px',
        fontWeight: 500,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: danger ? '#f87171' : '#64748b',
        textAlign: 'left',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  const initials = user?.email?.[0]?.toUpperCase() || 'A';

  const sidebarStyle = {
    ...S.sidebar,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
  };

  const desktopSidebarStyle = {
    ...S.sidebar,
    transform: 'translateX(0)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f1117',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
      }}
    >
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 30 }}
        />
      )}

      {/* Sidebar — desktop always visible */}
      <aside
        style={{ width: '220px', flexShrink: 0, position: 'relative' }}
        className="hidden lg:block"
      >
        <div style={desktopSidebarStyle}>
          {/* Brand */}
          <div style={S.brandArea}>
            <div style={S.brandRow}>
              <div style={S.logoBox}>P</div>
              <div>
                <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>Portfolio</div>
                <div style={{ color: '#475569', fontSize: '11px' }}>Pro Workspace</div>
              </div>
            </div>
            {/* User card */}
            <div style={S.userCard}>
              <div style={S.avatar}>{initials}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    color: '#f1f5f9',
                    fontSize: '12px',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.email}
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#4ade80',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ color: '#64748b', fontSize: '11px' }}>Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={S.navArea}>
            <span style={S.navLabel}>Menu</span>
            {navItems.map(({ to, label, icon }) => (
              <NavLink key={to} to={to} label={label} icon={icon} active={pathname === to} />
            ))}
          </div>

          {/* Bottom */}
          <div style={S.bottomArea}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 10px',
                borderRadius: '10px',
                marginBottom: '2px',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                color: '#64748b',
              }}
            >
              <span>↗</span> View Site
            </Link>
            <BottomLink onClick={handleLogout} danger>
              <span>→</span> Sign out
            </BottomLink>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className="lg:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 40,
          height: '100vh',
          width: '220px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
          background: '#12141c',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={S.brandArea}>
          <div style={{ ...S.brandRow, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={S.logoBox}>P</div>
              <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>Portfolio</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>
          <div style={S.userCard}>
            <div style={S.avatar}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: '#f1f5f9',
                  fontSize: '12px',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </div>
              <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Admin</div>
            </div>
          </div>
        </div>
        <div style={S.navArea}>
          <span style={S.navLabel}>Menu</span>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              icon={icon}
              active={pathname === to}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
        <div style={S.bottomArea}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 10px',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            ↗ View Site
          </Link>
          <BottomLink onClick={handleLogout} danger>
            → Sign out
          </BottomLink>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: 'rgba(15,17,23,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '20px',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ☰
          </button>

          {/* Page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                color: '#f1f5f9',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {pathname.split('/').pop()}
            </span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '20px',
                background: 'rgba(34,197,94,0.1)',
                color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              ● Live
            </span>
          </div>

          {/* Avatar */}
          <div style={{ ...S.avatar, width: '32px', height: '32px', fontSize: '12px' }}>
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px' }}>{children}</main>
      </div>
    </div>
  );
}
