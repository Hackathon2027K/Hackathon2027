import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, User, ExternalLink, Copy, Check, Mail, MessagesSquare } from 'lucide-react';
import PPTSection from '../components/sections/PPTSection';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function CopyPhone({ number, display }) {
    const [copied, setCopied] = useState(false);
    const copy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(number).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
            <a href={`tel:${number}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: '#111', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem'
            }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Phone size={14} color="#111" />
                </div>
                {display}
            </a>
            <button
                onClick={copy}
                title="Copy number"
                style={{
                    background: copied ? '#111' : '#fff', border: '1px solid #e5e7eb', cursor: 'pointer',
                    width: 32, height: 32, borderRadius: '50%',
                    color: copied ? '#fff' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
            >
                <AnimatePresence mode="wait">
                    {copied
                        ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={14} /></motion.span>
                        : <motion.span key="copy"  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy size={14} /></motion.span>
                    }
                </AnimatePresence>
            </button>
        </div>
    );
}

// Custom 3D-like Mail graphic
const MailGraphic = () => (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ position: 'absolute', inset: 20, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" fill="#f9fafb" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeWidth="2" />
            </svg>
        </motion.div>
        {/* Floating elements */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }} style={{ position: 'absolute', top: 10, right: 10, width: 40, height: 40, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(37,211,102,0.2)' }}>
            <MessagesSquare size={18} color="#fff" />
        </motion.div>
    </div>
);

const ContactSection = () => {
    return (
        <section id="contact" style={{
            position: "relative",
            backgroundColor: "#fdfdfd",
            overflow: "hidden",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            paddingTop: '100px'
        }}>
            {/* Subtle dot grid */}
            <div aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
                
                {/* Header Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '64px',
                    alignItems: 'center',
                    marginBottom: '80px',
                }} className="contact-top-grid">
                    
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '24px', height: '1px', background: '#d1d5db' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', color: '#4b5563' }}>CONTACT US</span>
                        </motion.div>
                        <motion.h2 variants={fadeInUp} style={{
                            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                            fontWeight: 900,
                            color: '#111',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.05,
                            margin: '0 0 24px',
                        }}>
                            Let's start a<br/>
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                                conversation
                                <svg width="100%" height="20" viewBox="0 0 120 20" style={{ position: 'absolute', bottom: '-10px', left: 0, overflow: 'visible' }}>
                                    <path d="M5 15 Q 40 5, 115 15" fill="none" stroke="#25D366" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} style={{
                            fontSize: '1.05rem',
                            color: '#6b7280',
                            lineHeight: 1.6,
                            maxWidth: 480,
                        }}>
                            Hacker experience is our priority! Have questions, need assistance, or just want to chat about your ideas? Our coordinators are here for you.
                        </motion.p>

                        {/* <motion.a 
                            variants={fadeInUp}
                            href="https://chat.whatsapp.com/BXFPp6PTWk4I6wG7UMCbAP"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '16px',
                                marginTop: '32px', padding: '16px 24px',
                                background: '#fff', border: '1.5px solid #e5e7eb',
                                borderRadius: '16px', textDecoration: 'none',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#25D366';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(37,211,102,0.12)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.02)';
                            }}
                        >
                            <div style={{ width: 48, height: 48, background: '#25D366', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}>
                                <MessagesSquare size={24} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#25D366', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Community</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>Join WhatsApp Group</div>
                            </div>
                            <div style={{ marginLeft: '12px', color: '#9ca3af' }}>
                                <ExternalLink size={18} />
                            </div>
                        </motion.a> */}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ display: 'flex', justifyContent: 'center' }}>
                        <MailGraphic />
                    </motion.div>
                </div>

                {/* Bento Grid Content */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                        gap: "24px",
                        marginBottom: "100px"
                    }}
                >
                    {/* Coordinator 1 */}
                    <motion.div variants={fadeInUp} style={{
                        background: '#fff', borderRadius: '24px', padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.02)',
                        display: 'flex', flexDirection: 'column', gap: '24px'
                    }}>
                        <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} color="#111" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Mrs. Supraja</h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>Hackathon Coordinator</p>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CopyPhone number="+917338893731" display="+91 73388 93731" />
                        </div>
                    </motion.div>

                    {/* Coordinator 2 */}
                    <motion.div variants={fadeInUp} style={{
                        background: '#fff', borderRadius: '24px', padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.02)',
                        display: 'flex', flexDirection: 'column', gap: '24px'
                    }}>
                        <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} color="#111" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Dr. M. Praneesh</h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>Programming Club Staff Coordinator</p>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CopyPhone number="+919629924052" display="+91 96299 24052" />
                        </div>
                    </motion.div>

                    {/* Coordinator 3 */}
                    <motion.div variants={fadeInUp} style={{
                        background: '#fff', borderRadius: '24px', padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.02)',
                        display: 'flex', flexDirection: 'column', gap: '24px'
                    }}>
                        <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} color="#111" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Dhananjay R S</h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>Vice Chairman of Programming Club</p>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CopyPhone number="+919345060349" display="+91 93450 60349" />
                        </div>
                    </motion.div>
                    {/* Location Card */}
                    <motion.div variants={fadeInUp} style={{
                        background: '#fff', borderRadius: '24px', padding: '8px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.02)',
                        gridColumn: '1 / -1', // span full width
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.5fr',
                        gap: '24px'
                    }} className="contact-map-grid">
                        
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <MapPin size={24} color="#111" />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 16px' }}>Event Venue</h3>
                            <p style={{ color: '#4b5563', lineHeight: 1.7, margin: '0 0 32px', fontSize: '0.95rem' }}>
                                <strong>Sri Ramakrishna College of Arts & Science</strong><br />
                                Nava India, Avinashi Road<br />
                                Coimbatore, Tamil Nadu 641006
                            </p>
                            
                            <div style={{ marginTop: 'auto' }}>
                                <a
                                    href="https://maps.app.goo.gl/W7uqokm1bK1miC1b9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: '#111', color: '#fff', padding: '12px 24px',
                                        borderRadius: '100px', textDecoration: 'none',
                                        fontSize: '0.9rem', fontWeight: 700,
                                        transition: 'transform 0.2s, background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Open in Maps <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>

                        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '100%', minHeight: '300px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.2649563948785!2d76.9868191!3d11.0226208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85849d74c3695%3A0x9153ec3168293ec5!2sSri%20Ramakrishna%20College%20of%20Arts%20%26%20Science!5e0!3m2!1sen!2sin!4v1709283746000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, display: "block" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </motion.div>

                </motion.div>
            </div>
            
            {/* <PPTSection /> */}

            <style>{`
                @media (max-width: 900px) {
                    .contact-top-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
                    .contact-top-grid > div:first-child { display: flex; flex-direction: column; align-items: center; }
                    .contact-map-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 640px) {
                    #contact > div { padding-left: 24px !important; padding-right: 24px !important; }
                }
            `}</style>
        </section>
    );
};

export default ContactSection;
