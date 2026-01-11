import { createRoot } from "react-dom/client";
import { Suspense, useEffect } from "react";
import App from "./App.tsx";
import "./index.css";

// Loading component to prevent layout shift
export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Wrapper component to handle CSS loading
export const AppWrapper = () => {
  useEffect(() => {
    // Mark HTML as loaded after component mounts
    document.documentElement.classList.add('loaded');
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingFallback />}>
    <AppWrapper />
  </Suspense>
);
