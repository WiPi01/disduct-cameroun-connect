import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput, type PasswordStrength } from "@/lib/security";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si nous avons les paramètres nécessaires pour la réinitialisation
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    console.log('Reset password params:', { accessToken, refreshToken, type });

    if (type === 'recovery' && accessToken && refreshToken) {
      // Définir la session avec les tokens de récupération
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error);
          toast({
            title: "Lien invalide",
            description: "Ce lien de réinitialisation est invalide ou a expiré.",
            variant: "destructive",
          });
          navigate('/');
        }
      });
    } else {
      // Pas de tokens valides, vérifier si on a un hash avec les tokens
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const hashAccessToken = params.get('access_token');
        const hashRefreshToken = params.get('refresh_token');
        const hashType = params.get('type');
        
        console.log('Hash params:', { hashAccessToken, hashRefreshToken, hashType });
        
        if (hashType === 'recovery' && hashAccessToken && hashRefreshToken) {
          supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          }).then(({ error }) => {
            if (error) {
              console.error('Error setting session from hash:', error);
              toast({
                title: "Lien invalide",
                description: "Ce lien de réinitialisation est invalide ou a expiré.",
                variant: "destructive",
              });
              navigate('/');
            }
          });
        } else {
          toast({
            title: "Lien invalide",
            description: "Ce lien de réinitialisation est invalide ou a expiré.",
            variant: "destructive",
          });
          navigate('/');
        }
      } else {
        toast({
          title: "Lien invalide",
          description: "Ce lien de réinitialisation est invalide ou a expiré.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [searchParams, navigate, toast]);

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength && !passwordStrength.isStrong) {
      toast({
        title: "Mot de passe trop faible",
        description: "Veuillez choisir un mot de passe plus fort",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Mot de passe mis à jour",
          description: "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
        });
        navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient-start to-gradient-end p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe sécurisé pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              showStrengthIndicator={true}
              onStrengthChange={setPasswordStrength}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handlePasswordReset}
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;