
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  ArrowRight } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];

const LatestProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching latest products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchLatestProducts();
  }, []);

  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col cursor-pointer overflow-hidden"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="relative overflow-hidden aspect-square bg-muted">
          <img 
            src={product.images?.[0] || '/placeholder.svg'} 
            alt={product.title || 'Image du produit'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 flex-grow">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-primary">
            {product.price ? `${product.price.toLocaleString()} FCFA` : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nos derniers articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}><div className="aspect-square bg-muted animate-pulse rounded-lg"></div></Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if there are no products
  }

  return (
    <section className="bg-muted/30 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Nos derniers articles</h2>
          <Button variant="ghost" onClick={() => navigate('/search')}>
            Voir plus
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
