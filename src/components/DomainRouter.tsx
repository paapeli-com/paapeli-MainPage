import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const DomainRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const hostname = window.location.hostname;
  const isPanelDomain = hostname === "panel.paapeli.com" || 
                        hostname.includes("panel-") || // Vercel preview deployments
                        (hostname === "localhost" && location.pathname.startsWith("/panel"));

  useEffect(() => {
    // For panel domain, redirect root to login or panel home
    if (hostname === "panel.paapeli.com" || hostname.includes("panel-")) {
      if (location.pathname === "/" && !isLoading) {
        if (user) {
          navigate("/panel/home", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }
      // If authenticated and on /login, redirect to panel home
      if (location.pathname === "/login" && user && !isLoading) {
        navigate("/panel/home", { replace: true });
      }
    }
    
    // For main domain, prevent access to panel routes
    if (hostname === "paapeli.com" || hostname === "www.paapeli.com") {
      if (location.pathname.startsWith("/panel") && !isLoading) {
        window.location.href = "https://panel.paapeli.com" + location.pathname.replace("/panel", "");
      }
      // If authenticated on main domain and on /login, redirect to home
      if (location.pathname === "/login" && user && !isLoading) {
        navigate("/", { replace: true });
      }
    }
  }, [hostname, location.pathname, navigate, user, isLoading]);

  return null;
};
