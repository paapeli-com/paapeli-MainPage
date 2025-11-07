import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DomainRouter } from "@/components/DomainRouter";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";
import AuthError from "./pages/AuthError";
import AccountSettings from "./pages/AccountSettings";
import GoogleSignup from "./pages/GoogleSignup";
import NotFound from "./pages/NotFound";
import PanelNotFound from "./pages/panel/PanelNotFound";
import PanelHome from "./pages/panel/PanelHome";
import Dashboard from "./pages/panel/Dashboard";
import Devices from "./pages/panel/Devices";
import DeviceDetails from "./pages/panel/DeviceDetails";
import DeviceGroup from "./pages/panel/DeviceGroup";
import Gateways from "./pages/panel/Gateways";
import Alarms from "./pages/panel/Alarms";
import SolutionTemplates from "./pages/panel/SolutionTemplates";
import OTA from "./pages/panel/OTA";
import Members from "./pages/panel/Members";
import DevCenter from "./pages/panel/DevCenter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DomainRouter />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/error" element={<AuthError />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/google-signup" element={<GoogleSignup />} />
              
              {/* Protected Panel Routes */}
              <Route path="/panel/home" element={<ProtectedRoute><PanelHome /></ProtectedRoute>} />
              <Route path="/panel/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/panel/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
              <Route path="/panel/devices/:deviceId" element={<ProtectedRoute><DeviceDetails /></ProtectedRoute>} />
              <Route path="/panel/devices/group" element={<ProtectedRoute><DeviceGroup /></ProtectedRoute>} />
              <Route path="/panel/devices/gateways" element={<ProtectedRoute><Gateways /></ProtectedRoute>} />
              <Route path="/panel/alarms" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
              <Route path="/panel/solution-templates" element={<ProtectedRoute><SolutionTemplates /></ProtectedRoute>} />
              <Route path="/panel/ota" element={<ProtectedRoute><OTA /></ProtectedRoute>} />
              <Route path="/panel/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/panel/dev-center" element={<ProtectedRoute><DevCenter /></ProtectedRoute>} />
              <Route path="/panel/*" element={<PanelNotFound />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
