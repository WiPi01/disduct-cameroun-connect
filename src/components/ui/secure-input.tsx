import * as React from "react";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/lib/security";
import { Input } from "./input";

interface SecureInputProps extends React.ComponentProps<"input"> {
  sanitize?: boolean;
  maxLength?: number;
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, sanitize = true, maxLength = 500, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Apply character limit
      if (value.length > maxLength) {
        value = value.substring(0, maxLength);
      }
      
      // Sanitize input if enabled
      if (sanitize) {
        value = sanitizeInput(value);
      }
      
      // Update the event with sanitized value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value
        }
      };
      
      onChange?.(syntheticEvent);
    };

    return (
      <Input
        className={cn(className)}
        ref={ref}
        {...props}
        onChange={handleChange}
      />
    );
  },
);

SecureInput.displayName = "SecureInput";

export { SecureInput };