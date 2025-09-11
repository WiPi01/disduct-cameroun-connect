import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Phone, MapPin } from 'lucide-react';
import { useContactPermissions } from '@/hooks/useContactPermissions';

interface ContactPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  onPermissionGranted?: () => void;
}

export const ContactPermissionDialog = ({
  isOpen,
  onClose,
  sellerId,
  sellerName,
  onPermissionGranted,
}: ContactPermissionDialogProps) => {
  const { requestContactPermission, loading } = useContactPermissions();
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    const success = await requestContactPermission(sellerId);
    if (success) {
      setRequested(true);
      onPermissionGranted?.();
    }
  };

  const handleClose = () => {
    setRequested(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Demande d'accès aux coordonnées
          </DialogTitle>
          <DialogDescription>
            Pour protéger la vie privée des utilisateurs, les coordonnées ne sont pas visibles par défaut.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Vous demandez l'accès aux coordonnées de <strong>{sellerName}</strong>. 
              Cette personne recevra une notification et pourra choisir de partager ses informations de contact.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Numéro de téléphone</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Adresse</span>
            </div>
          </div>

          {requested && (
            <Alert>
              <AlertDescription className="text-green-600">
                ✓ Demande envoyée ! {sellerName} recevra une notification.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleRequest} 
            disabled={loading || requested}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Envoi...' : requested ? 'Demande envoyée' : 'Demander l\'accès'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};