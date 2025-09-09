import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bug, MessageSquare, Lightbulb, AlertTriangle } from "lucide-react";
import MobileNavBar from "@/components/MobileNavBar";

const SignalerProbleme = () => {
  const [formData, setFormData] = useState({
    type: "",
    nom: "",
    email: "",
    sujet: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi - remplacer par l'intégration réelle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Rapport envoyé avec succès",
      description:
        "Merci pour votre retour. Notre équipe examine votre signalement.",
    });

    // Réinitialiser le formulaire
    setFormData({
      type: "",
      nom: "",
      email: "",
      sujet: "",
      description: "",
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const problemTypes = [
    {
      value: "bug",
      label: "Bug technique",
      icon: Bug,
      description: "Un problème de fonctionnement sur la plateforme",
    },
    {
      value: "probleme",
      label: "Problème utilisateur",
      icon: AlertTriangle,
      description: "Un problème lié à l'utilisation du service",
    },
    {
      value: "avis",
      label: "Avis/Commentaire",
      icon: MessageSquare,
      description: "Votre opinion sur nos services",
    },
    {
      value: "suggestion",
      label: "Suggestion d'amélioration",
      icon: Lightbulb,
      description: "Une idée pour améliorer disduct",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Signaler un Problème" />
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Signaler un Problème
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Votre retour est précieux pour nous. Signalez un bug, partagez
              votre avis ou suggérez des améliorations pour rendre disduct
              encore meilleur.
            </p>
          </div>

          {/* Types de problèmes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {problemTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.type === type.value ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleInputChange("type", type.value)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">
                      {type.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Formulaire */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du signalement</CardTitle>
              <CardDescription>
                Veuillez remplir les informations ci-dessous pour nous aider à
                mieux comprendre votre signalement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type de problème */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type de signalement *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de signalement" />
                    </SelectTrigger>
                    <SelectContent>
                      {problemTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Informations de contact */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="votre.email@exemple.com"
                      required
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div className="space-y-2">
                  <Label htmlFor="sujet">Sujet *</Label>
                  <Input
                    id="sujet"
                    type="text"
                    value={formData.sujet}
                    onChange={(e) => handleInputChange("sujet", e.target.value)}
                    placeholder="Résumé en quelques mots de votre signalement"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Décrivez en détail le problème rencontré, votre avis ou votre suggestion..."
                    rows={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Plus vous nous donnez de détails, plus nous pourrons vous
                    aider efficacement.
                  </p>
                </div>

                {/* Conseils selon le type */}
                {formData.type === "bug" && (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      💡 Conseils pour signaler un bug
                    </h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Décrivez les étapes pour reproduire le problème</li>
                      <li>• Mentionnez votre navigateur et appareil utilisé</li>
                      <li>• Indiquez quand le problème est survenu</li>
                      <li>• Joignez une capture d'écran si possible</li>
                    </ul>
                  </div>
                )}

                {formData.type === "suggestion" && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      💡 Conseils pour une suggestion
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Expliquez clairement votre idée</li>
                      <li>
                        • Décrivez comment cela améliorerait votre expérience
                      </li>
                      <li>
                        • Mentionnez si vous avez vu cette fonctionnalité
                        ailleurs
                      </li>
                    </ul>
                  </div>
                )}

                {/* Bouton de soumission */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.type ||
                      !formData.nom ||
                      !formData.email ||
                      !formData.sujet ||
                      !formData.description
                    }
                    className="px-8"
                  >
                    {isSubmitting
                      ? "Envoi en cours..."
                      : "Envoyer le signalement"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Besoin d'une assistance immédiate ?
            </h3>
            <p className="text-muted-foreground mb-4">
              Pour les problèmes urgents, vous pouvez nous contacter directement
              :
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:support@disduct.com"
                className="text-primary hover:underline font-medium"
              >
                support@disduct.com
              </a>
              <a
                href="tel:+237697392803"
                className="text-primary hover:underline font-medium"
              >
                +237 697392803
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignalerProbleme;
