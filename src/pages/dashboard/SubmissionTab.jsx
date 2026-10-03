import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { sanitizeInput } from '../../lib/security';
import OfficialPPT from '../../assets/PPT/SRCAS HACKATHON 3.0.pptx';


const card = (extra = {}) => ({ background: '#fff', borderRadius: 14, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1.5px solid #f0f0f0', ...extra });

const STEPS = ['Guidelines', 'Project Info', 'Review & Submit'];

const SDG_OPTIONS = [
  "SDG 1 - No Poverty", "SDG 2 - Zero Hunger", "SDG 3 - Good Health", "SDG 4 - Quality Education",
  "SDG 5 - Gender Equality", "SDG 6 - Clean Water", "SDG 7 - Clean Energy", "SDG 8 - Economic Growth",
  "SDG 9 - Industry & Innovation", "SDG 10 - Reduced Inequalities", "SDG 11 - Sustainable Cities",
  "SDG 12 - Responsible Consumption", "SDG 13 - Climate Action", "SDG 14 - Life Below Water",
  "SDG 15 - Life on Land", "SDG 16 - Peace & Justice", "SDG 17 - Partnerships"
];

function Field({ label, value, onChange, placeholder, type = 'text', hint, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: '#9ca3af' }}>{hint}</span>}
      </div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={e => { e.target.style.borderColor = '#4C9F38'; e.target.style.boxShadow = '0 0 0 3px rgba(76,159,56,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
        style={{ padding: '10px 13px', borderRadius: 10, border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', fontSize: 13, color: '#111', outline: 'none', transition: 'border-color 0.2s' }} />
      {error && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{error}</span>}
    </div>
  );
}

export default function SubmissionTab({ hasTeam, teamData, teamMembers, submissions, setSubmissions, setActiveTab }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [guidelinesRead, setGuidelinesRead] = useState(false);

  const [sdgOpen, setSdgOpen] = useState(false);
  const sdgRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sdgRef.current && !sdgRef.current.contains(event.target)) {
        setSdgOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if they already submitted
  const alreadySubmitted = submissions && submissions.length > 0;

  const [form, setForm] = useState(() => {
    let initialState = {
      title: alreadySubmitted ? submissions[0].project_title : '',
      sdg: alreadySubmitted ? (submissions[0].sdg_goal ? submissions[0].sdg_goal.split(', ') : []) : [],
      category: alreadySubmitted ? submissions[0].category : '',
      category_other: '',
      description: alreadySubmitted ? submissions[0].project_description : '',
      pdf: null,
      pdf_url: alreadySubmitted ? submissions[0].pdf_url : ''
    };

    return initialState;
  });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target ? e.target.value : e }));

  const handleSdgToggle = (val) => {
    setForm(prev => {
      const current = Array.isArray(prev.sdg) ? prev.sdg : (prev.sdg ? prev.sdg.split(', ') : []);
      if (current.includes(val)) {
        return { ...prev, sdg: current.filter(s => s !== val) };
      } else {
        return { ...prev, sdg: [...current, val] };
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      let pdf_url = '';

      // Upload PDF if provided
      if (form.pdf) {
        if (!form.pdf.type.includes('pdf')) {
          throw new Error('Only PDF files are allowed for presentation uploads.');
        }
        if (form.pdf.size > 3 * 1024 * 1024) {
          throw new Error('File size is too large. Please compress your PDF to under 3MB and try again.');
        }

        const fileExt = form.pdf.name.split('.').pop();
        const fileName = `${teamData.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('presentations_deck')
          .upload(fileName, form.pdf);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('presentations_deck')
          .getPublicUrl(fileName);

        pdf_url = publicUrl;
      }

      const cleanCategory = sanitizeInput(form.category === 'Other' ? form.category_other : form.category);

      const newSubmission = {
        team_id: teamData.id,
        project_title: sanitizeInput(form.title),
        sdg_goal: Array.isArray(form.sdg) ? sanitizeInput(form.sdg.join(', ')) : sanitizeInput(form.sdg),
        category: cleanCategory,
        project_description: sanitizeInput(form.description),
        pdf_url: pdf_url
      };

      // Insert to submissions table
      const { data, error } = await supabase.from('submissions').insert(newSubmission).select();

      if (error) throw error;

      if (setSubmissions) setSubmissions(data && data.length > 0 ? data : [newSubmission]);
      setForm(p => ({ ...p, pdf_url: pdf_url }));
      setSuccess(true);
      setToastMsg('🎉 Project submitted successfully!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasTeam) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div className="dash-card" style={card({ width: '100%', maxWidth: 500 })}>
          <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111', textAlign: 'center', marginBottom: 8 }}>Submission Locked</h2>
          <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>You must register your team in the "My Team" tab before you can submit a project.</p>
        </div>
      </div>
    );
  }

  const isTeamTooSmall = !teamMembers || teamMembers.length === 0;

  if (isTeamTooSmall) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div className="dash-card" style={card({ width: '100%', maxWidth: 500 })}>
          <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111', textAlign: 'center', marginBottom: 8 }}>Not Enough Members</h2>
          <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>You must have at least 2 members to submit a project. Go back to My Team and add a teammate.</p>
        </div>
      </div>
    );
  }

  // ID card gate - commented out
  // const missingIds = teamMembers?.some(m => !m.id_card_front_url || !m.id_card_back_url);
  // if (missingIds && !alreadySubmitted) {
  //   return (
  //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
  //       <div className="dash-card" style={card({ width: '100%', maxWidth: 500 })}>
  //         <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🆔</div>
  //         <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111', textAlign: 'center', marginBottom: 8 }}>Action Required: Upload ID Cards</h2>
  //         <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
  //           Please upload Front & Back Student ID cards for all team members to complete verification before you can submit your idea.
  //         </p>
  //         <button 
  //           onClick={() => {
  //             window.location.hash = '#upload-id';
  //             if (setActiveTab) setActiveTab('team');
  //           }} 
  //           style={{ width: '100%', padding: '12px 24px', borderRadius: 10, border: 'none', background: '#D97706', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }}
  //           onMouseEnter={e => e.currentTarget.style.background = '#b45309'}
  //           onMouseLeave={e => e.currentTarget.style.background = '#D97706'}
  //         >
  //           Add ID Cards Now
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const confirmDeleteSubmission = async (s) => {
    setSubmitting(true);
    try {
      if (s?.pdf_url) {
        try {
          const urlParts = s.pdf_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          if (fileName) {
            await supabase.storage.from('presentations_deck').remove([fileName]);
          }
        } catch (storageErr) {
          // Error deleting from storage
        }
      }

      // Use team_id for deletion to ensure it works even if s.id is missing locally
      const { error } = await supabase.from('submissions').delete().eq('team_id', teamData.id);
      if (error) throw error;
      if (setSubmissions) setSubmissions([]);
      setSuccess(false);
      setStep(0);
      setShowDeleteModal(false);
    } catch (err) {
      alert("Error deleting submission: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadySubmitted || success) {
    const s = alreadySubmitted ? submissions[0] : form;
    const isBeforeDeadline = new Date() <= new Date('2026-07-25T23:59:59'); // change the deadline here after July

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="dash-card" style={card({ width: '100%', borderLeft: '4px solid #4C9F38' })}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            🎉 Project Submitted!
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Your submission has been successfully received and is locked in for judging. Good luck!</p>
        </div>

        <div className="dash-card" style={card({ width: '100%' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: 0 }}>Submission Details</h3>
            {isBeforeDeadline && s.id && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={submitting}
                style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                Delete & Re-submit
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Project Title</span>
              <span style={{ fontSize: 14, color: '#111', fontWeight: 500 }}>{s.project_title || s.title}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>SDG Goal</span>
              <span style={{ fontSize: 14, color: '#111', fontWeight: 500 }}>{s.sdg_goal || s.sdg}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Category</span>
              <span style={{ fontSize: 14, color: '#111', fontWeight: 500 }}>{s.category}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Description</span>
              <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{s.project_description || s.description}</span>
            </div>
            {(s.pdf_url) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Presentation Deck</span>
                <a href={s.pdf_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f3f4f6', color: '#111', fontWeight: 600, fontSize: 13, borderRadius: 8, textDecoration: 'none', width: 'fit-content', border: '1px solid #e5e7eb', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                  View PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Delete Warning Modal */}
        {showDeleteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 8 }}>Delete Submission?</h3>
                <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 24, lineHeight: 1.5 }}>
                  Are you sure you want to delete your submission? You will need to fill out the form and upload your PDF again. <strong>This action cannot be undone.</strong>
                </p>
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={submitting}
                    style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmDeleteSubmission(s)}
                    disabled={submitting}
                    style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Word counter logic
  const wordCount = form.description ? form.description.trim().split(/\s+/).filter(w => w.length > 0).length : 0;

  const handleDescChange = (e) => {
    const val = e.target.value;
    const count = val.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (count <= 500 || val.length < form.description.length) {
      setForm({ ...form, description: val });
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 0) {
      if (!guidelinesRead) {
        setErrorMsg('Please confirm you have read the guidelines by checking the box below.');
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      let errors = {};
      let hasError = false;

      if (!form.title.trim()) { errors.title = 'Project Title is required.'; hasError = true; }
      if (!form.sdg || form.sdg.length === 0) { errors.sdg = 'Please select at least one SDG Goal.'; hasError = true; }
      if (!form.category) { errors.category = 'Please select a Category.'; hasError = true; }
      else if (form.category === 'Other' && !form.category_other?.trim()) { errors.category_other = 'Please specify the category.'; hasError = true; }

      const wordCount = form.description ? form.description.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
      if (!form.description || wordCount < 10) { errors.description = 'Please provide a valid project description (min 10 words).'; hasError = true; }
      else if (wordCount > 500) { errors.description = 'Project description cannot exceed 500 words.'; hasError = true; }

      if (!form.pdf && !form.pdf_url) { errors.pdf = 'Presentation Deck (PDF) is required.'; hasError = true; }

      setFieldErrors(errors);
      if (hasError) return;

      setStep(2);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stepper */}
      <div className="dash-card" style={card({ padding: '16px 24px' })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i <= step ? '#4C9F38' : '#f3f4f6', border: `2px solid ${i <= step ? '#4C9F38' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  {i < step
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    : <span style={{ fontSize: 12, fontWeight: 800, color: i <= step ? '#fff' : '#9ca3af' }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 500, color: i <= step ? '#4C9F38' : '#9ca3af', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#4C9F38' : '#e5e7eb', margin: '0 8px', marginBottom: 20 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {errorMsg && <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: 13 }}>{errorMsg}</div>}

      {/* Step content */}
      <div className="dash-card" style={card()}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Section A: Team Reference */}
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 12, border: '1.5px solid #e5e7eb' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4C9F38" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                Team Summary
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', width: 90 }}>Team Name:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{teamData.team_name}</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', width: 90 }}>Members:</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                    {teamMembers ? teamMembers.map(m => m.full_name).join(', ') : 'No members found'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submission Guidelines Note */}
            <div style={{ padding: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#14532d', display: 'flex', alignItems: 'center', gap: 6 }}>
                Submission Guidelines
              </div>
              <ul style={{ fontSize: 12, color: '#166534', margin: 0, paddingLeft: 16, lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Download the official PPT template using the button below.</li>
                <li>Fill out all slides with your project details and team information.</li>
                <li>Export the completed presentation as a PDF document.</li>
                <li>Upload the PDF file in the <b>Presentation Deck</b> section below.</li>
                <li>You may delete and resubmit your project idea at any time before the final submission deadline on July 25th.</li>
              </ul>
              <a href={OfficialPPT} download="SRCAS_HACKATHON_3.0_Template.pptx" style={{ alignSelf: 'flex-start', display: 'inline-block', padding: '6px 12px', background: '#4C9F38', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none', marginTop: 4 }}>
                ↓ Download PPT Template
              </a>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', background: guidelinesRead ? '#f0fdf4' : '#f9fafb', borderRadius: 10, border: guidelinesRead ? '1.5px solid #bbf7d0' : '1.5px solid #e5e7eb', width: 'fit-content', transition: 'all 0.2s' }}>
              <input
                type="checkbox"
                checked={guidelinesRead}
                onChange={e => { setGuidelinesRead(e.target.checked); if (e.target.checked) setErrorMsg(''); }}
                style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#4C9F38' }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: guidelinesRead ? '#166534' : '#374151', transition: 'color 0.2s' }}>
                I have read and understood the submission guidelines, and I am ready to submit.
              </span>
            </label>
          </div>
        )}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Section B: Project Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 4 }}>Project Information</div>
              <Field label="Project Title" value={form.title} onChange={set('title')} placeholder="Your project name" error={fieldErrors.title} />
              <div className="dash-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }} ref={sdgRef}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>SDG Goals</label>
                  <div style={{ position: 'relative', minWidth: 0 }}>
                    <div
                      onClick={() => setSdgOpen(!sdgOpen)}
                      style={{
                        padding: '10px 13px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13,
                        background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: form.sdg && form.sdg.length > 0 ? '#111' : '#9ca3af'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', flex: 1 }}>
                        {form.sdg && form.sdg.length > 0 ? form.sdg.join(', ') : 'Select SDG Goals...'}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sdgOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 8 }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>

                    {sdgOpen && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', zIndex: 10,
                        padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff',
                        maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}>
                        {SDG_OPTIONS.map(opt => {
                          const isChecked = Array.isArray(form.sdg) ? form.sdg.includes(opt) : (form.sdg || '').includes(opt);
                          return (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#111', padding: '4px 0' }}>
                              <input type="checkbox" checked={isChecked} onChange={() => handleSdgToggle(opt)} style={{ cursor: 'pointer', accentColor: '#4C9F38' }} />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {fieldErrors.sdg && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{fieldErrors.sdg}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Category</label>
                  <select value={form.category} onChange={set('category')} style={{ padding: '10px 13px', borderRadius: 10, border: fieldErrors.category ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', background: '#fff', color: form.category ? '#111' : '#9ca3af' }}>
                    <option value="" disabled>Select Category...</option>
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                    <option value="IoT">IoT</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.category && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{fieldErrors.category}</span>}

                  {form.category === 'Other' && (
                    <>
                      <input type="text" value={form.category_other} onChange={set('category_other')} placeholder="Please specify category..."
                        style={{ padding: '10px 13px', borderRadius: 10, border: fieldErrors.category_other ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', fontSize: 13, color: '#111', outline: 'none', marginTop: 4 }} />
                      {fieldErrors.category_other && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{fieldErrors.category_other}</span>}
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', justifyContent: 'space-between' }}>
                  Project Description
                  <span style={{ color: wordCount >= 500 ? '#E5243B' : '#9ca3af', fontWeight: 500, fontSize: 11 }}>{wordCount} / 500 words</span>
                </label>
                <textarea value={form.description} onChange={handleDescChange} placeholder="Describe your solution..." rows={6}
                  style={{ padding: '12px 14px', borderRadius: 10, border: fieldErrors.description ? '1.5px solid #ef4444' : (wordCount >= 500 ? '1.5px solid #fecaca' : '1.5px solid #e5e7eb'), fontSize: 13, color: '#111', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                {fieldErrors.description && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{fieldErrors.description}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Presentation Deck
                  <a href={OfficialPPT} download="SRCAS_HACKATHON_3.0_Template.pptx" style={{ fontSize: 11, color: '#4C9F38', textDecoration: 'none', fontWeight: 600 }}>↓ Download Template</a>
                </label>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Please upload your presentation using the official template as a PDF. Max 3MB.</div>
                <input type="file" accept=".pdf" onChange={e => setForm({ ...form, pdf: e.target.files[0] })}
                  style={{ padding: '10px 13px', borderRadius: 10, border: fieldErrors.pdf ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', fontSize: 13, color: '#111', background: '#f9fafb' }} />
                {fieldErrors.pdf && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{fieldErrors.pdf}</span>}
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 4 }}>Review Your Submission</div>
            {[['Project Title', form.title], ['SDG Goal', Array.isArray(form.sdg) ? form.sdg.join(', ') : form.sdg], ['Category', form.category === 'Other' ? form.category_other : form.category], ['Presentation PDF', form.pdf ? form.pdf.name : 'No file chosen']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: '#f9fafb', borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', minWidth: 110, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 12, color: '#374151', wordBreak: 'break-word' }}>{v || '-'}</span>
              </div>
            ))}
            {form.pdf && (
              <button
                onClick={() => window.open(URL.createObjectURL(form.pdf), '_blank')}
                style={{ padding: '10px 20px', background: '#f3f4f6', color: '#111', borderRadius: 8, border: '1.5px solid #e5e7eb', cursor: 'pointer', fontWeight: 700, fontSize: 13, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                Preview Uploaded PDF
              </button>
            )}
            <div style={{ padding: 14, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10, marginTop: 8 }}>
              <p style={{ fontSize: 12, color: '#14532d', margin: 0 }}>✅ By submitting, you confirm all information is accurate and your project is your original work. You cannot edit this after submission.</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} style={{ padding: '12px 22px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer', color: step === 0 ? '#d1d5db' : '#374151', opacity: step === 0 ? 0.5 : 1, textAlign: 'center', whiteSpace: 'nowrap' }} disabled={step === 0}>
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {step < STEPS.length - 1
            ? <button onClick={handleNext} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#4C9F38', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center', whiteSpace: 'nowrap' }}>Next →</button>
            : <button disabled={submitting} onClick={handleSubmit} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4C9F38,#3d8a2e)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(76,159,56,0.3)', opacity: submitting ? 0.7 : 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
              {submitting ? 'Uploading...' : 'Submit Project 🚀'}
            </button>
          }
        </div>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            style={{
              position: 'fixed', bottom: 40, left: '50%', x: '-50%',
              background: '#111', color: '#fff', padding: '14px 24px', borderRadius: 100,
              fontSize: '0.95rem', fontWeight: 700, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
