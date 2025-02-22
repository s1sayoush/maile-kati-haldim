"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUser, signInWithPopupProvider } from "@/firebase/auth";
import { useUser } from "@/providers/UserContext";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { refreshUserDetails } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginUser(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "An error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    const result = await signInWithPopupProvider("google");

    if (result.success) {
      await refreshUserDetails();
      router.push("/dashboard");
    } else {
      setError(result.error || "An error occurred during Google sign-in");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                {" "}
                {/* Added relative wrapper */}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button" // Important: Don't submit the form
                  className="absolute inset-y-0 right-0 px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="relative w-full py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between w-full text-sm">
          <Button
            variant="link"
            className="px-0"
            onClick={() => router.push("/auth/reset-password")}
          >
            Forgot password?
          </Button>
          <Button
            variant="link"
            className="px-0"
            onClick={() => router.push("/auth/signup")}
          >
            Create account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
