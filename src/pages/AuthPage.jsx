import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { sanitizeInput, isValidEmail, checkLockout, getProgressiveDelay, recordFailedAttempt, clearLoginAttempts, getGenericAuthError } from '../lib/security';

const SDG_COLORS = ['#E5243B','#DDA63A','#4C9F38','#C5192D','#FF3A21','#26BDE2','#FCC30B','#A21942','#FD6925','#DD1367','#FD9D24','#BF8B2E','#3F7E44','#0A97D9','#56C02B','#00689D','#19486A'];

// Proper SDG wheel SVG using donut arc segments
function SDGWheel({ size = 120, innerRatio = 0.4 }) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 2;
  const ri = r * innerRatio;
  const n = 17;
  const gap = 0.03; // gap in radians between segments

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {SDG_COLORS.map((color, i) => {
        const startAngle = (2 * Math.PI / n) * i - Math.PI / 2 + gap / 2;
        const endAngle   = (2 * Math.PI / n) * (i + 1) - Math.PI / 2 - gap / 2;
        const x1 = cx + r  * Math.cos(startAngle), y1 = cy + r  * Math.sin(startAngle);
        const x2 = cx + r  * Math.cos(endAngle),   y2 = cy + r  * Math.sin(endAngle);
        const x3 = cx + ri * Math.cos(endAngle),   y3 = cy + ri * Math.sin(endAngle);
        const x4 = cx + ri * Math.cos(startAngle), y4 = cy + ri * Math.sin(startAngle);
        return (
          <path key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 0 0 ${x4} ${y4} Z`}
            fill={color} />
        );
      })}
      <circle cx={cx} cy={cy} r={ri * 0.85} fill="white" />
    </svg>
  );
}

function SDGCard({ mode }) {
  const sdgs = [
    { num: 4,  label: 'Quality\nEducation',        color: '#C5192D' },
    { num: 5,  label: 'Gender\nEquality',           color: '#FF3A21' },
    { num: 7,  label: 'Affordable\nClean Energy',   color: '#FCC30B' },
    { num: 8,  label: 'Decent Work\n& Growth',      color: '#A21942' },
    { num: 9,  label: 'Industry &\nInfrastructure', color: '#FD6925' },
    { num: 10, label: 'Reduced\nInequalities',      color: '#DD1367' },
    { num: 13, label: 'Climate\nAction',            color: '#3F7E44' },
    { num: 17, label: 'Partnerships\nfor Goals',    color: '#19486A' },
  ];
  return (
    <div style={{ width:'100%', height:'100%', minHeight:'520px', background:'linear-gradient(135deg,#f0fdf4,#e8f5e9,#f0f9ff)', borderRadius:'24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', position:'relative', overflow:'hidden' }}>
      {/* Concentric rings */}
      {[100,160,220,280].map((s,i) => (
        <div key={i} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', border:'1px solid rgba(76,159,56,0.12)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      ))}

      {/* SDG GOALS badge */}
      <div style={{ position:'absolute', top:20, right:20, textAlign:'right', lineHeight:1.2 }}>
        <div style={{ fontSize:'8px', fontWeight:800, color:'#19486A', letterSpacing:'0.14em' }}>SUSTAINABLE</div>
        <div style={{ fontSize:'8px', fontWeight:800, color:'#19486A', letterSpacing:'0.14em' }}>DEVELOPMENT</div>
        <div style={{ fontSize:'20px', fontWeight:900, letterSpacing:'-0.01em' }}>
          {'GOALS'.split('').map((c,i) => <span key={i} style={{ color:['#E5243B','#DDA63A','#4C9F38','#C5192D','#26BDE2'][i] }}>{c}</span>)}
        </div>
      </div>

      <SDGWheel size={130} innerRatio={0.38} />

      {/* SDG tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'5px', width:'100%', maxWidth:'300px', marginTop:'14px' }}>
        {sdgs.map(({ num, label, color }) => (
          <div key={num} style={{ background:color, borderRadius:'7px', padding:'5px 3px', textAlign:'center', color:'#fff', fontSize:'8px', fontWeight:700, lineHeight:1.3 }}>
            <div style={{ fontSize:'15px', fontWeight:900, lineHeight:1 }}>{num}</div>
            <div style={{ whiteSpace:'pre-line', marginTop:'2px', opacity:0.9 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ marginTop:'18px', background:'#fff', borderRadius:'12px', padding:'14px 18px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', width:'100%', maxWidth:'300px' }}>
        <div style={{ fontSize:'24px', color:'#4C9F38', lineHeight:0.8, fontFamily:'Georgia,serif' }}>"</div>
        <p style={{ fontSize:'12px', color:'#333', margin:'4px 0 10px', lineHeight:1.5 }}>
          {mode === 'login' ? 'Join the movement of student innovators solving the world\'s biggest challenges.' : 'Build something that matters. Register your team and compete for a chance to present on the world stage.'}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#4C9F38,#26BDE2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'11px', flexShrink:0 }}>M</div>
          <div>
            <div style={{ fontSize:'11px', fontWeight:700, color:'#111' }}>SRCAS Hackathon 3.0</div>
            <div style={{ fontSize:'10px', color:'#4C9F38', fontWeight:600 }}>in Association with iGenius - Authorized Microsoft Partner</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'10px 6px', borderRadius:'10px', border:'1.5px solid #e5e7eb', background: hov ? '#f9fafb' : '#fff', cursor:'pointer', fontSize:'13px', fontWeight:600, color:'#374151', transition:'all 0.2s', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.08)' : 'none' }}>
      {icon}<span style={{ whiteSpace:'nowrap' }}>{label}</span>
    </button>
  );
}

function InputField({ label, type='text', placeholder, icon, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
      <label style={{ fontSize:'13px', fontWeight:600, color:'#374151' }}>{label}</label>
      <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${focused ? '#4C9F38' : '#e5e7eb'}`, borderRadius:'10px', padding:'0 12px', gap:'9px', background:'#fff', transition:'border-color 0.2s, box-shadow 0.2s', boxShadow: focused ? '0 0 0 3px rgba(76,159,56,0.12)' : 'none' }}>
        <span style={{ color: focused ? '#4C9F38' : '#9ca3af', flexShrink:0 }}>{icon}</span>
        <input type={show && type==='password' ? 'text' : type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex:1, border:'none', outline:'none', padding:'11px 0', fontSize:'14px', color:'#111', background:'transparent' }} />
        {type === 'password' && (
          <button type="button" onClick={() => setShow(!show)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:0, flexShrink:0 }}>
            {show
              ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        )}
      </div>
    </div>
  );
}

const GoogleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
const GithubIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>;
const MicrosoftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>;

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [agreedToLead, setAgreedToLead] = useState(false);
  const [leadCheckbox, setLeadCheckbox] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState('');
  const lockoutTimerRef = useRef(null);

  // Check lockout status on mount and show countdown
  useEffect(() => {
    const updateLockout = () => {
      const status = checkLockout();
      if (status.locked) {
        const mins = Math.floor(status.remainingSeconds / 60);
        const secs = status.remainingSeconds % 60;
        setLockoutMsg(`Account temporarily locked. Try again in ${mins}:${secs.toString().padStart(2, '0')}`);
      } else {
        setLockoutMsg('');
        if (lockoutTimerRef.current) {
          clearInterval(lockoutTimerRef.current);
          lockoutTimerRef.current = null;
        }
      }
    };
    updateLockout();
    return () => { if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current); };
  }, []);

  useEffect(() => {
    // Check if there is an OAuth error in the URL hash (from redirect)
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('error')) {
        const desc = hashParams.get('error_description');
        setErrorMsg(desc ? decodeURIComponent(desc).replace(/\+/g, ' ') : 'Authentication was canceled or failed.');
        // Clean up the URL so the error doesn't persist on reload
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const switchMode = (next) => {
    if (next === mode || animating) return;
    setErrorMsg('');
    setSuccessMsg('');
    setAgreedToLead(false);
    setLeadCheckbox(false);
    setAnimating(true);
    setTimeout(() => { setMode(next); setAnimating(false); }, 380);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // ── Security: Check lockout ──
    const lockStatus = checkLockout();
    if (lockStatus.locked) {
      setErrorMsg(`Too many failed attempts. Please try again in ${lockStatus.remainingMinutes} minute(s).`);
      setLoading(false);
      return;
    }

    // ── Security: Sanitize inputs ──
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanName = sanitizeInput(name);

    // ── Security: Validate email format ──
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Client side validation for sign up
    if (!isLogin) {
      if (!cleanName || cleanName.length < 2) {
        setErrorMsg('Please enter a valid name (at least 2 characters).');
        setLoading(false);
        return;
      }

      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      const hasLength = password.length >= 8;

      if (!hasUpper || !hasLower || !hasNumber || !hasSpecial || !hasLength) {
        setErrorMsg('Please meet all password requirements.');
        setLoading(false);
        return;
      }
    }

    // ── Security: Progressive delay ──
    const delay = getProgressiveDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        // ── Security: Clear attempts on success ──
        clearLoginAttempts();
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: cleanName } }
        });
        if (error) throw error;
        
        if (data?.session === null) {
          setSuccessMsg('Registration successful! Please check your email inbox to confirm your account.');
          setName('');
          setEmail('');
          setPassword('');
          setMode('login');
        } else {
          clearLoginAttempts();
          navigate('/dashboard');
        }
      }
    } catch (error) {
      // ── Security: Record failed attempt + generic error ──
      if (isLogin) {
        const result = recordFailedAttempt();
        const genericMsg = getGenericAuthError(error);
        
        if (result.locked) {
          setErrorMsg(`Account temporarily locked for ${result.lockoutMinutes} minutes due to too many failed attempts.`);
          // Start countdown timer
          if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
          lockoutTimerRef.current = setInterval(() => {
            const s = checkLockout();
            if (s.locked) {
              const mins = Math.floor(s.remainingSeconds / 60);
              const secs = s.remainingSeconds % 60;
              setLockoutMsg(`Account temporarily locked. Try again in ${mins}:${secs.toString().padStart(2, '0')}`);
            } else {
              setLockoutMsg('');
              clearInterval(lockoutTimerRef.current);
              lockoutTimerRef.current = null;
            }
          }, 1000);
        } else if (result.attemptsLeft <= 2) {
          setErrorMsg(`${genericMsg} ${result.attemptsLeft} attempt(s) remaining before lockout.`);
        } else {
          setErrorMsg(genericMsg);
        }
      } else {
        setErrorMsg(getGenericAuthError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const isLogin = mode === 'login';

  const formPanel = (
    <form className="auth-form" onSubmit={handleAuth} style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'40px 44px', height:'100%', opacity: animating ? 0 : 1, transform: animating ? `translateX(${isLogin ? '-28px' : '28px'})` : 'translateX(0)', transition:'opacity 0.38s ease, transform 0.38s ease' }}>

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
        <SDGWheel size={38} innerRatio={0.36} />
        <div>
          <div style={{ fontWeight:800, fontSize:'14px', color:'#111', letterSpacing:'0.04em' }}>SDG FOCUSED</div>
          <div style={{ fontSize:'11px', color:'#6b7280' }}>Building a sustainable future</div>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{ fontSize:'26px', fontWeight:900, color:'#111', margin:'0 0 6px', lineHeight:1.2 }}>
        {isLogin ? 'Welcome back!' : 'Create an account'}
      </h1>
      <p style={{ fontSize:'13px', color:'#6b7280', margin:'0 0 24px', lineHeight:1.6 }}>
        {isLogin ? 'Sign in to access your dashboard.' : 'Register to join SRCAS Hackathon 3.0.'}
      </p>

      {/* ── Social buttons FIRST ── */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'16px' }}>
        <SocialBtn label="Google" icon={<GoogleIcon />} onClick={() => handleSocialLogin('google')} />
        <SocialBtn label="GitHub" icon={<GithubIcon />} onClick={() => handleSocialLogin('github')} />
      </div>

      {/* Divider */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
        <div style={{ flex:1, height:'1px', background:'#e5e7eb' }} />
        <span style={{ fontSize:'12px', color:'#9ca3af', fontWeight:500 }}>or continue with email</span>
        <div style={{ flex:1, height:'1px', background:'#e5e7eb' }} />
      </div>

      {/* ── Fields AFTER social ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'20px' }}>
        {!isLogin && (
          <InputField label="Full Name" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        )}
        <InputField label="Email" type="email" placeholder="youremail@domain.com" value={email} onChange={e => setEmail(e.target.value)}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
        <div>
          <InputField label="Password" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>} />
          {!isLogin && (
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:12, marginLeft:4 }}>
              {[
                { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
                { label: 'Lowercase letter', met: /[a-z]/.test(password) },
                { label: 'Number', met: /[0-9]/.test(password) },
                { label: 'Special character (e.g. !?<>@#$%)', met: /[^A-Za-z0-9]/.test(password) },
                { label: '8 characters or more', met: password.length >= 8 },
              ].map((req, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, color: req.met ? '#4C9F38' : '#9ca3af', fontSize:12, fontWeight:500, transition:'color 0.2s' }}>
                  <div style={{ width:14, height:14, borderRadius:'50%', border: req.met ? 'none' : '1.5px solid #9ca3af', background: req.met ? '#4C9F38' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', flexShrink:0 }}>
                    {req.met && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  {req.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      {lockoutMsg && <div style={{ color: '#9a3412', background: '#ffedd5', padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa', fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>⏳ {lockoutMsg}</div>}
      {errorMsg && <div style={{ color: '#E5243B', fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>{errorMsg}</div>}
      {successMsg && <div style={{ color: '#166534', background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>✉️ {successMsg}</div>}
      
      {!isLogin && (
        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '16px', lineHeight: 1.5 }}>
          By registering, you agree to our <Link to="/terms" style={{ color: '#4C9F38', fontWeight: 600, textDecoration: 'none' }}>Terms & Conditions</Link> and <Link to="/privacy" style={{ color: '#4C9F38', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
      )}
      
      <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:'11px', background:'linear-gradient(135deg,#4C9F38,#3d8a2e)', color:'#fff', fontWeight:800, fontSize:'15px', border:'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, letterSpacing:'0.04em', boxShadow:'0 4px 16px rgba(76,159,56,0.35)', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'20px' }}
        onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(76,159,56,0.45)'; } }}
        onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 4px 16px rgba(76,159,56,0.35)'; } }}>
        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
        {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
      </button>

      {/* Toggle */}
      <p style={{ textAlign:'center', fontSize:'13px', color:'#6b7280', margin:0 }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={() => switchMode(isLogin ? 'signup' : 'login')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#4C9F38', fontWeight:700, fontSize:'13px', padding:0 }}>
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </form>
  );

  const gatePanel = (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'40px 44px', height:'100%', opacity: animating ? 0 : 1, transform: animating ? `translateX(${isLogin ? '-28px' : '28px'})` : 'translateX(0)', transition:'opacity 0.38s ease, transform 0.38s ease' }}>
      
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
        <SDGWheel size={38} innerRatio={0.36} />
        <div>
          <div style={{ fontWeight:800, fontSize:'14px', color:'#111', letterSpacing:'0.04em' }}>SDG FOCUSED</div>
          <div style={{ fontSize:'11px', color:'#6b7280' }}>Building a sustainable future</div>
        </div>
      </div>

      <div style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
          <div style={{ width:40, height:40, borderRadius:'10px', background: isLogin ? '#e0e7ff' : '#fee2e2', color: isLogin ? '#4f46e5' : '#ef4444', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {isLogin ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            )}
          </div>
          <h2 style={{ fontSize:'18px', fontWeight:800, color:'#111', margin:0 }}>
            {isLogin ? 'Team Leader Access' : 'Team Leader Registration Only'}
          </h2>
        </div>

        {isLogin ? (
          <p style={{ fontSize:'13px', color:'#4b5563', lineHeight:1.6, margin:'0 0 24px' }}>
            This portal is intended for <strong>Team Leaders</strong>.<br/>
            Team members should contact their Team Leader for updates and submissions.
          </p>
        ) : (
          <>
            <p style={{ fontSize:'13px', color:'#4b5563', lineHeight:1.6, margin:'0 0 16px' }}>
              Only the <strong>Team Leader</strong> should create an account. After registration, the Team Leader can:
            </p>
            <ul style={{ paddingLeft:'20px', margin:'0 0 20px', fontSize:'13px', color:'#4b5563', lineHeight:1.6, display:'flex', flexDirection:'column', gap:'6px' }}>
              <li>✓ Create a Team</li>
              <li>✓ Add Team Members</li>
              <li>✓ Submit Project Details</li>
              <li>✓ Receive Official Updates</li>
            </ul>
            <p style={{ fontSize:'13px', color:'#ef4444', fontWeight:700, margin:'0 0 20px' }}>
              Team Members do NOT need to register separately.
            </p>

            <label style={{ display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', marginBottom:'24px', background:'#f9fafb', padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb' }}>
              <input type="checkbox" checked={leadCheckbox} onChange={e => setLeadCheckbox(e.target.checked)} style={{ marginTop:'2px', width:'16px', height:'16px', accentColor:'#4C9F38' }} />
              <span style={{ fontSize:'13px', color:'#111', fontWeight:600, lineHeight:1.4 }}>
                I confirm that I am the Team Leader of my team.
              </span>
            </label>
          </>
        )}

        <button 
          onClick={() => setAgreedToLead(true)}
          disabled={!isLogin && !leadCheckbox}
          style={{ width:'100%', padding:'13px', borderRadius:'10px', background: (!isLogin && !leadCheckbox) ? '#e5e7eb' : 'linear-gradient(135deg,#4C9F38,#3d8a2e)', color: (!isLogin && !leadCheckbox) ? '#9ca3af' : '#fff', fontWeight:800, fontSize:'14px', border:'none', cursor: (!isLogin && !leadCheckbox) ? 'not-allowed' : 'pointer', transition:'all 0.2s', boxShadow: (!isLogin && !leadCheckbox) ? 'none' : '0 4px 16px rgba(76,159,56,0.35)' }}
        >
          {isLogin ? 'Login' : 'I Understand, Continue Registration'}
        </button>
      </div>

      <p style={{ textAlign:'center', fontSize:'13px', color:'#6b7280', margin:'24px 0 0' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={() => switchMode(isLogin ? 'signup' : 'login')}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#4C9F38', fontWeight:700, fontSize:'13px', padding:0 }}>
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );

  const cardPanel = (
    <div style={{ padding:'20px', height:'100%', opacity: animating ? 0 : 1, transform: animating ? `translateX(${isLogin ? '28px' : '-28px'})` : 'translateX(0)', transition:'opacity 0.38s ease, transform 0.38s ease' }}>
      <SDGCard mode={mode} />
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f8fafc,#f0fdf4 50%,#f0f9ff)', padding:'24px', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif" }}>

      {/* Back button */}
      <button onClick={() => navigate('/')}
        style={{ position:'fixed', top:'24px', left:'24px', display:'flex', alignItems:'center', gap:'7px', background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:'10px', padding:'8px 16px', cursor:'pointer', fontSize:'13px', fontWeight:600, color:'#374151', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.2s', zIndex:100 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='#4C9F38'; e.currentTarget.style.color='#4C9F38'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#374151'; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Back to Home
      </button>

      {/* Main card */}
      <div className="auth-main-card" style={{ width:'100%', maxWidth:'940px', background:'#fff', borderRadius:'28px', boxShadow:'0 24px 80px rgba(0,0,0,0.10)', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'600px', overflow:'hidden' }}>
        {isLogin ? (
          <>
            <div>{agreedToLead ? formPanel : gatePanel}</div>
            <div className="auth-card-wrapper" style={{ background:'linear-gradient(135deg,#f0fdf4,#e8f5e9)' }}>{cardPanel}</div>
          </>
        ) : (
          <>
            <div className="auth-card-wrapper" style={{ background:'linear-gradient(135deg,#f0fdf4,#e8f5e9)' }}>{cardPanel}</div>
            <div>{agreedToLead ? formPanel : gatePanel}</div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #9ca3af; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .auth-card-wrapper { display: none !important; }
          .auth-main-card { min-height: auto !important; }
        }
        @media (max-width: 500px) {
          .auth-form { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
}
