import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ShareButton = ({ url, title, description, variant = "outline", size = "sm" }: ShareButtonProps) => {
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  const shareText = description ? `${title} - ${description}` : title;

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedText}&body=${encodedUrl}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(fullUrl);
          toast.success("Lien copié dans le presse-papier");
          return;
        } catch (err) {
          toast.error("Erreur lors de la copie du lien");
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Partager</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Partager...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
