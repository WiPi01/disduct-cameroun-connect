import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ContactSellerDialogProps {
  productId: string;
  sellerId: string;
  sellerName: string;
  productTitle: string;
  triggerClassName?: string;
}

export const ContactSellerDialog = ({ 
  productId, 
  sellerId, 
  sellerName, 
  productTitle,
  triggerClassName = "w-full"
}: ContactSellerDialogProps) => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { createConversation, sendMessage, loading } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      // Create conversation
      const conversationId = await createConversation(productId, sellerId);
      
      if (conversationId) {
        // Send initial message
        const success = await sendMessage(conversationId, message);
        
        if (success) {
          setMessage('');
          setIsOpen(false);
          // Navigate to conversations page (to be created)
          navigate('/conversations');
        }
      }
    } catch (error) {
      console.error('Error contacting seller:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName} variant="default">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contacter le vendeur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contacter {sellerName}</DialogTitle>
          <DialogDescription>
            Envoyez un message concernant "{productTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Tapez votre message ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleContactSeller}
              disabled={!message.trim() || loading}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};