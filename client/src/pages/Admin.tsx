import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Download, Eye, Filter, Users, Calendar, DollarSign, LogOut, Settings, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Registration {
  _id: string;
  fullName: string;
  year: "I" | "II" | "III" | "IV";
  department: string;
  section: string;
  secId: string;
  college: string;
  preferredCountry: string;
  phoneNumber: string;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/admin-login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await apiRequest("POST", "/api/admin/change-password", {
        currentPassword,
        newPassword,
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
        setShowPasswordDialog(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }

    setIsChangingPassword(false);
  };

  // Fetch registrations
  const { data: registrations = [], isLoading, error } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/registrations");
      const data = await response.json();
      return data.registrations || [];
    },
  });

  // Fetch MongoDB connection status
  const { data: healthStatus } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/health");
      return response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Filter registrations based on search and filters
  const filteredRegistrations = registrations.filter((reg: Registration) => {
    const matchesSearch = reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.secId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.phoneNumber.includes(searchTerm);
    const matchesYear = yearFilter === "all" || reg.year === yearFilter;
    const matchesCollege = collegeFilter === "all" || reg.college === collegeFilter;
    const matchesPayment = paymentFilter === "all" || reg.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesYear && matchesCollege && matchesPayment;
  });

  // Calculate statistics
  const totalRegistrations = registrations.length;
  const pendingPayments = registrations.filter((reg: Registration) => reg.paymentStatus === "pending").length;
  const completedPayments = registrations.filter((reg: Registration) => reg.paymentStatus === "completed").length;
  const totalRevenue = completedPayments * 300; // ₹300 per registration

  // MongoDB connection status
  const isMongoConnected = healthStatus?.success && healthStatus?.mongodb === "connected";

  const handleExportCSV = () => {
    const headers = ["ID", "Full Name", "Year", "Department", "Section", "Student ID", "College", "Preferred Country", "Phone Number", "Payment Status", "Registration Date"];
    const csvContent = [
      headers.join(","),
             ...filteredRegistrations.map((reg: Registration) => [
         reg._id,
        reg.fullName,
        reg.year,
        reg.department,
        reg.section,
        reg.secId,
        reg.college,
        reg.preferredCountry,
        reg.phoneNumber,
        reg.paymentStatus,
        new Date(reg.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sairam-mun-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Registration data has been exported to CSV file.",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <Card className="max-w-md w-full bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Error Loading Data</h2>
              <p className="text-slate-300">
                Unable to load registration data. Please check your connection and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-300">Manage and view Sairam MUN registrations</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${isMongoConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-slate-400">
                MongoDB: {isMongoConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white mr-3"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">Change Password</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-300 font-semibold">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300 font-semibold">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordDialog(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-slate-400 text-sm">Total Registrations</p>
                  <p className="text-2xl font-bold text-white">{totalRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-slate-400 text-sm">Pending Payments</p>
                  <p className="text-2xl font-bold text-white">{pendingPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-slate-400 text-sm">Completed Payments</p>
                  <p className="text-2xl font-bold text-white">{completedPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-slate-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="I">I Year</SelectItem>
                <SelectItem value="II">II Year</SelectItem>
                <SelectItem value="III">III Year</SelectItem>
                <SelectItem value="IV">IV Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter by College" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Colleges</SelectItem>
                <SelectItem value="Sri Sairam Engineering College">Sri Sairam Engineering College</SelectItem>
                <SelectItem value="Sri Sairam Institute of Technology">Sri Sairam Institute of Technology</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter by Payment" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleExportCSV}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              Registrations ({filteredRegistrations.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading registrations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Year</TableHead>
                    <TableHead className="text-slate-300">Department</TableHead>
                    <TableHead className="text-slate-300">College</TableHead>
                    <TableHead className="text-slate-300">Phone</TableHead>
                    <TableHead className="text-slate-300">Payment Status</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration: Registration) => (
                                         <TableRow key={registration._id} className="border-slate-700 hover:bg-slate-700/50">
                       <TableCell className="text-slate-300">{registration._id.slice(-6)}</TableCell>
                      <TableCell className="text-white font-medium">{registration.fullName}</TableCell>
                      <TableCell className="text-slate-300">{registration.year}</TableCell>
                      <TableCell className="text-slate-300">{registration.department}</TableCell>
                      <TableCell className="text-slate-300">{registration.college}</TableCell>
                      <TableCell className="text-slate-300">{registration.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            registration.paymentStatus === "completed"
                              ? "default"
                              : registration.paymentStatus === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            registration.paymentStatus === "completed"
                              ? "bg-green-600 hover:bg-green-700"
                              : registration.paymentStatus === "pending"
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-red-600 hover:bg-red-700"
                          }
                        >
                          {registration.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredRegistrations.length === 0 && !isLoading && (
            <div className="p-8 text-center">
              <p className="text-slate-400">No registrations found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 