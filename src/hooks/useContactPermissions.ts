import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { rateLimiter, logSecurityEvent } from '@/lib/security';

export interface ContactPermission {
  id: string;
  owner_id: string;
  requester_id: string;
  granted_at: string;
  expires_at?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useContactPermissions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const requestContactPermission = async (ownerId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Client-side rate limiting (UX improvement - server-side enforcement is in DB trigger)
    const rateLimitKey = `contact_request_${user.id}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 5, 15 * 60 * 1000)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(rateLimitKey, 15 * 60 * 1000) / 60000);
      toast.error(`Trop de demandes. Réessayez dans ${remainingTime} minutes.`);
      logSecurityEvent('contact_permission_rate_limited', { 
        userId: user.id, 
        targetUserId: ownerId,
        remainingTime 
      });
      return false;
    }
    
    setLoading(true);
    try {
      // Insert with 'pending' status - owner must approve
      const { error } = await supabase
        .from('contact_sharing_permissions')
        .insert({
          owner_id: ownerId,
          requester_id: user.id,
          status: 'pending'  // Requires owner approval
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('Demande déjà envoyée');
          logSecurityEvent('contact_permission_duplicate_request', { 
            userId: user.id, 
            targetUserId: ownerId 
          });
          return true;
        }
        if (error.message?.includes('Rate limit exceeded')) {
          toast.error('Trop de demandes. Réessayez plus tard.');
          return false;
        }
        if (error.message?.includes('no_self_request')) {
          toast.error('Vous ne pouvez pas demander vos propres coordonnées');
          return false;
        }
        throw error;
      }

      logSecurityEvent('contact_permission_requested', { 
        userId: user.id, 
        targetUserId: ownerId 
      });
      toast.success('Demande envoyée. En attente d\'approbation.');
      return true;
    } catch (error) {
      console.error('Error requesting contact permission:', error);
      toast.error('Erreur lors de la demande de contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approveContactPermission = async (permissionId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Update status from 'pending' to 'approved' (only owner can do this via RLS)
      const { error } = await supabase
        .from('contact_sharing_permissions')
        .update({ status: 'approved' })
        .eq('id', permissionId)
        .eq('owner_id', user.id); // Enforce owner check client-side too

      if (error) throw error;

      logSecurityEvent('contact_permission_approved', { 
        userId: user.id,
        permissionId 
      });
      toast.success('Permission de contact accordée');
      return true;
    } catch (error) {
      console.error('Error approving contact permission:', error);
      toast.error('Erreur lors de l\'approbation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectContactPermission = async (permissionId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Update status from 'pending' to 'rejected'
      const { error } = await supabase
        .from('contact_sharing_permissions')
        .update({ status: 'rejected' })
        .eq('id', permissionId)
        .eq('owner_id', user.id);

      if (error) throw error;

      logSecurityEvent('contact_permission_rejected', { 
        userId: user.id,
        permissionId 
      });
      toast.success('Demande refusée');
      return true;
    } catch (error) {
      console.error('Error rejecting contact permission:', error);
      toast.error('Erreur lors du refus');
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
        .select('id, status')
        .eq('owner_id', ownerId)
        .eq('requester_id', user.id)
        .eq('status', 'approved')  // Only approved permissions count
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
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ContactPermission[];
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      return [];
    }
  };

  const getPendingRequests = async (): Promise<ContactPermission[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('contact_sharing_permissions')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ContactPermission[];
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  };

  return {
    loading,
    requestContactPermission,
    approveContactPermission,
    rejectContactPermission,
    revokeContactPermission,
    checkContactPermission,
    getMyContactRequests,
    getPendingRequests,
  };
};