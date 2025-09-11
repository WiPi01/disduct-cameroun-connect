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
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        } else {
          logSecurityEvent('signup_successful', { 
            email: sanitizedEmail 
          });
          toast({
            title: "Compte créé",
            description: "Vérifiez votre email pour confirmer votre compte",
          });
          onClose();
          // Rediriger vers la page des produits après création de compte
          window.location.href = '/produits';
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
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
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
              <a href="#" className="text-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
