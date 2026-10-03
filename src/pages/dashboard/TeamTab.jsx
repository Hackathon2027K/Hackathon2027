import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { sanitizeInput } from '../../lib/security';
import { Rocket, Users, Flag, ClipboardList, MoreVertical, Info, Target, Calendar, Check, AlertCircle, Clock } from 'lucide-react';
// import IdCardUpload from '../../components/IdCardUpload';

const INDIA_STATES_CITIES = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada", "Anantapur", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Roing"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Ara", "Begusarai"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Manali", "Kullu"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Kalaburagi", "Davangere", "Ballari", "Vijayapura", "Shivamogga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Kottayam", "Palakkad"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur", "Sangli", "Jalgaon"],
  "Manipur": ["Imphal", "Thoubal", "Kakching", "Churachandpur", "Bishnupur"],
  "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak"],
  "Puducherry": ["Puducherry", "Oulgaret", "Karaikal", "Yanam", "Mahe"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Moga", "Abohar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi", "Dindigul", "Thanjavur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Greater Noida"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"]
};

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence",
  "Data Science",
  "Other"
];

const defaultMember = {
  full_name: '', email: '', phone_number: '',
  state: '', city: '', city_other: '', dept: '', dept_other: '', year: '',
  college_name: '', reg_no: '', id_card_front_url: '', id_card_back_url: '', id_card_front_file: null, id_card_back_file: null
};

// Reusable inline styles to replace Tailwind
const styles = {
  card: { background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1.5px solid #f0f0f0' },
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', background: '#fff', transition: 'border-color 0.2s', fontFamily: 'inherit' },
  inputDisabled: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed', fontFamily: 'inherit' },
  label: { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' },
  buttonPrimary: { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#4C9F38', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'transform 0.1s, background 0.2s', boxShadow: '0 4px 12px rgba(76,159,56,0.2)' },
  buttonSecondary: { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#111', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'transform 0.1s, background 0.2s' },
  buttonDisabled: { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#e5e7eb', color: '#9ca3af', fontSize: 14, fontWeight: 800, cursor: 'not-allowed' },
  buttonBack: { padding: '12px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }
};

export default function TeamTab({ hasTeam, teamData, teamMembers, user, setTeamMembers, setTeamData, setHasTeam, setActiveTab }) {
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: 2,
    leader: {
      ...defaultMember,
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || ''
    },
    teammates: [{ ...defaultMember }] // Initialized for teamSize 2 (1 teammate)
  });

  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [showIdPopup, setShowIdPopup] = useState(false);

  const startEditTeam = (stepToOpen = 0) => {
    const leader = teamMembers?.find(m => m.id === teamData?.leader_id) || teamMembers?.find(m => m.email === user?.email);
    const teammates = teamMembers?.filter(m => m.id !== leader?.id) || [];

    const parseLocation = (loc) => {
      if (!loc) return { state: '', city: '' };
      const parts = loc.split(', ');
      if (parts.length >= 2) {
        return { city: parts[0], state: parts.slice(1).join(', ') };
      }
      return { state: '', city: loc };
    };

    setFormData({
      teamName: teamData?.team_name || '',
      teamSize: teamMembers?.length || 2,
      leader: {
        ...defaultMember,
        ...leader,
        ...parseLocation(leader?.location),
        dept: DEPARTMENTS.includes(leader?.dept) ? leader.dept : 'Other',
        dept_other: DEPARTMENTS.includes(leader?.dept) ? '' : leader?.dept
      },
      teammates: teammates.map(m => ({
        ...defaultMember,
        ...m,
        ...parseLocation(m.location),
        dept: DEPARTMENTS.includes(m.dept) ? m.dept : 'Other',
        dept_other: DEPARTMENTS.includes(m.dept) ? '' : m.dept
      }))
    });
    setIsEditingTeam(true);
    setCurrentStep(stepToOpen);
  };

  // useEffect(() => {
  //   if (hasTeam && teamMembers && teamMembers.length > 0) {
  //     const missing = teamMembers.some(m => !m.id_card_front_url || !m.id_card_back_url);
  //     if (window.location.hash === '#upload-id') {
  //       window.location.hash = '';
  //       if (!isEditingTeam) {
  //         startEditTeam(1);
  //       }
  //     } else if (missing && !isEditingTeam) {
  //       setShowIdPopup(true);
  //     }
  //   }
  // }, [hasTeam, isEditingTeam, teamMembers]);



  // --- VALIDATION ---
  const validateCurrentStep = () => {
    setErrorMsg('');
    if (currentStep === 0) {
      if (!formData.teamName.trim()) return "Team Name is required.";
      if (!/^[a-zA-Z0-9 ]+$/.test(formData.teamName)) return "Team Name can only contain letters, numbers, and spaces.";
      return true;
    }

    const validateMember = (member) => {
      if (!member.full_name.trim() || !member.email.trim() || !member.phone_number.trim() || !member.state || !member.city || !member.dept || !member.year || !member.college_name.trim() || !member.reg_no.trim()) {
        return "Please fill out all fields.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        return "Please enter a valid email address.";
      }
      if (!/^\d{10}$/.test(member.phone_number)) {
        return "Phone number must be exactly 10 digits.";
      }
      if (member.dept === 'Other' && !member.dept_other?.trim()) {
        return "Please specify your department.";
      }
      if (member.city === 'Other' && !member.city_other?.trim()) {
        return "Please specify your city/district.";
      }
      // if (!member.id_card_front_url || !member.id_card_back_url) {
      //   return "Please upload and confirm the Student ID Card (Front & Back).";
      // }
      return true;
    };

    if (currentStep === 1) {
      return validateMember(formData.leader);
    }

    if (currentStep > 1) {
      const teammateIndex = currentStep - 2;
      return validateMember(formData.teammates[teammateIndex]);
    }

    return true;
  };

  const handleNext = () => {
    const isValid = validateCurrentStep();
    if (isValid !== true) {
      setErrorMsg(isValid);
      return;
    }
    setErrorMsg('');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const isValid = validateCurrentStep();
    if (isValid !== true) {
      setErrorMsg(isValid);
      return;
    }

    setCreating(true);
    setErrorMsg('');
    try {
      let currentTeamId = teamData?.id;
      let finalTeamData = teamData;

      // 1. Create or Update Team
      const cleanTeamName = sanitizeInput(formData.teamName);

      if (isEditingTeam) {
        const { error: teamErr } = await supabase.from('teams').update({
          team_name: cleanTeamName
        }).eq('id', currentTeamId);
        if (teamErr) throw teamErr;
        finalTeamData = { ...teamData, team_name: cleanTeamName };
      } else {
        const { data: team, error: teamErr } = await supabase.from('teams').insert({
          leader_id: user.id,
          team_name: cleanTeamName
        }).select().single();
        if (teamErr) throw teamErr;
        currentTeamId = team.id;
        finalTeamData = team;
      }

      // --- Upload Files Helper ---
      const uploadFile = async (file, memberName, side) => {
        if (!file) return null;
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed for ID cards.');
        }
        if (file.size > 3 * 1024 * 1024) {
          throw new Error('ID card image size must be under 3MB.');
        }
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const safeName = memberName ? memberName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'member';
        const path = `uploads/${timestamp}_${randomStr}_${safeName}_${side}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('id-cards').upload(path, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;

        const { data } = supabase.storage.from('id-cards').getPublicUrl(path);
        return data.publicUrl;
      };

      // --- Upload Files for Leader ---
      if (formData.leader.id_card_front_file) {
        formData.leader.id_card_front_url = await uploadFile(formData.leader.id_card_front_file, formData.leader.full_name, 'front');
      }
      if (formData.leader.id_card_back_file) {
        formData.leader.id_card_back_url = await uploadFile(formData.leader.id_card_back_file, formData.leader.full_name, 'back');
      }

      // --- Upload Files for Teammates ---
      for (let i = 0; i < formData.teammates.length; i++) {
        if (formData.teammates[i].id_card_front_file) {
          formData.teammates[i].id_card_front_url = await uploadFile(formData.teammates[i].id_card_front_file, formData.teammates[i].full_name, 'front');
        }
        if (formData.teammates[i].id_card_back_file) {
          formData.teammates[i].id_card_back_url = await uploadFile(formData.teammates[i].id_card_back_file, formData.teammates[i].full_name, 'back');
        }
      }

      // 2. Format Members (Merge State/City into Location, resolve Dept)
      const formatMember = (m, memberIsLeader = false) => {
        const cleanCity = sanitizeInput(m.city === 'Other' ? m.city_other : m.city);
        const cleanState = sanitizeInput(m.state);
        const cleanDept = sanitizeInput(m.dept === 'Other' ? m.dept_other : m.dept);

        const payload = {
          team_id: currentTeamId,
          full_name: sanitizeInput(m.full_name),
          email: sanitizeInput(m.email).toLowerCase(),
          phone_number: sanitizeInput(m.phone_number),
          location: `${cleanCity}, ${cleanState}`,
          college_name: sanitizeInput(m.college_name),
          reg_no: sanitizeInput(m.reg_no),
          dept: cleanDept,
          year: sanitizeInput(m.year),
          id_card_front_url: m.id_card_front_url,
          id_card_back_url: m.id_card_back_url,
          is_leader: memberIsLeader
        };
        if (m.id) payload.id = m.id; // Include ID for upsert if it exists
        return payload;
      };

      const allMembers = [
        formatMember(formData.leader, true),
        ...formData.teammates.map(t => formatMember(t, false))
      ];

      // 3. Upsert Members
      const { data: members, error: memErr } = await supabase.from('team_members').upsert(allMembers).select();
      if (memErr) throw memErr;

      setTeamData(finalTeamData);
      setTeamMembers(members);
      setHasTeam(true);
      setIsEditingTeam(false);
      setToastMsg(isEditingTeam ? '🎉 Team updated successfully!' : '🎉 Team created successfully!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

  // --- RENDER HELPERS ---
  const totalSteps = 2 + formData.teammates.length; // Setup + Leader + Teammates

  const renderMemberFields = (member, isLeader, index) => {
    const updateMember = (fieldOrObj, value) => {
      const updates = typeof fieldOrObj === 'object' ? fieldOrObj : { [fieldOrObj]: value };
      if (isLeader) {
        setFormData(prev => ({ ...prev, leader: { ...prev.leader, ...updates } }));
      } else {
        setFormData(prev => {
          const newTeammates = [...prev.teammates];
          newTeammates[index] = { ...newTeammates[index], ...updates };
          if (updates.state !== undefined) newTeammates[index].city = '';
          return { ...prev, teammates: newTeammates };
        });
      }
    };

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* Personal Details */}
          <div>
            <label style={styles.label}>Full Name</label>
            <input type="text" value={member.full_name} onChange={e => updateMember('full_name', e.target.value)} disabled={isLeader} style={isLeader ? styles.inputDisabled : styles.input} placeholder="Full Name" />
          </div>
          <div>
            <label style={styles.label}>Email Address</label>
            <input type="email" value={member.email} onChange={e => updateMember('email', e.target.value)} disabled={isLeader} style={isLeader ? styles.inputDisabled : styles.input} placeholder="Email Address" />
          </div>
          <div>
            <label style={styles.label}>Phone Number</label>
            <div style={{ display: 'flex', borderRadius: 10, border: '1.5px solid #e5e7eb', overflow: 'hidden', background: '#fff' }}>
              <span style={{ padding: '12px 14px', background: '#f9fafb', borderRight: '1.5px solid #e5e7eb', color: '#6b7280', fontSize: 14, fontWeight: 600 }}>+91</span>
              <input type="tel" value={member.phone_number} onChange={e => updateMember('phone_number', e.target.value.replace(/\D/g, '').slice(0, 10))} style={{ width: '100%', padding: '12px 14px', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit' }} placeholder="10-digit mobile number" />
            </div>
          </div>

          {/* Location Details */}
          <div>
            <label style={styles.label}>State</label>
            <select value={member.state} onChange={e => { updateMember('state', e.target.value); if (isLeader) setFormData(p => ({ ...p, leader: { ...p.leader, state: e.target.value, city: '' } })); }} style={{ ...styles.input, cursor: 'pointer' }}>
              <option value="" disabled>Select State</option>
              {Object.keys(INDIA_STATES_CITIES).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>City / District</label>
            <select value={member.city} onChange={e => updateMember('city', e.target.value)} disabled={!member.state} style={!member.state ? styles.inputDisabled : { ...styles.input, cursor: 'pointer' }}>
              <option value="" disabled>Select City</option>
              {member.state && INDIA_STATES_CITIES[member.state]?.map(c => <option key={c} value={c}>{c}</option>)}
              {member.state && <option value="Other">Other (Please Specify)</option>}
            </select>
          </div>
          {member.city === 'Other' && (
            <div>
              <label style={styles.label}>Specify City / District</label>
              <input type="text" value={member.city_other || ''} onChange={e => updateMember('city_other', e.target.value)} style={styles.input} placeholder="Your City" />
            </div>
          )}

          {/* Academic Details */}
          <div>
            <label style={styles.label}>College / Organization</label>
            <input type="text" value={member.college_name} onChange={e => updateMember('college_name', e.target.value)} style={styles.input} placeholder="E.g., SRCAS" />
          </div>
          <div>
            <label style={styles.label}>Register Number</label>
            <input type="text" value={member.reg_no} onChange={e => updateMember('reg_no', e.target.value)} style={styles.input} placeholder="Registration Number" />
          </div>
          <div>
            <label style={styles.label}>Department</label>
            <select value={member.dept} onChange={e => updateMember('dept', e.target.value)} style={{ ...styles.input, cursor: 'pointer' }}>
              <option value="" disabled>Select Department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          {member.dept === 'Other' && (
            <div>
              <label style={styles.label}>Specify Department</label>
              <input type="text" value={member.dept_other} onChange={e => updateMember('dept_other', e.target.value)} style={styles.input} placeholder="Your Department" />
            </div>
          )}
          <div>
            <label style={styles.label}>Year of Study</label>
            <select value={member.year} onChange={e => updateMember('year', e.target.value)} style={{ ...styles.input, cursor: 'pointer' }}>
              <option value="" disabled>Select Year</option>
              {[1, 2, 3, 4].map(y => <option key={y} value={`${y} Year`}>{y} Year</option>)}
            </select>
          </div>
        </div>

        {/* ID Card Upload 
        <div style={{ marginTop: 24, borderTop: '1.5px solid #e5e7eb', paddingTop: 24 }}>
          {!member.id_card_front_url ? (
            <IdCardUpload 
              memberName={member.full_name} 
              onComplete={(data) => {
                updateMember({
                  id_card_front_url: data.frontPreview,
                  id_card_back_url: data.backPreview,
                  id_card_front_file: data.frontFile,
                  id_card_back_file: data.backFile
                });
              }} 
            />
          ) : (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>ID Card Confirmed</div>
                  <div style={{ fontSize: 13, color: '#15803d' }}>Front and back images uploaded successfully.</div>
                </div>
              </div>
              <button type="button" onClick={() => { 
                updateMember({
                  id_card_front_url: '', 
                  id_card_back_url: '',
                  id_card_front_file: null,
                  id_card_back_file: null
                }); 
              }} style={{ padding: '8px 16px', background: '#fff', border: '1.5px solid #bbf7d0', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#166534', cursor: 'pointer' }}>
                Replace Images
              </button>
            </div>
          )}
        </div>*/}
      </div>
    );
  };

  // --- MAIN RENDER ---
  if (!hasTeam || isEditingTeam) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Wizard Header / Progress Bar */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginBottom: 20 }}>
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '100%', height: 4, background: '#f3f4f6', borderRadius: 10, zIndex: 0 }}></div>
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: 4, background: '#4C9F38', borderRadius: 10, zIndex: 0, transition: 'width 0.3s ease', width: `${(currentStep / (totalSteps - 1)) * 100}%` }}></div>

            {Array.from({ length: totalSteps }).map((_, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div key={idx} style={{
                  position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', fontWeight: 800, fontSize: 14, border: '3px solid', transition: 'all 0.3s ease',
                  background: isActive ? '#4C9F38' : isPast ? '#4C9F38' : '#fff',
                  borderColor: isActive ? '#4C9F38' : isPast ? '#4C9F38' : '#e5e7eb',
                  color: isActive || isPast ? '#fff' : '#9ca3af',
                  boxShadow: isActive ? '0 0 0 4px rgba(76,159,56,0.15)' : 'none'
                }}>
                  {isPast ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : idx + 1}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, color: '#111' }}>
            {currentStep === 0 && "Step 1: Team Setup"}
            {currentStep === 1 && "Step 2: Team Lead Details"}
            {currentStep > 1 && `Step ${currentStep + 1}: Teammate ${currentStep - 1} Details`}
          </div>
        </div>

        {/* Wizard Content */}
        <div style={styles.card}>

          {/* Step 1: Team Setup */}
          {currentStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minHeight: 300 }}>
              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ background: '#dbeafe', color: '#2563eb', padding: 8, borderRadius: 10, flexShrink: 0 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg></div>
                <div>
                  <h3 style={{ color: '#1e3a8a', fontWeight: 800, margin: '0 0 6px 0', fontSize: 15 }}>Registration Rules</h3>
                  <p style={{ color: '#1e40af', fontSize: 13, margin: 0, lineHeight: 1.5 }}>Only the Team Lead needs to register the team. Teams must consist of <strong>2 to 4 members</strong> in total (including the leader). Please establish your team size before proceeding.</p>
                </div>
              </div>

              <div>
                <label style={styles.label}>Team Name</label>
                <input type="text" value={formData.teamName} onChange={e => setFormData({ ...formData, teamName: e.target.value })} placeholder="e.g. Innovators, Team Nova" style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>Total Team Size</label>
                <select value={formData.teamSize} onChange={e => {
                  const newSize = parseInt(e.target.value);
                  const requiredTeammates = newSize - 1;
                  let newTeammates = [...formData.teammates];

                  if (newTeammates.length < requiredTeammates) {
                    for (let i = newTeammates.length; i < requiredTeammates; i++) {
                      newTeammates.push({ ...defaultMember });
                    }
                  } else if (newTeammates.length > requiredTeammates) {
                    newTeammates = newTeammates.slice(0, requiredTeammates);
                  }

                  setFormData(prev => ({ ...prev, teamSize: newSize, teammates: newTeammates }));
                }} style={{ ...styles.input, cursor: 'pointer' }}>
                  <option value={2}>2 Members (Lead + 1 Teammate)</option>
                  <option value={3}>3 Members (Lead + 2 Teammates)</option>
                  <option value={4}>4 Members (Lead + 3 Teammates)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Team Lead Details */}
          {currentStep === 1 && (
            <div style={{ minHeight: 300 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#111', margin: '0 0 4px 0' }}>Your Details (Team Lead)</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Please provide your contact and academic information.</p>
              </div>
              {renderMemberFields(formData.leader, true, null)}
            </div>
          )}

          {/* Step 3+: Teammate Details */}
          {currentStep > 1 && (
            <div style={{ minHeight: 300 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#111', margin: '0 0 4px 0' }}>Teammate {currentStep - 1} Details</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Provide the details for member {currentStep} of {formData.teamSize}.</p>
              </div>
              {renderMemberFields(formData.teammates[currentStep - 2], false, currentStep - 2)}
            </div>
          )}

          {errorMsg && (
            <div style={{ marginTop: 24, background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {errorMsg}
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1.5px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={handleBack} disabled={currentStep === 0 || creating} style={currentStep === 0 ? { ...styles.buttonBack, opacity: 0, cursor: 'default' } : styles.buttonBack}
              onMouseEnter={e => { if (currentStep !== 0 && !creating) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { if (currentStep !== 0 && !creating) e.currentTarget.style.background = '#fff'; }}>
              ← Back
            </button>

            {currentStep === totalSteps - 1 ? (
              <button type="button" onClick={handleSubmit} disabled={creating} style={creating ? styles.buttonDisabled : styles.buttonPrimary}
                onMouseEnter={e => { if (!creating) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { if (!creating) e.currentTarget.style.transform = 'translateY(0)'; }}>
                {creating ? 'Submitting...' : (isEditingTeam ? 'Update Team 🚀' : 'Submit Team 🚀')}
              </button>
            ) : (
              <button type="button" onClick={handleNext} style={styles.buttonSecondary}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Next Step →
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // --- SUMMARY VIEW (After Registration) ---
  const teamLeader = teamMembers.find(m => m.id === teamData.leader_id) || teamMembers.find(m => m.email === user.email);
  const leaderName = teamLeader?.full_name || 'Leader';
  const registeredDate = teamData.created_at ? new Date(teamData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  // const missingIdCardsCount = teamMembers.filter(m => !m.id_card_front_url || !m.id_card_back_url).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

      {/* ID Card warning banner - commented out
      {missingIdCardsCount > 0 && (
        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#92400e', marginBottom: 2 }}>Action Required: Upload ID Cards</div>
              <div style={{ fontSize: 13, color: '#b45309' }}>Please upload Front & Back Student ID cards for {missingIdCardsCount} team member{missingIdCardsCount > 1 ? 's' : ''} to complete verification.</div>
            </div>
          </div>
          <button 
                    onClick={() => {
                      setShowIdPopup(false);
                      startEditTeam(1);
                    }} 
                    style={{ flex: 1, padding: '12px', background: '#D97706', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Add ID Cards Now
                  </button>
        </div>
      )}
      */}

      {/* Top Banner */}
      <div style={{ ...styles.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(16,185,129,0.2)' }}>
            <Rocket size={36} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', margin: 0 }}>{teamData.team_name}</h2>
              <span style={{ fontSize: 11, fontWeight: 800, background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: 20 }}>Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={18} color="#6b7280" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111', lineHeight: 1 }}>{teamMembers.length}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginTop: 2 }}>Members</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Flag size={18} color="#6b7280" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', lineHeight: 1, marginBottom: 2 }}>Registered on</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{registeredDate}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ClipboardList size={18} color="#6b7280" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', lineHeight: 1, marginBottom: 2 }}>Team Lead</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{leaderName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, alignItems: 'stretch' }}>

        {/* Left Column: Team Members */}
        <div style={{ ...styles.card, height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: 0 }}>Team Members ({teamMembers.length})</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {teamMembers.map((m, idx) => {
              const isLeader = m.id === teamData.leader_id || m.email === user.email;
              return (
                <div key={m.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0', borderBottom: idx !== teamMembers.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0, background: isLeader ? '#10b981' : '#34d399' }}>
                    {m.full_name ? m.full_name[0].toUpperCase() : '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: isLeader ? '#dcfce7' : '#f0fdf4', color: isLeader ? '#166534' : '#15803d', marginBottom: 6 }}>
                      {isLeader ? 'Team Lead' : 'Member'}
                    </span>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                      {m.full_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                      {m.email}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                      📞 +91 {m.phone_number}
                    </div>

                    {/* ID Card Status - commented out
                      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600 }}>
                        {m.id_card_front_url && m.id_card_back_url ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16a34a' }}>
                            <Check size={14} /> ID Card Uploaded
                            {m.id_card_verified ? (
                              <span style={{ marginLeft: 8, padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: 10, fontSize: 10 }}></span>
                            ) : (
                              <span style={{ marginLeft: 8, padding: '2px 8px', background: '#fef9c3', color: '#854d0e', borderRadius: 10, fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}> </span>
                            )}
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d97706' }}>
                            <AlertCircle size={14} /> Missing ID
                          </span>
                        )}
                      </div>
                      */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Next Steps */}
        <div style={{ ...styles.card, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={16} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#111', margin: 0 }}>Next Step</h3>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Complete the steps below to move forward.</p>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 32, marginLeft: 10, paddingBottom: 10 }}>
            <div style={{ position: 'absolute', top: 16, bottom: 16, left: 15, width: 2, background: '#f3f4f6', zIndex: 0 }}></div>

            {[
              { num: 1, title: 'Open Statement', desc: 'Choose the problem statement you want to work on.' },
              { num: 2, title: 'Select SDG Goals', desc: 'Select one or more SDG goals related to your solution.' },
              { num: 3, title: 'Submit Your Next Big Idea', desc: 'Submit your next step to continue in the hackathon.' }
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '2px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                  {step.num}
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#111', marginBottom: 6 }}>{step.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{step.desc}</div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ color: '#10b981' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Submit your next step before</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>July 25, 2026</div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Card */}
      <div style={{ ...styles.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 4 }}>Ready to submit something?</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Go to submissions to upload your deliverables and track progress.</div>
          </div>
        </div>
        <button
          onClick={() => { if (setActiveTab) setActiveTab('submission'); }}
          style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#10b981', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#059669'}
          onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>
          Go to Submissions
        </button>
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

        {/* ID card popup - commented out
        {showIdPopup && !isEditingTeam && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIdPopup(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9998,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                cursor: 'pointer'
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px', pointerEvents: 'none'
              }}
            >
              <div style={{
                pointerEvents: 'auto',
                width: '100%', maxWidth: 450,
                background: '#fff', borderRadius: 24,
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif",
                textAlign: 'center', padding: '32px 24px'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🆔</div>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>Action Required: Upload ID Cards</h2>
                <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
                  Please upload Front & Back Student ID cards for all team members to complete verification before proceeding.
                </p>
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button onClick={() => setShowIdPopup(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Later</button>
                  <button 
                    onClick={() => {
                      setShowIdPopup(false);
                      startEditTeam(1);
                    }} 
                    style={{ flex: 1, padding: '12px', background: '#D97706', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Add ID Cards Now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
        */}
      </AnimatePresence>
    </div>
  );
}
