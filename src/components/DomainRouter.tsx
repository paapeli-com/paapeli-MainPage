import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const DomainRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPanelDomain = window.location.hostname === "panel.paapeli.com";

  useEffect(() => {
    if (isPanelDomain && location.pathname === "/") {
      navigate("/panel/home", { replace: true });
    }
  }, [isPanelDomain, location.pathname, navigate]);

  return null;
};
