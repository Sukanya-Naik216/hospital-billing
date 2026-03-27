import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { value: '10,000+', label: 'Patients Served' },
  { value: '500+', label: 'Doctors' },
  { value: '50+', label: 'Specialities' },
  { value: '24/7', label: 'Emergency Care' },
];

const services = [
  { icon: '🫀', title: 'Cardiology', desc: 'Advanced heart care and treatment' },
  { icon: '🧠', title: 'Neurology', desc: 'Expert brain and nerve specialists' },
  { icon: '🦴', title: 'Orthopedics', desc: 'Bone and joint treatments' },
  { icon: '👁️', title: 'Ophthalmology', desc: 'Complete eye care services' },
  { icon: '🦷', title: 'Dentistry', desc: 'Full dental care and surgery' },
  { icon: '🧬', title: 'Pathology', desc: 'Advanced lab diagnostics' },
];

const features = [
  { icon: '🧾', title: 'Digital Billing', desc: 'Paperless billing with instant invoices and payment tracking' },
  { icon: '👥', title: 'Patient Management', desc: 'Complete patient records with insurance and history' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time revenue and billing analytics' },
  { icon: '🔐', title: 'Secure Access', desc: 'JWT authentication with role-based access control' },
  { icon: '💳', title: 'Payment Tracking', desc: 'Track payments via Cash, UPI, Card, Insurance' },
  { icon: '🖨️', title: 'PDF Invoices', desc: 'Print and download professional invoices' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', color: 'var(--text-primary)' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,22,40,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, var(--teal), var(--mint))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
          }}>🏥</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--white-pure)', fontFamily: 'var(--font-display)' }}>MediCare</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Services', 'About', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
              onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
            >{item}</a>
          ))}
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            🔐 Staff Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 48px 80px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,180,216,0.1) 0%, transparent 70%)'
      }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 20,
            background: 'var(--teal-dim)', border: '1px solid rgba(0,180,216,0.3)',
            color: 'var(--teal)', fontSize: 13, fontWeight: 500, marginBottom: 24
          }}>
            🏥 Trusted Healthcare Since 2010
          </div>
          <h1 style={{
            fontSize: 64, fontWeight: 700, lineHeight: 1.1, marginBottom: 24,
            fontFamily: 'var(--font-display)', color: 'var(--white-pure)'
          }}>
            Your Health is Our <span style={{ color: 'var(--teal)' }}>Priority</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            MediCare Hospital provides world-class healthcare with advanced technology and compassionate care. Our digital billing system ensures transparent, hassle-free billing.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}
              onClick={() => navigate('/login')}>
              🏥 Access Billing System
            </button>
            <a href="#services" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }}>
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--white-pure)', fontFamily: 'var(--font-display)' }}>Our Medical Services</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Comprehensive healthcare across all specialities</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {services.map(s => (
              <div key={s.title} className="card" style={{ padding: 28, transition: 'transform 0.2s, border-color 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,180,216,0.3)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--white-pure)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', background: 'rgba(17,34,64,0.5)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--white-pure)', fontFamily: 'var(--font-display)' }}>Billing System Features</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Everything you need to manage hospital billing</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 16, padding: 24, borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--white-pure)', marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--white-pure)', fontFamily: 'var(--font-display)', marginBottom: 20 }}>
              About MediCare Hospital
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              Founded in 2010, MediCare Hospital has been providing exceptional healthcare services to thousands of patients. Our state-of-the-art facilities and experienced medical professionals ensure the best possible care.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              Our digital billing system streamlines the entire billing process, making it transparent and efficient for both staff and patients.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Access Billing Portal →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🏆', title: 'Award Winning', desc: 'Best Hospital 2023' },
              { icon: '👨‍⚕️', title: 'Expert Doctors', desc: '500+ specialists' },
              { icon: '🔬', title: 'Modern Labs', desc: 'Latest equipment' },
              { icon: '❤️', title: 'Patient First', desc: 'Compassionate care' },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white-pure)' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '80px 48px', background: 'rgba(17,34,64,0.5)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--white-pure)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            Contact Us
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: 15 }}>
            Get in touch with us for appointments, billing queries or general information
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 40 }}>
            {[
              { icon: '📍', title: 'Address', value: '123 Health Avenue, Medical District' },
              { icon: '📞', title: 'Phone', value: '+91 1234567890' },
              { icon: '📧', title: 'Email', value: 'info@medicare.hospital' },
            ].map(c => (
              <div key={c.title} className="card" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white-pure)', marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.value}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 40px' }} onClick={() => navigate('/login')}>
            🏥 Staff Login Portal
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 48px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          © 2024 MediCare Hospital. All rights reserved. | Built with React, Node.js & MySQL
        </div>
      </footer>
    </div>
  );
}