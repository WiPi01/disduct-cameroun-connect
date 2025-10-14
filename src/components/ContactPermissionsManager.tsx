import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContactPermissions, ContactPermission } from '@/hooks/useContactPermissions';
import { Shield, Check, X, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const ContactPermissionsManager = () => {
  const { 
    approveContactPermission, 
    rejectContactPermission,
    revokeContactPermission,
    getPendingRequests,
    getMyContactRequests,
    loading 
  } = useContactPermissions();
  
  const [pendingRequests, setPendingRequests] = useState<ContactPermission[]>([]);
  const [approvedPermissions, setApprovedPermissions] = useState<ContactPermission[]>([]);
  const [requesterProfiles, setRequesterProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const pending = await getPendingRequests();
    const all = await getMyContactRequests();
    const approved = all.filter(p => p.status === 'approved');
    
    setPendingRequests(pending);
    setApprovedPermissions(approved);

    // Load requester profiles
    const requesterIds = [...new Set([...pending, ...approved].map(p => p.requester_id))];
    const profiles: Record<string, any> = {};
    
    for (const id of requesterIds) {
      try {
        const { data } = await supabase.rpc('get_secure_profile', { profile_user_id: id });
        if (data) {
          profiles[id] = data;
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    
    setRequesterProfiles(profiles);
  };

  const handleApprove = async (permissionId: string) => {
    const success = await approveContactPermission(permissionId);
    if (success) {
      await loadPermissions();
    }
  };

  const handleReject = async (permissionId: string) => {
    const success = await rejectContactPermission(permissionId);
    if (success) {
      await loadPermissions();
    }
  };

  const handleRevoke = async (requesterId: string) => {
    const success = await revokeContactPermission(requesterId);
    if (success) {
      await loadPermissions();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Demandes en attente ({pendingRequests.length})
          </CardTitle>
          <CardDescription>
            Ces utilisateurs ont demandé l'accès à vos coordonnées (téléphone et adresse)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune demande en attente
            </p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const profile = requesterProfiles[request.requester_id];
                return (
                  <div 
                    key={request.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {profile?.display_name || 'Utilisateur'}
                        </p>
                        <Badge variant="outline" className="text-orange-600">
                          <Clock className="h-3 w-3 mr-1" />
                          En attente
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Demandé le {formatDate(request.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => handleApprove(request.id)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(request.id)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Permissions accordées ({approvedPermissions.length})
          </CardTitle>
          <CardDescription>
            Ces utilisateurs ont accès à vos coordonnées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedPermissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune permission accordée
            </p>
          ) : (
            <div className="space-y-4">
              {approvedPermissions.map((permission) => {
                const profile = requesterProfiles[permission.requester_id];
                return (
                  <div 
                    key={permission.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {profile?.display_name || 'Utilisateur'}
                        </p>
                        <Badge variant="outline" className="text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Approuvé
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accordé le {formatDate(permission.granted_at)}
                        {permission.expires_at && (
                          <> · Expire le {formatDate(permission.expires_at)}</>
                        )}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleRevoke(permission.requester_id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Révoquer
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Protection de vos données personnelles
              </p>
              <p className="text-sm text-blue-700">
                Vos coordonnées (téléphone et adresse) ne sont jamais visibles publiquement. 
                Seuls les utilisateurs que vous approuvez explicitement peuvent y accéder. 
                Vous pouvez révoquer l'accès à tout moment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
