import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { useDevMode } from "@/hooks/use-dev-mode";

const DevModeToggle = () => {
  const { isDevMode, toggleDevMode } = useDevMode();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {isDevMode && (
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 border-orange-500/30">
          Mode Développement
        </Badge>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDevMode}
        className="bg-background/80 backdrop-blur-sm"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DevModeToggle;