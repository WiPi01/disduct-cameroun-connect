import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useMilestones } from "@/hooks/useMilestones";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("AuthProvider initializing...");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize milestones hook
  useMilestones(user?.id);

  useEffect(() => {
    console.log("AuthProvider useEffect running...");
    try {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email || "no user");
          // Update state immediately without setTimeout to prevent multiple triggers
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      // THEN check for existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("Initial session check:", session?.user?.email || "no user");
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch((error) => {
        console.error("Error getting session:", error);
        setLoading(false);
      });

      return () => {
        console.log("AuthProvider cleanup");
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Error in AuthProvider setup:", error);
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Erreur",
          description: "Impossible de se déconnecter. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes déconnecté",
      });
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  console.log("AuthProvider rendering with user:", user?.email || "no user");
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};