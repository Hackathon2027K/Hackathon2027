import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
export default function IdCardUpload({ memberName, onComplete, onCancel }) {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');
  
  const [showPopup, setShowPopup] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleFileChange = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError(`File size must be less than 2MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP) are allowed.');
      return;
    }

    setError('');
    const previewUrl = URL.createObjectURL(file);

    if (side === 'front') {
      setFrontFile(file);
      setFrontPreview(previewUrl);
    } else {
      setBackFile(file);
      setBackPreview(previewUrl);
    }

    // If the other side is already selected, show the popup automatically
    if ((side === 'front' && backFile) || (side === 'back' && frontFile)) {
      setTimeout(() => setShowPopup(true), 300);
    }
  };

  const handleUploadAndConfirm = () => {
    if (!frontFile || !backFile || !confirmed) return;
    
    onComplete({
      frontFile,
      backFile,
      frontPreview,
      backPreview
    });
    
    setShowPopup(false);
  };

  const uploadBoxStyle = (preview) => ({
    border: `2px dashed ${preview ? '#4C9F38' : '#e5e7eb'}`,
    background: preview ? '#f0fdf4' : '#f9fafb',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    height: '180px',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 4px 0' }}>Upload ID Card</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            {memberName ? `For ${memberName}` : 'Upload the front and back of the student ID.'}
          </p>
        </div>
        {onCancel && (
          <button onClick={onCancel} style={{ background: '#f3f4f6', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        {/* Front Upload */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px', display: 'block' }}>Front Side</label>
          <div onClick={() => frontInputRef.current?.click()} style={uploadBoxStyle(frontPreview)}>
            {frontPreview ? (
              <img src={frontPreview} alt="Front Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px', color: '#4C9F38' }}>
                  <Upload size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>Click to upload</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>JPEG, PNG max 2MB</div>
              </>
            )}
            <input type="file" ref={frontInputRef} onChange={(e) => handleFileChange('front', e)} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
          </div>
        </div>

        {/* Back Upload */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px', display: 'block' }}>Back Side</label>
          <div onClick={() => backInputRef.current?.click()} style={uploadBoxStyle(backPreview)}>
            {backPreview ? (
              <img src={backPreview} alt="Back Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px', color: '#4C9F38' }}>
                  <ImageIcon size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>Click to upload</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>JPEG, PNG max 2MB</div>
              </>
            )}
            <input type="file" ref={backInputRef} onChange={(e) => handleFileChange('back', e)} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
          </div>
        </div>

      </div>

      {frontFile && backFile && !showPopup && (
        <button onClick={() => setShowPopup(true)} style={{ width: '100%', marginTop: '24px', padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Review & Confirm
        </button>
      )}

      {/* POPUP PREVIEW MODAL */}
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '800px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: '0 0 4px 0' }}>Review ID Card</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Please ensure all text is clearly visible and readable.</p>
              </div>
              <button onClick={() => setShowPopup(false)} style={{ background: '#f3f4f6', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', background: '#f8fafc' }}>
              <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#374151', marginBottom: '12px', textAlign: 'center' }}>Front Side</div>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <img src={frontPreview} alt="Front" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }} />
                </div>
              </div>
              <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#374151', marginBottom: '12px', textAlign: 'center' }}>Back Side</div>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <img src={backPreview} alt="Back" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }} />
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: '#f0fdf4', padding: '16px 20px', borderRadius: '12px', border: '1.5px solid #bbf7d0', marginBottom: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={confirmed} 
                  onChange={(e) => setConfirmed(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: '#4C9F38', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#166534' }}>
                  I confirm that both images are clear, correct, and belong to {memberName || 'this team member'}.
                </span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <button 
                  onClick={() => setShowPopup(false)} 
                  style={{ padding: '12px 24px', borderRadius: '12px', background: '#fff', border: '1.5px solid #e5e7eb', fontSize: '15px', fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                >
                  Cancel & Reselect
                </button>
                <button 
                  onClick={handleUploadAndConfirm} 
                  disabled={!confirmed}
                  style={{ padding: '12px 32px', borderRadius: '12px', background: !confirmed ? '#9ca3af' : '#4C9F38', border: 'none', fontSize: '15px', fontWeight: 800, color: '#fff', cursor: !confirmed ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                >
                  Confirm <Check size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
