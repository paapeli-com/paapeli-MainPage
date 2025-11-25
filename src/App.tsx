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
import Pricing from "./pages/Pricing";
import AIoTPlatform from "./pages/products/AIoTPlatform";
import DDoSProtection from "./pages/products/DDoSProtection";
import SmartCities from "./pages/usecases/SmartCities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <DomainRouter />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/:lang" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/error" element={<AuthError />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/google-signup" element={<GoogleSignup />} />
              
              {/* Public Product Pages */}
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/aiot-platform" element={<AIoTPlatform />} />
              <Route path="/ddos-protection" element={<DDoSProtection />} />
              <Route path="/smart-cities" element={<SmartCities />} />
              
              {/* Protected Panel Routes */}
              <Route path="/home" element={<ProtectedRoute><PanelHome /></ProtectedRoute>} />
              <Route path="/:lang/home" element={<ProtectedRoute><PanelHome /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/:lang/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
              <Route path="/:lang/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
              <Route path="/devices/:deviceId" element={<ProtectedRoute><DeviceDetails /></ProtectedRoute>} />
              <Route path="/:lang/devices/:deviceId" element={<ProtectedRoute><DeviceDetails /></ProtectedRoute>} />
              <Route path="/devices/group" element={<ProtectedRoute><DeviceGroup /></ProtectedRoute>} />
              <Route path="/:lang/devices/group" element={<ProtectedRoute><DeviceGroup /></ProtectedRoute>} />
              <Route path="/devices/gateways" element={<ProtectedRoute><Gateways /></ProtectedRoute>} />
              <Route path="/:lang/devices/gateways" element={<ProtectedRoute><Gateways /></ProtectedRoute>} />
              <Route path="/alarms" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
              <Route path="/:lang/alarms" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
              <Route path="/solution-templates" element={<ProtectedRoute><SolutionTemplates /></ProtectedRoute>} />
              <Route path="/:lang/solution-templates" element={<ProtectedRoute><SolutionTemplates /></ProtectedRoute>} />
              <Route path="/ota" element={<ProtectedRoute><OTA /></ProtectedRoute>} />
              <Route path="/:lang/ota" element={<ProtectedRoute><OTA /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/:lang/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/dev-center" element={<ProtectedRoute><DevCenter /></ProtectedRoute>} />
              <Route path="/:lang/dev-center" element={<ProtectedRoute><DevCenter /></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
