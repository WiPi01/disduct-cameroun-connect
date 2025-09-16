import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logSecurityEvent } from '@/lib/security';

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

        // Log profile access attempt for security monitoring
        logSecurityEvent('secure_profile_access_attempt', { 
          targetUserId: userId,
          accessType: 'useSecureProfile_hook'
        });

        // Use the secure function to get profile data with proper permission checks
        const { data, error } = await supabase
          .rpc('get_secure_profile', { profile_user_id: userId });

        if (error) {
          console.error('Error fetching secure profile:', error);
          logSecurityEvent('secure_profile_access_error', { 
            targetUserId: userId,
            error: error.message 
          });
          setError(error.message);
          return;
        }

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setProfile(data as unknown as SecureProfile);
          logSecurityEvent('secure_profile_access_success', { 
            targetUserId: userId,
            hasContactPermission: (data as any).can_view_contact,
            dataFields: Object.keys(data)
          });
        } else {
          logSecurityEvent('secure_profile_invalid_data', { 
            targetUserId: userId,
            receivedData: typeof data
          });
          setError('Invalid profile data received');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        logSecurityEvent('secure_profile_unexpected_error', { 
          targetUserId: userId,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSecureProfile();
  }, [userId, user]);

  return { profile, loading, error };
};