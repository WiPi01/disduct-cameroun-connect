import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Eye, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SecurityLog {
  id: string;
  event_type: string;
  target_user_id?: string;
  metadata: any;
  created_at: string;
}

export const SecurityMonitor = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchSecurityLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch recent security logs related to current user
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching security logs:', error);
        return;
      }

      setLogs(data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Unexpected error fetching security logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityLogs();
  }, [user]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'profile_access':
      case 'profile_viewed':
        return <Eye className="h-4 w-4" />;
      case 'profile_access_rate_limited':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'contact_permission_request_initiated':
      case 'contact_permission_granted':
        return <Shield className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventVariant = (eventType: string) => {
    switch (eventType) {
      case 'profile_access_rate_limited':
        return 'destructive';
      case 'contact_permission_granted':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatEventType = (eventType: string) => {
    const translations: Record<string, string> = {
      'profile_access': 'Accès au profil',
      'profile_viewed': 'Profil consulté',
      'profile_access_rate_limited': 'Accès bloqué (limite)',
      'contact_permission_request_initiated': 'Demande de contact initiée',
      'contact_permission_granted': 'Permission de contact accordée',
      'sensitive_info_toggle': 'Informations sensibles basculées',
    };
    
    return translations[eventType] || eventType;
  };

  const handleRefresh = () => {
    fetchSecurityLogs();
    toast.success('Logs de sécurité actualisés');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Monitoring de Sécurité
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Dernière mise à jour: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun événement de sécurité récent</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 mt-1">
                  {getEventIcon(log.event_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getEventVariant(log.event_type) as any}>
                      {formatEventType(log.event_type)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    {log.target_user_id && (
                      <div className="text-muted-foreground">
                        Profil cible: {log.target_user_id.slice(0, 8)}...
                      </div>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {JSON.stringify(log.metadata, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Sécurité renforcée activée</span>
          </div>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
            <li>• Limitation du taux d'accès aux profils</li>
            <li>• Journalisation des événements de sécurité</li>
            <li>• Protection des données sensibles</li>
            <li>• Contrôle d'accès granulaire</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};