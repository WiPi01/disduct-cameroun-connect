import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewModalProps {
  images: string[];
  initialIndex?: number;
  trigger: React.ReactNode;
}

export const ImageViewModal = ({ images, initialIndex = 0, trigger }: ImageViewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isOpen, setIsOpen] = useState(false);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://rtvsinrxboyamtrglciz.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const filteredImages = images.filter(img => !img.includes('placeholder') && !img.includes('/placeholder'));

  if (filteredImages.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {filteredImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <img
            src={getImageUrl(filteredImages[currentIndex])}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f1f5f9"/><text x="200" y="200" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="16" fill="%236b7280">Image non disponible</text></svg>';
            }}
          />

          {filteredImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {filteredImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};