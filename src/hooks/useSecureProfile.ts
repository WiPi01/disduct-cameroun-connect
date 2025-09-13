import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecureProfile {
  user_id: string;
  display_name?: string;
  rating?: number;
  total_reviews?: number;
  avatar_url?: string;
  created_at?: string;
  // These fields are only populated if user has permission
  phone?: string | null;
  address?: string | null;
  can_view_contact?: boolean;
}

export const useSecureProfile = (userId: string) => {
  const [profile, setProfile] = useState<SecureProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSecureProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use the secure function to get profile data with proper permission checks
        const { data, error } = await supabase
          .rpc('get_secure_profile', { profile_user_id: userId });

        if (error) {
          console.error('Error fetching secure profile:', error);
          setError(error.message);
          return;
        }

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setProfile(data as unknown as SecureProfile);
        } else {
          setError('Invalid profile data received');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSecureProfile();
  }, [userId, user]);

  return { profile, loading, error };
};