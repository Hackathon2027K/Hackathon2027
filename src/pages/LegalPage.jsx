import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function LegalPage() {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, padding: '120px 24px 60px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}
        >
          {/* Tabs for easy switching */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <Link 
              to="/terms" 
              style={{ 
                textDecoration: 'none', 
                fontWeight: 600, 
                fontSize: '15px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: !isPrivacy ? '#f1f5f9' : 'transparent',
                color: !isPrivacy ? '#0f172a' : '#64748b'
              }}
            >
              Terms & Conditions
            </Link>
            <Link 
              to="/privacy" 
              style={{ 
                textDecoration: 'none', 
                fontWeight: 600, 
                fontSize: '15px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: isPrivacy ? '#f1f5f9' : 'transparent',
                color: isPrivacy ? '#0f172a' : '#64748b'
              }}
            >
              Privacy Policy
            </Link>
          </div>

          <div style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
            {!isPrivacy ? (
              // TERMS AND CONDITIONS
              <>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Terms and Conditions</h1>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>Last updated: July 2026</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
                <p>By registering for and participating in the SRCAS Hackathon 3.0 (accessible via hackathon2026.in), you agree to abide by these Terms and Conditions. If you do not agree with any part of these terms, you may not participate in the event.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>2. Eligibility and Team Formation</h2>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Participation is strictly limited to currently enrolled college students.</li>
                  <li>Teams must consist of exactly 2 to 4 members. Solo participation is not permitted.</li>
                  <li>All team members must belong to the same educational institution.</li>
                  <li>Participants must present a valid college ID card (both digitally during registration and physically at the offline finale) to verify eligibility.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>3. Event Rules and Submissions</h2>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Project Scope:</strong> Projects must align with one of the 17 UN Sustainable Development Goals (SDGs) provided by the organizers.</li>
                  <li><strong>Development Window:</strong> For software projects, all coding and development must occur strictly during the 24-hour hackathon period. The use of pre-built projects or pre-written code is prohibited and will result in immediate disqualification.</li>
                  <li><strong>Hardware/IoT Exception:</strong> Teams building hardware-based solutions may procure, assemble, and test physical components prior to the event. However, all software integration and application development must be completed during the 24-hour event window.</li>
                  <li><strong>AI Assistance:</strong> "Vibe coding" and the use of AI-assisted development tools (LLMs) are permitted during the hacking period.</li>
                  <li><strong>Originality:</strong> Plagiarism of any kind will not be tolerated. Submissions found to be entirely copied from existing repositories without significant original contribution will be disqualified.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>4. Intellectual Property</h2>
                <p>Teams retain full ownership of the intellectual property (IP), code, and prototypes they create during the hackathon. By participating, you grant SRCAS Hackathon 3.0 a non-exclusive, royalty-free license to use your project name, team name, and a description of your submission for promotional and reporting purposes.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>5. Media Release and Photography</h2>
                <p>By attending the offline finale, you consent to being photographed, filmed, and/or recorded. You grant the organizers the right to use these media materials for promotional, educational, and marketing purposes without compensation.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>6. Code of Conduct</h2>
                <p>We are committed to providing a safe, inclusive, and harassment-free experience for everyone. Any form of harassment, discrimination, or unsportsmanlike conduct will result in immediate expulsion from the event. The decisions made by the judging panel are final and binding.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>7. Limitation of Liability & Safety</h2>
                <p>The organizers of SRCAS Hackathon 3.0 shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from participation in the event, including but not limited to loss of data, hardware damage, or personal injury. Participants attending the offline finale are solely responsible for their personal belongings and equipment.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>8. Right to Modify</h2>
                <p>The organizing committee reserves the right to modify these terms, event rules, schedules, or prize structures at any time. Participants will be notified of any significant changes via the platform or registered email.</p>
              </>
            ) : (
              // PRIVACY POLICY
              <>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Privacy Policy</h1>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>Last updated: July 2026</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>1. Information We Collect</h2>
                <p>To facilitate the SRCAS Hackathon 3.0, we collect the following personal information from participants during the registration process on hackathon2026.in:</p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <li><strong>Identity Data:</strong> Full name, phone number, and email address.</li>
                  <li><strong>Academic Data:</strong> College name, state, city, department, year of study, and university registration numbers.</li>
                  <li><strong>Verification Media:</strong> Digital image uploads of the front and back of your official college ID card.</li>
                  <li><strong>Technical Data:</strong> Essential session data and cookies required to keep you securely logged into the platform.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>2. How We Use Your Information</h2>
                <p>We use the collected data exclusively for the administration of the hackathon, including:</p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <li>Verifying your student status and eligibility.</li>
                  <li>Managing team formations and database records.</li>
                  <li>Sending critical event updates, announcements, and authentication emails.</li>
                  <li>Evaluating submissions and distributing prizes.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>3. Data Storage and Security</h2>
                <p>Your personal data and uploaded ID card images are securely stored using industry-standard encrypted databases and cloud storage solutions. Access to this data is strictly limited to the core organizing committee and authorized platform administrators for verification purposes only.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>4. Third-Party Services</h2>
                <p>We do not sell, rent, or trade your personal information to outside parties. We utilize trusted third-party infrastructure providers (such as Supabase) to operate the platform and authenticate users securely. These providers process data in compliance with strict global security standards.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>5. Data Retention and Deletion</h2>
                <p>Your data will be retained for the duration necessary to complete the hackathon, announce winners, and finalize post-event reporting. If you upload an incorrect ID card, wish to withdraw your registration, or want your data permanently deleted from our systems, you may contact the organizing team to request immediate data removal.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>6. Consent</h2>
                <p>By creating an account, assembling a team, and uploading your verification documents on hackathon2026.in, you explicitly consent to the collection and use of your information as outlined in this Privacy Policy.</p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
