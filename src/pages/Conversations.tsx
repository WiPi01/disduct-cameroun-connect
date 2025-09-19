import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations, Conversation, Message } from '@/hooks/useConversations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Conversations = () => {
  const { user } = useAuth();
  const { conversations, messages, loading, fetchConversations, fetchMessages, sendMessage } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    const success = await sendMessage(selectedConversation, newMessage.trim());
    
    if (success) {
      setNewMessage('');
      // Refresh messages
      fetchMessages(selectedConversation);
    }
    setSendingMessage(false);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (user?.id === conversation.buyer_id) {
      return {
        id: conversation.seller_id,
        role: 'vendeur'
      };
    } else {
      return {
        id: conversation.buyer_id,
        role: 'acheteur'
      };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
              <p className="text-muted-foreground">Vous devez être connecté pour voir vos conversations.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mes Conversations</h1>
          <p className="text-muted-foreground">Gérez vos discussions avec les vendeurs et acheteurs</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <Card className="lg:w-1/3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Mes Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Chargement...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune conversation
                  </div>
                ) : (
                  <div className="space-y-0">
                    {conversations.map((conversation) => {
                      const otherParticipant = getOtherParticipant(conversation);
                      const isSelected = selectedConversation === conversation.id;
                      
                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                            isSelected ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {otherParticipant.role === 'vendeur' ? 'V' : 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">
                                  {conversation.products?.title}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {otherParticipant.role}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {formatPrice(conversation.products?.price || 0)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(conversation.updated_at), 'dd MMM yyyy', { locale: fr })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Zone de chat */}
          <Card className="flex-1">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      {(() => {
                        const conversation = conversations.find(c => c.id === selectedConversation);
                        if (!conversation) return null;
                        const otherParticipant = getOtherParticipant(conversation);
                        
                        return (
                          <div>
                            <h2 className="font-semibold">{conversation.products?.title}</h2>
                            <p className="text-sm text-muted-foreground">
                              Conversation avec le {otherParticipant.role}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-col h-[400px] p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwn = message.sender_id === user.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                                isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {format(new Date(message.created_at), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  
                  <Separator />
                  
                  {/* Input de nouveau message */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={sendingMessage}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                  <p className="text-muted-foreground">
                    Choisissez une conversation pour commencer à chatter
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Conversations;