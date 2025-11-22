import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const DomainRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const hostname = window.location.hostname;
  const isPanelDomain = hostname === "panel.paapeli.com" || 
                        hostname.includes("panel-"); // Vercel preview deployments

  useEffect(() => {
    // For panel domain, redirect root to login or panel home
    if (hostname === "panel.paapeli.com" || hostname.includes("panel-")) {
      if (location.pathname === "/" && !isLoading) {
        if (user) {
          navigate("/home", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }
      // If authenticated and on /login, redirect to panel home
      if (location.pathname === "/login" && user && !isLoading) {
        navigate("/home", { replace: true });
      }
    }
    
    // For main domain, no special handling needed for panel routes since they don't exist
    if ((hostname === "paapeli.com" || hostname === "www.paapeli.com") && location.pathname === "/login" && user && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [hostname, location.pathname, navigate, user, isLoading]);

  return null;
};
