import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Conversation {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  products?: {
    title: string;
    price: number;
    images: string[] | null;
  };
  profiles?: {
    display_name: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const createConversation = async (productId: string, sellerId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      setLoading(true);

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .maybeSingle();

      if (existingConversation) {
        return existingConversation.id;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          product_id: productId,
          buyer_id: user.id,
          seller_id: sellerId,
          status: 'active'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        toast.error('Erreur lors de la création de la conversation');
        return null;
      }

      toast.success('Conversation créée avec succès');
      return data.id;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur s\'est produite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (conversationId: string, content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content,
          message_type: 'text'
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Erreur lors de l\'envoi du message');
        return false;
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur s\'est produite');
      return false;
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          products (title, price, images)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Erreur lors de la récupération des conversations');
        return;
      }

      console.log('Conversations fetched:', data);
      setConversations(data as Conversation[] || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Erreur lors de la récupération des messages');
        return;
      }

      console.log('Messages fetched for conversation:', conversationId, data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur s\'est produite');
    }
  };

  // Écouter les mises à jour en temps réel
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-realtime')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        (payload) => {
          console.log('New message received:', payload);
          fetchConversations();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'conversations' 
        }, 
        (payload) => {
          console.log('New conversation created:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    createConversation,
    sendMessage,
    fetchConversations,
    fetchMessages
  };
};