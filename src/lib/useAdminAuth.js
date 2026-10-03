import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

/**
 * Shared hook for admin route protection.
 *
 * Checks:
 *  1. Is there a logged-in Supabase auth user?
 *  2. Does user.email exist in public.admins?
 *
 * Returns { isAdmin, loadingAuth, adminEmail }
 */
export function useAdminAuth() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  const checkAuth = useCallback(async () => {
    setLoadingAuth(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/register');
        return;
      }

      setAdminEmail(user.email);

      // Check if THIS user's email is in public.admins
      const { data: adminRow, error: adminErr } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .maybeSingle();

      if (adminErr) {
        // Common cause: RLS infinite recursion on admins table.
        // Fix: Run in Supabase SQL Editor:
        //   ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
        console.error('Admin check error:', adminErr.message, '— If this says "infinite recursion", disable RLS on public.admins table.');
        navigate('/dashboard');
        return;
      }

      if (!adminRow) {
        // User is logged in but NOT an admin
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
    } finally {
      setLoadingAuth(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAdmin, loadingAuth, adminEmail };
}
