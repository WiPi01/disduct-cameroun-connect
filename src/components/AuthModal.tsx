import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput, isValidEmail, logSecurityEvent, type PasswordStrength } from "@/lib/security";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { toast } = useToast();


  const handleEmailAuth = async (isSignUp: boolean) => {
    // Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    
    if (!sanitizedEmail || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    // Password strength validation for signup
    if (isSignUp && passwordStrength && !passwordStrength.isStrong) {
      toast({
        title: "Mot de passe trop faible",
        description: "Veuillez choisir un mot de passe plus fort",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          logSecurityEvent('signup_failed', { 
            email: sanitizedEmail, 
            error: error.message 
          });
          
          // Handle specific error cases with user-friendly messages
          if (error.message === "User already registered") {
            toast({
              title: "Compte existant",
              description: "Un compte existe déjà avec cette adresse email. Essayez de vous connecter ou réinitialisez votre mot de passe.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          logSecurityEvent('signup_successful', { 
            email: sanitizedEmail 
          });
          toast({
            title: "Compte créé avec succès !",
            description: "Vous pouvez maintenant vous connecter avec vos identifiants.",
          });
          onClose();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password,
        });

        if (error) {
          logSecurityEvent('signin_failed', { 
            email: sanitizedEmail, 
            error: error.message 
          });
          
          // Handle specific error cases with user-friendly messages
          if (error.message === "Invalid login credentials") {
            toast({
              title: "Identifiants incorrects",
              description: "Vérifiez votre email et mot de passe. Assurez-vous que vos identifiants sont corrects.",
              variant: "destructive",
            });
          } else if (error.message === "Email not confirmed") {
            toast({
              title: "Email non confirmé",
              description: "Veuillez vérifier votre boîte email et cliquer sur le lien de confirmation.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erreur de connexion",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          logSecurityEvent('signin_successful', { 
            email: sanitizedEmail 
          });
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur Disduct !",
          });
          onClose();
          // Rediriger vers la page des produits après connexion
          window.location.href = '/produits';
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    
    if (!sanitizedEmail) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Utiliser l'URL Lovable au lieu de localhost pour la redirection
      const redirectUrl = window.location.hostname.includes('lovable.dev') 
        ? window.location.origin 
        : 'https://d4b23701-0cdd-44c5-9a20-463817d2a46e.sandbox.lovable.dev';
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${redirectUrl}/`,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email envoyé",
          description: "Vérifiez votre boîte email pour réinitialiser votre mot de passe.",
        });
        setShowResetPassword(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Rejoignez Disduct
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">S'inscrire</TabsTrigger>
            <TabsTrigger value="login">Se connecter</TabsTrigger>
          </TabsList>


          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Mot de passe</Label>
              <PasswordInput
                id="signup-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                showStrengthIndicator={true}
                onStrengthChange={setPasswordStrength}
              />
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => handleEmailAuth(true)}
              disabled={isLoading}
            >
              {isLoading ? "Création..." : "Créer mon compte"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              En vous inscrivant, vous acceptez nos conditions d'utilisation et
              notre politique de confidentialité.
            </p>
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Mot de passe</Label>
              <PasswordInput
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => handleEmailAuth(false)}
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              <button 
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </p>
          </TabsContent>
        </Tabs>

        {showResetPassword && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-center">Réinitialiser le mot de passe</h3>
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowResetPassword(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                className="w-full"
                onClick={handlePasswordReset}
                disabled={isLoading}
              >
                {isLoading ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
