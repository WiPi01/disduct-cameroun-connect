
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

type View = 'signup' | 'login' | 'forgot_password';

const AuthModal = ({ isOpen, onClose, initialView = 'signup' }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>(initialView);
  const [authSuccess, setAuthSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authSuccess) {
      onClose();
    }
  }, [authSuccess, onClose]);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setAuthSuccess(false); // Reset on open
    } else {
      // Reset fields when modal is closed
      setEmail("");
      setPassword("");
    }
  }, [isOpen, initialView]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const getAuthErrorMessage = (message: string): string => {
    if (message.includes("Invalid login credentials")) {
      return "Email ou mot de passe incorrect.";
    }
    if (message.includes("User already registered")) {
      return "Un compte existe déjà avec cet email.";
    }
    if (message.includes("Email address") && message.includes("invalid")) {
      return "L'adresse email n'est pas valide.";
    }
    if (message.includes("Password should be at least 6 characters")) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    return "Une erreur est survenue. Veuillez réessayer.";
  };

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      return toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return toast({ title: "Erreur", description: "Veuillez entrer une adresse email valide.", variant: "destructive" });
    }

    setIsLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erreur d'authentification",
        description: getAuthErrorMessage(error.message),
        variant: "destructive",
      });
    } else {
      toast({
        title: isSignUp ? "Compte créé" : "Connexion réussie",
        description: isSignUp ? "Vérifiez votre email pour confirmer votre compte." : "Bienvenue sur Disduct !",
      });
      setAuthSuccess(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      return toast({ title: "Erreur", description: "Veuillez entrer votre adresse e-mail", variant: "destructive" });
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email envoyé", description: "Consultez votre boîte de réception pour réinitialiser votre mot de passe." });
      setView('login');
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (view === 'forgot_password') {
      return (
        <div className="space-y-4 pt-4">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Mot de passe oublié</DialogTitle>
            <DialogDescription className="text-center">Entrez votre email pour recevoir un lien de réinitialisation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input id="reset-email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <Button className="w-full" size="lg" onClick={handlePasswordReset} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Envoyer le lien"}
          </Button>
          <Button variant="link" className="w-full" onClick={() => setView('login')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
          </Button>
        </div>
      );
    }

    return (
      <Tabs value={view} onValueChange={(v) => setView(v as View)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">S'inscrire</TabsTrigger>
          <TabsTrigger value="login">Se connecter</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleAuth} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuer avec Google
              </>
            )}
          </Button>
          <div className="relative my-4"><Separator /><div className="absolute inset-0 flex items-center justify-center"><span className="bg-background px-2 text-muted-foreground text-sm">ou</span></div></div>
        </div>
        
        <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Mot de passe</Label>
              <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
            </div>
            <Button className="w-full" size="lg" onClick={() => handleEmailAuth(true)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer mon compte"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">En vous inscrivant, vous acceptez nos conditions d'utilisation.</p>
        </TabsContent>
        
        <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Mot de passe</Label>
              <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
            </div>
            <Button className="w-full" size="lg" onClick={() => handleEmailAuth(false)} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Se connecter"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); setView('forgot_password'); }}>
                Mot de passe oublié ?
              </a>
            </p>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {view !== 'forgot_password' && (
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">Rejoignez Disduct</DialogTitle>
          </DialogHeader>
        )}
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
