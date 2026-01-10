import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Lock } from "lucide-react";

interface InvitationData {
  id: string;
  email: string;
  projectId?: string;
  projectName?: string;
  [key: string]: unknown;
}

const AcceptInvitation = () => {
  const { authenticateWithToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link. No token provided.");
      setLoading(false);
      return;
    }

    // Validate the invitation token with the backend
    const validateInvitation = async () => {
      try {
        const response = await apiRequest(`/api/v1/members/invitations/validate?token=${token}`, {
          method: "GET",
        }, false);
        setInvitation(response.data);
        setLoading(false);
      } catch (error: unknown) {
        console.error("Failed to validate invitation:", error);
        const errorMessage = error instanceof Error ? error.message : "This invitation link is invalid, expired, or has already been used.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    validateInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError("Invalid invitation token");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // For simplicity, accept any password as requested
    // In production, you'd want proper password validation
    if (password.length < 1) {
      setError("Password cannot be empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await apiRequest(`/api/v1/members/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: password,
        }),
      }, false);

      toast({
        title: "Account Created!",
        description: response.data?.message || "Your account has been created. Please login with your credentials.",
      });

      // Redirect to login page instead of auto-login
      navigate("/login", { replace: true });

    } catch (error: unknown) {
      console.error("Failed to accept invitation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to accept invitation. The link may have expired.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => navigate("/")}>
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Accept Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                You've been invited to join a project. Please set a password for your account.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Your password will be used to log in to your account. Make sure it's something you'll remember.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleAcceptInvitation}
              disabled={submitting}
            >
              {submitting ? "Creating Account..." : "Accept Invitation & Create Account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitation;