import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout({ children }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f1117',
        color: '#f1f5f9',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          background: scrolled ? 'rgba(15,17,23,0.96)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            P
          </div>
          <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '15px' }}>Portfolio</span>
        </Link>

        {/* Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} id="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '7px 15px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
                background: pathname === to ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: pathname === to ? '#818cf8' : '#94a3b8',
                border:
                  pathname === to ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            style={{
              marginLeft: '10px',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
            }}
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          id="burger-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '22px',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 49,
            background: 'rgba(15,17,23,0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 20px 16px',
          }}
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'block',
                padding: '11px 14px',
                borderRadius: '10px',
                marginBottom: '3px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                color: pathname === to ? '#818cf8' : '#94a3b8',
                background: pathname === to ? 'rgba(99,102,241,0.1)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            style={{
              display: 'block',
              marginTop: '8px',
              padding: '11px 14px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            Hire Me
          </Link>
        </div>
      )}

      <main style={{ paddingTop: '64px' }}>{children}</main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '96px' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '32px 40px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '7px',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              P
            </div>
            <span style={{ color: '#475569', fontSize: '13px' }}>Portfolio</span>
          </div>
          <p style={{ color: '#2d3748', fontSize: '12px', margin: 0 }}>
            Built with React · Node.js · Supabase
          </p>
          {/* <div style={{ display: 'flex', gap: '20px' }}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{ color: '#475569', fontSize: '12px', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
          </div> */}
        </div>
      </footer>

      {/* Responsive helpers */}
      <style>{`
        #burger-btn { display: none; }
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #burger-btn  { display: block !important; }
        }
      `}</style>
    </div>
  );
}
