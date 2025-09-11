import * as React from "react";
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { validatePasswordStrength, type PasswordStrength, isCommonPassword } from "@/lib/security";
import { Button } from "./button";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  showStrengthIndicator?: boolean;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthIndicator = false, onStrengthChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState<PasswordStrength | null>(null);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const password = e.target.value;
      
      if (showStrengthIndicator && password) {
        const passwordStrength = validatePasswordStrength(password);
        
        // Check for common passwords
        if (isCommonPassword(password)) {
          passwordStrength.feedback.unshift('Évitez les mots de passe courants');
          passwordStrength.isStrong = false;
        }
        
        setStrength(passwordStrength);
        onStrengthChange?.(passwordStrength);
      } else {
        setStrength(null);
        onStrengthChange?.(null);
      }
      
      props.onChange?.(e);
    };

    const getStrengthColor = (score: number) => {
      switch (score) {
        case 0:
        case 1:
          return "bg-destructive";
        case 2:
          return "bg-yellow-500";
        case 3:
          return "bg-blue-500";
        case 4:
          return "bg-green-500";
        default:
          return "bg-muted";
      }
    };

    const getStrengthText = (score: number) => {
      switch (score) {
        case 0:
        case 1:
          return "Faible";
        case 2:
          return "Moyen";
        case 3:
          return "Fort";
        case 4:
          return "Très fort";
        default:
          return "";
      }
    };

    const getStrengthIcon = (score: number) => {
      switch (score) {
        case 0:
        case 1:
          return <AlertTriangle className="h-4 w-4 text-destructive" />;
        case 2:
          return <Shield className="h-4 w-4 text-yellow-500" />;
        case 3:
        case 4:
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        default:
          return null;
      }
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className,
            )}
            ref={ref}
            {...props}
            onChange={handlePasswordChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={props.disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {showStrengthIndicator && strength && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStrengthIcon(strength.score)}
              <span className="text-sm text-muted-foreground">
                Force du mot de passe: {getStrengthText(strength.score)}
              </span>
            </div>
            
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    level < strength.score
                      ? getStrengthColor(strength.score)
                      : "bg-muted"
                  )}
                />
              ))}
            </div>

            {strength.feedback.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-1">
                {strength.feedback.map((item, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };