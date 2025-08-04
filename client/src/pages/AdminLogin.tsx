import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, Shield, ArrowLeft, Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<"login" | "forgot" | "reset">("login");
  const [phoneNumber, setPhoneNumber] = useState("8838725153");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/login", { username, password });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("adminAuthenticated", "true");
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        setLocation("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/forgot-password", { phoneNumber });
      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        setCurrentView("reset"); // Navigate to reset password view
        toast({
          title: "OTP Sent",
          description: `OTP sent to ${phoneNumber}. Check your phone for the code.`,
        });
        // In production, remove this - OTP should be sent via SMS only
        if (data.otp) {
          toast({
            title: "Test OTP",
            description: `Test OTP: ${data.otp}`,
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Failed to Send OTP",
          description: data.message || "Failed to send OTP.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/reset-password", { 
        phoneNumber, 
        otp, 
        newPassword 
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully.",
        });
        setCurrentView("login");
        setOtp("");
        setNewPassword("");
        setOtpSent(false);
      } else {
        toast({
          title: "Password Reset Failed",
          description: data.message || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const renderLoginView = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Shield className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
        <p className="text-slate-400">Access the Sairam MUN admin dashboard</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300 font-semibold">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Default credentials: admin / sairammun2025
          </p>
          <Button
            type="button"
            variant="link"
            className="text-blue-400 hover:text-blue-300 text-sm"
            onClick={() => setCurrentView("forgot")}
          >
            Forgot Password?
          </Button>
        </div>
      </CardContent>
    </>
  );

  const renderForgotPasswordView = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Phone className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
        <p className="text-slate-400">Enter your phone number to receive OTP</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-slate-300 font-semibold">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-slate-500">
              Admin phone number: 8838725153
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            type="button"
            variant="link"
            className="text-blue-400 hover:text-blue-300 text-sm"
            onClick={() => setCurrentView("login")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Button>
        </div>
      </CardContent>
    </>
  );

  const renderResetPasswordView = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Lock className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
        <p className="text-slate-400">Enter OTP and new password</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-slate-300 font-semibold">
              OTP Code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              maxLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-300 font-semibold">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            type="button"
            variant="link"
            className="text-blue-400 hover:text-blue-300 text-sm"
            onClick={() => setCurrentView("forgot")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Forgot Password
          </Button>
        </div>
      </CardContent>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4"
    >
      <Card className="max-w-md w-full bg-slate-800 border-slate-700 shadow-2xl">
        {currentView === "login" && renderLoginView()}
        {currentView === "forgot" && renderForgotPasswordView()}
        {currentView === "reset" && renderResetPasswordView()}
      </Card>
    </motion.div>
  );
} 