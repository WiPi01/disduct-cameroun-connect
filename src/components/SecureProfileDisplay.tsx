import { useState, useEffect } from 'react';
import { Shield, Phone, MapPin, Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContactPermissions } from '@/hooks/useContactPermissions';
import { ContactPermissionDialog } from './ContactPermissionDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureProfile } from '@/hooks/useSecureProfile';


interface SecureProfileDisplayProps {
  userId: string; // Change to just take user ID and fetch secure data
  showContactButton?: boolean;
  compact?: boolean;
}

export const SecureProfileDisplay = ({ 
  userId, 
  showContactButton = true, 
  compact = false 
}: SecureProfileDisplayProps) => {
  const { user } = useAuth();
  const { checkContactPermission } = useContactPermissions();
  const { profile, loading, error } = useSecureProfile(userId);
  const [hasContactPermission, setHasContactPermission] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (!profile) return;

    if (isOwnProfile) {
      setHasContactPermission(true);
      setShowSensitiveInfo(true); // Always show own info
      return;
    }

    // Check if we already have contact permission info from the secure profile
    if (profile.can_view_contact !== undefined) {
      setHasContactPermission(profile.can_view_contact);
      return;
    }

    // Fallback to manual permission check
    const checkPermission = async () => {
      const hasPermission = await checkContactPermission(userId);
      setHasContactPermission(hasPermission);
    };

    if (user) {
      checkPermission();
    }
  }, [profile, user, isOwnProfile, userId, checkContactPermission]);

  const handleRequestContact = () => {
    setShowPermissionDialog(true);
  };

  const handlePermissionGranted = () => {
    setHasContactPermission(true);
    setShowPermissionDialog(false);
  };

  const toggleSensitiveInfo = () => {
    setShowSensitiveInfo(!showSensitiveInfo);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement du profil...</div>;
  }

  if (error || !profile) {
    return <div className="text-sm text-destructive">Erreur lors du chargement du profil</div>;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="font-medium">{profile.display_name || 'Utilisateur'}</div>
          {profile.rating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              <span>{profile.rating}</span>
              <span>({profile.total_reviews} avis)</span>
            </div>
          )}
        </div>
        {showContactButton && !isOwnProfile && (
          <Button
            size="sm"
            variant={hasContactPermission ? "default" : "outline"}
            onClick={hasContactPermission ? toggleSensitiveInfo : handleRequestContact}
          >
            {hasContactPermission ? (
              showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
          </Button>
        )}
        <ContactPermissionDialog
          isOpen={showPermissionDialog}
          onClose={() => setShowPermissionDialog(false)}
          sellerId={userId}
          sellerName={profile.display_name || 'Utilisateur'}
          onPermissionGranted={handlePermissionGranted}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Basic Profile Info - Always Visible */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{profile.display_name || 'Utilisateur'}</h3>
              {profile.rating !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="text-sm font-medium">{profile.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({profile.total_reviews} avis)
                  </span>
                </div>
              )}
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Profil vérifié
            </Badge>
          </div>

          {/* Contact Information - Conditionally Visible */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Informations de contact</h4>
              {hasContactPermission && !isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleSensitiveInfo}
                  className="h-auto p-1"
                >
                  {showSensitiveInfo ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            {(isOwnProfile || (hasContactPermission && showSensitiveInfo)) ? (
              <div className="space-y-2">
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {!profile.phone && !profile.address && !isOwnProfile && (
                  <div className="text-sm text-muted-foreground">
                    Aucune information de contact disponible
                  </div>
                )}
              </div>
            ) : hasContactPermission ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Informations disponibles - cliquez pour afficher</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>••• •• •• •• ••</span>
                  <Shield className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Adresse masquée</span>
                  <Shield className="h-3 w-3" />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Demandez l'accès pour voir les coordonnées
                </div>
              </div>
            )}
          </div>

          {/* Contact Request Button */}
          {showContactButton && !isOwnProfile && !hasContactPermission && (
            <Button
              onClick={handleRequestContact}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Shield className="h-4 w-4 mr-2" />
              Demander les coordonnées
            </Button>
          )}
        </div>

        <ContactPermissionDialog
          isOpen={showPermissionDialog}
          onClose={() => setShowPermissionDialog(false)}
          sellerId={userId}
          sellerName={profile.display_name || 'Utilisateur'}
          onPermissionGranted={handlePermissionGranted}
        />
      </CardContent>
    </Card>
  );
};