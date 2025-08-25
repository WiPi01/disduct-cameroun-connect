import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}

type View = "signup" | "login" | "forgot_password";

const AuthModal = ({
  isOpen,
  onClose,
  initialView = "signup",
}: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>(initialView);
  const { toast } = useToast();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    } else {
      setEmail("");
      setPassword("");
      setIsLoading(false);
    }
  }, [isOpen, initialView]);

  const safeSetIsLoading = (loading: boolean) => {
    if (isMountedRef.current) {
      setIsLoading(loading);
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

  const handleGoogleAuth = async () => {
    safeSetIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      safeSetIsLoading(false);
    }
  };

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      return toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
    }

    safeSetIsLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) {
        const errorMessage = getAuthErrorMessage(error.message);
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive",
        });
        if (isSignUp && error.message.includes("User already registered")) {
          setView("login");
        }
      } else {
        toast({
          title: isSignUp ? "Compte créé" : "Connexion réussie",
          description: isSignUp
            ? "Vérifiez votre email pour confirmer votre compte."
            : "Bienvenue sur Disduct !",
        });
        onClose();
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      safeSetIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      return toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse e-mail",
        variant: "destructive",
      });
    }

    safeSetIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Email envoyé",
          description: "Consultez votre boîte de réception pour réinitialiser votre mot de passe.",
        });
        setView("login");
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      safeSetIsLoading(false);
    }
  };

  const renderAuthFields = (isSignUp: boolean) => (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={() => handleEmailAuth(isSignUp)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isSignUp ? (
          "Créer mon compte"
        ) : (
          "Se connecter"
        )}
      </Button>
      {!isSignUp && (
        <p className="text-sm text-center text-muted-foreground">
          <a
            href="#"
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setView("forgot_password");
            }}
          >
            Mot de passe oublié ?
          </a>
        </p>
      )}
    </>
  );

  const renderForgotPassword = () => (
    <div className="space-y-4 pt-4">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold">Mot de passe oublié</DialogTitle>
        <DialogDescription className="text-center">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </DialogDescription>
      </DialogHeader>
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
      <Button className="w-full" size="lg" onClick={handlePasswordReset} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Envoyer le lien"}
      </Button>
      <Button variant="link" className="w-full" onClick={() => setView("login")} disabled={isLoading}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md space-y-4">
        {view !== "forgot_password" && (
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {view === "login" ? "Connexion" : "Inscription"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {view === "login"
                ? "Connectez-vous à votre compte"
                : "Créez un compte pour commencer"}
            </DialogDescription>
          </DialogHeader>
        )}

        {view === "login" && renderAuthFields(false)}
        {view === "signup" && renderAuthFields(true)}
        {view === "forgot_password" && renderForgotPassword()}

        {(view === "login" || view === "signup") && (
          <>
            <Separator />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              Continuer avec Google
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              {view === "login" ? (
                <>
                  Pas encore inscrit ?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setView("signup");
                    }}
                    className="text-primary hover:underline"
                  >
                    Créer un compte
                  </a>
                </>
              ) : (
                <>
                  Vous avez déjà un compte ?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setView("login");
                    }}
                    className="text-primary hover:underline"
                  >
                    Se connecter
                  </a>
                </>
              )}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
