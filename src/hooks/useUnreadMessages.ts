import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        // Get all conversations for this user
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('id, updated_at')
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (convError) {
          console.error('Error fetching conversations:', convError);
          return;
        }

        if (!conversations || conversations.length === 0) {
          setUnreadCount(0);
          return;
        }

        // For each conversation, get the last message and check if it's from the other user
        let totalUnread = 0;
        
        for (const conv of conversations) {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('sender_id, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // If last message is from the other user (not from current user), count as unread
          if (lastMessage && lastMessage.sender_id !== user.id) {
            totalUnread++;
          }
        }

        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error in fetchUnreadCount:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // If the new message is not from current user, refresh count
          if (payload.new.sender_id !== user.id) {
            fetchUnreadCount();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return unreadCount;
};
