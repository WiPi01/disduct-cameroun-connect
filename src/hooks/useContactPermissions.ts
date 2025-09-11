import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ContactPermission {
  id: string;
  owner_id: string;
  requester_id: string;
  granted_at: string;
  expires_at?: string;
  created_at: string;
}

export const useContactPermissions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const requestContactPermission = async (ownerId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_sharing_permissions')
        .insert({
          owner_id: ownerId,
          requester_id: user.id,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('Demande déjà envoyée');
          return true;
        }
        throw error;
      }

      toast.success('Demande de contact envoyée');
      return true;
    } catch (error) {
      console.error('Error requesting contact permission:', error);
      toast.error('Erreur lors de la demande de contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const grantContactPermission = async (requesterId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_sharing_permissions')
        .insert({
          owner_id: user.id,
          requester_id: requesterId,
        });

      if (error) {
        if (error.code === '23505') { // Already exists
          toast.info('Permission déjà accordée');
          return true;
        }
        throw error;
      }

      toast.success('Permission de contact accordée');
      return true;
    } catch (error) {
      console.error('Error granting contact permission:', error);
      toast.error('Erreur lors de l\'octroi de la permission');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const revokeContactPermission = async (requesterId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_sharing_permissions')
        .delete()
        .eq('owner_id', user.id)
        .eq('requester_id', requesterId);

      if (error) throw error;

      toast.success('Permission de contact révoquée');
      return true;
    } catch (error) {
      console.error('Error revoking contact permission:', error);
      toast.error('Erreur lors de la révocation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkContactPermission = async (ownerId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('contact_sharing_permissions')
        .select('id')
        .eq('owner_id', ownerId)
        .eq('requester_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking contact permission:', error);
      return false;
    }
  };

  const getMyContactRequests = async (): Promise<ContactPermission[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('contact_sharing_permissions')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      return [];
    }
  };

  return {
    loading,
    requestContactPermission,
    grantContactPermission,
    revokeContactPermission,
    checkContactPermission,
    getMyContactRequests,
  };
};