import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMilestones = (userId: string | undefined) => {
  const { toast } = useToast();

  const checkAndCongratulateFirstProduct = async () => {
    if (!userId) return;

    try {
      // Check if user has products and hasn't been congratulated yet
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_product_posted_congratulated')
        .eq('user_id', userId)
        .single();

      if (profile?.first_product_posted_congratulated) return;

      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', userId)
        .limit(1);

      if (products && products.length > 0) {
        // User has posted their first product
        await supabase
          .from('profiles')
          .update({ first_product_posted_congratulated: true })
          .eq('user_id', userId);

        toast({
          title: "🎉 Félicitations !",
          description: "Tu as posté ton premier article",
        });
      }
    } catch (error) {
      console.error('Error checking first product milestone:', error);
    }
  };

  const checkAndCongratulateFirstSale = async () => {
    if (!userId) return;

    try {
      // Check if user has completed sales and hasn't been congratulated yet
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_product_sold_congratulated')
        .eq('user_id', userId)
        .single();

      if (profile?.first_product_sold_congratulated) return;

      const { data: sales } = await supabase
        .from('transactions')
        .select('id')
        .eq('seller_id', userId)
        .eq('status', 'completed')
        .limit(1);

      if (sales && sales.length > 0) {
        // User has sold their first product
        await supabase
          .from('profiles')
          .update({ first_product_sold_congratulated: true })
          .eq('user_id', userId);

        toast({
          title: "🎉 Félicitations !",
          description: "Tu as vendu ton premier article",
        });
      }
    } catch (error) {
      console.error('Error checking first sale milestone:', error);
    }
  };

  const checkAndCongratulateFirstPurchase = async () => {
    if (!userId) return;

    try {
      // Check if user has completed purchases and hasn't been congratulated yet
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_product_bought_congratulated')
        .eq('user_id', userId)
        .single();

      if (profile?.first_product_bought_congratulated) return;

      const { data: purchases } = await supabase
        .from('transactions')
        .select('id')
        .eq('buyer_id', userId)
        .eq('status', 'completed')
        .limit(1);

      if (purchases && purchases.length > 0) {
        // User has bought their first product
        await supabase
          .from('profiles')
          .update({ first_product_bought_congratulated: true })
          .eq('user_id', userId);

        toast({
          title: "🎉 Félicitations !",
          description: "Tu as acheté ton premier article",
        });
      }
    } catch (error) {
      console.error('Error checking first purchase milestone:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      checkAndCongratulateFirstProduct();
      checkAndCongratulateFirstSale();
      checkAndCongratulateFirstPurchase();
    }
  }, [userId]);

  return {
    checkAndCongratulateFirstProduct,
    checkAndCongratulateFirstSale,
    checkAndCongratulateFirstPurchase,
  };
};