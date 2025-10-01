import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MobileNavBar from "@/components/MobileNavBar";

const formSchema = z.object({
  preferredCategories: z.array(z.string()).min(1, "Veuillez sélectionner au moins une catégorie"),
  monthlyBudget: z.string().min(1, "Veuillez sélectionner votre budget mensuel"),
  acquisitionType: z.string().min(1, "Veuillez sélectionner votre type d'acquisition préféré"),
  paymentMethod: z.string().min(1, "Veuillez sélectionner votre moyen de paiement privilégié"),
});

type FormData = z.infer<typeof formSchema>;

const ProfilAcheteur = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Électronique",
    "Mode et Vêtements", 
    "Maison et Jardin",
    "Santé et Beauté",
    "Sport et Loisirs",
    "Automobile",
    "Alimentation",
    "Livres et Médias",
    "Jouets et Enfants",
    "Services",
  ];

  const budgetRanges = [
    { value: "5000-20000", label: "5 000 - 20 000 FCFA" },
    { value: "20000-50000", label: "20 000 - 50 000 FCFA" },
    { value: "50000-100000", label: "50 000 - 100 000 FCFA" },
    { value: "100000+", label: "Supérieur à 100 000 FCFA" },
  ];

  const acquisitionTypes = [
    { value: "delivery", label: "Livraison" },
    { value: "pickup", label: "En boutique" },
  ];

  const paymentMethods = [
    { value: "mobile_money", label: "Mobile Money (OM/MOMO)" },
    { value: "cash", label: "Espèces" },
    { value: "bank_transfer", label: "Virement bancaire" },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredCategories: [],
      monthlyBudget: "",
      acquisitionType: "",
      paymentMethod: "",
    },
  });

  // Charger les préférences existantes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('buyer_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        form.reset({
          preferredCategories: data.preferred_categories || [],
          monthlyBudget: data.monthly_budget || "",
          acquisitionType: data.acquisition_type || "",
          paymentMethod: data.payment_method || "",
        });
      }
    };
    
    loadPreferences();
  }, [user, form]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('buyer_preferences')
        .upsert({
          user_id: user.id,
          preferred_categories: data.preferredCategories,
          monthly_budget: data.monthlyBudget,
          acquisition_type: data.acquisitionType,
          payment_method: data.paymentMethod,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Préférences enregistrées",
        description: "Nous avons bien pris en compte vos préférences d'achats, veuillez retourner sur la page \"Comment acheter\", et pour commencer à consulter les produits ou services dont vous avez besoin, cliquez sur \"Commencer à acheter\" en bas de cette page.",
        duration: 10000,
      });
    } catch (error) {
      console.error('Error saving buyer preferences:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Profil Acheteur" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Configuration de votre profil acheteur
          </h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience d'achat en configurant vos préférences.
          </p>
        </div>

        {/* Message d'information */}
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            Choisissez vos préférences en toute objectivité. Le but est de vous proposer des produits et services qui matchent avec vos préférences d'achats, vos besoins et votre budget.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Vos préférences d'achat</CardTitle>
            <CardDescription>
              Ces informations nous aideront à personnaliser votre expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Catégories préférées */}
                <FormField
                  control={form.control}
                  name="preferredCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégories d'articles préférées</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={field.value?.includes(category)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, category])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== category)
                                      );
                                }}
                              />
                              <label
                                htmlFor={category}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Budget mensuel */}
                <FormField
                  control={form.control}
                  name="monthlyBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget mensuel de dépenses</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre budget mensuel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type d'acquisition */}
                <FormField
                  control={form.control}
                  name="acquisitionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type préféré d'acquisition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre préférence" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {acquisitionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Moyen de paiement */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moyen de paiement privilégié</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre méthode préférée" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer mes préférences"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilAcheteur;