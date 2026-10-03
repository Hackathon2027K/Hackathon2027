import React, { useEffect, useState } from 'react';
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EntryVideoPopup from './components/ui/EntryVideoPopup';

// Pages
import HomePage from './pages/HomePage';
import PrizesPage from './pages/PrizesPage';
import HighlightsPage from './pages/HighlightsPage';
import PartnersPage from './pages/PartnersPage';
import HumansPage from './pages/HumansPage';
import ContactSection from './pages/ContactSection';
import FaqSection from './pages/FaqSection';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTeams from './pages/admin/AdminTeams';
import AdminEvaluations from './pages/admin/AdminEvaluations';
import AdminEvaluateSubmission from './pages/admin/AdminEvaluateSubmission';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import LegalPage from './pages/LegalPage';

/**
 * ScrollToTop Component
 * Scrolls the window to (0,0) whenever the route pathname changes.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick for the new page to render, then scroll to the element
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Always scroll to top when navigating to a new page without a hash
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// Scroll-to-top FAB (Floating Action Button)
function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          style={{
            position: 'fixed', bottom: 32, right: 32,
            width: 44, height: 44, borderRadius: '50%',
            background: '#111', color: '#fff', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(0,0,0,0.18)', zIndex: 900,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#333'}
          onMouseLeave={e => e.currentTarget.style.background = '#111'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth page — standalone, no Navbar/Footer */}
        <Route path="/register" element={<AuthPage />} />

        {/* Dashboard — standalone, no Navbar/Footer */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin Dashboard */}
        <Route path="/udview" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="evaluations" element={<AdminEvaluations />} />
          <Route path="evaluations/:id" element={<AdminEvaluateSubmission />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
        </Route>

        {/* All other pages — with Navbar/Footer */}
        <Route path="/*" element={
          <div className="app" style={{ minHeight: '100vh' }}>
            <EntryVideoPopup />
            <ScrollToTopButton />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prizes" element={<PrizesPage />} />
              <Route path="/highlights" element={<HighlightsPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/humans" element={<HumansPage />} />
              <Route path="/faq" element={<FaqSection />} />
              <Route path="/contact" element={<ContactSection />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/privacy" element={<LegalPage />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
