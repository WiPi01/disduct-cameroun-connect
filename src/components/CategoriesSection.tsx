import { Smartphone, Shirt, Home, Wheat, Car, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: Smartphone,
    title: "Électronique",
    description: "Smartphones, ordinateurs, accessoires",
    count: "2,150+ produits",
    slug: "electronique",
  },
  {
    icon: Shirt,
    title: "Mode & Beauté",
    description: "Vêtements, chaussures, cosmétiques",
    count: "3,420+ produits",
    slug: "mode",
  },
  {
    icon: Home,
    title: "Maison & Jardin",
    description: "Meubles, décoration, électroménager",
    count: "1,890+ produits",
    slug: "maison",
  },
  {
    icon: Wheat,
    title: "Alimentation",
    description: "Produits frais, denrées alimentaires",
    count: "980+ produits",
    slug: "alimentation",
  },
  {
    icon: Car,
    title: "Automobile",
    description: "Véhicules, pièces détachées",
    count: "1,250+ produits",
    slug: "automobile",
  },
  {
    icon: Briefcase,
    title: "Services",
    description: "Services professionnels, formations",
    count: "750+ services",
    slug: "services",
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Explorez nos
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              catégories
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez une large gamme de produits et services adaptés aux
            besoins des Camerounais
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <category.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {category.description}
                </p>
                <span className="text-sm font-medium text-primary">
                  {category.count}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
