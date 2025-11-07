import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const DomainRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const isPanelDomain = window.location.hostname === "panel.paapeli.com" || 
                        window.location.hostname === "localhost";

  useEffect(() => {
    if (isPanelDomain && location.pathname === "/" && !isLoading) {
      if (user) {
        navigate("/panel/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [isPanelDomain, location.pathname, navigate, user, isLoading]);

  return null;
};
