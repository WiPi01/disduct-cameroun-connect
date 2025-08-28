import { useMemo } from "react";

export const useDevMode = () => {
  const isDevMode = useMemo(() => {
    // Detect development mode automatically
    return (
      import.meta.env.DEV ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("lovable.app") ||
      window.location.port !== ""
    );
  }, []);

  return isDevMode;
};
