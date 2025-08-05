import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Download, Eye, EyeOff, Filter, Users, Calendar, DollarSign, LogOut, Image, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  committee: "UNEP" | "UNSC";
  paymentStatus: "pending" | "completed" | "failed";
  paymentScreenshot?: string;
  createdAt: string;
}

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [committeeFilter, setCommitteeFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    const loginTime = localStorage.getItem("adminLoginTime");
    
    console.log("🔐 Admin auth check:", { 
      isAuthenticated, 
      loginTime, 
      timestamp: new Date().toISOString() 
    });
    
    if (!isAuthenticated) {
      console.log("❌ Admin not authenticated, redirecting to login");
      setLocation("/admin-login");
      return;
    }
    
    // Check if login is expired (24 hours)
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLogin > 24) {
        console.log("⏰ Admin session expired, redirecting to login");
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminLoginTime");
        toast({
          title: "Session Expired",
          description: "Your admin session has expired. Please login again.",
          variant: "destructive",
        });
        setLocation("/admin-login");
        return;
      }
    }
    
    console.log("✅ Admin authentication valid");
  }, [setLocation, toast]);

  const handleLogout = () => {
    console.log("🚪 Admin logout initiated");
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/admin-login");
  };

  const handleScreenshotClick = (screenshot: string) => {
    setSelectedScreenshot(screenshot);
  };

  const handleCloseScreenshot = () => {
    setSelectedScreenshot(null);
  };

  const handleDownloadScreenshot = (screenshot: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `payment-${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Payment screenshot download started.",
    });
  };

  // Fetch registrations
  const { data: registrations = [], isLoading, error } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/registrations");
      const data = await response.json();
      console.log("Fetched registrations:", data.registrations);
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
    const matchesCommittee = committeeFilter === "all" || reg.committee === committeeFilter || (!reg.committee && committeeFilter === "all");
    const matchesPayment = paymentFilter === "all" || reg.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesYear && matchesCollege && matchesCommittee && matchesPayment;
  });

  // Calculate statistics
  const totalRegistrations = registrations.length;
  const pendingPayments = registrations.filter((reg: Registration) => reg.paymentStatus === "pending").length;
  const completedPayments = registrations.filter((reg: Registration) => reg.paymentStatus === "completed").length;
  const totalRevenue = completedPayments * 300; // ₹300 per registration

  // MongoDB connection status
  const isMongoConnected = healthStatus?.success && healthStatus?.mongodb === "connected";

  const handleExportCSV = () => {
    const headers = ["Student ID", "Full Name", "Year", "Department", "Section", "College", "Preferred Country", "Phone Number", "Committee", "Payment Status", "Registration Date"];
    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map((reg: Registration) => [
        reg.secId,
        reg.fullName,
        reg.year,
        reg.department,
        reg.section,
        reg.college,
        reg.preferredCountry,
        reg.phoneNumber,
        reg.committee || "Not Selected",
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by name, student ID, or phone..."
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

            <Select value={committeeFilter} onValueChange={setCommitteeFilter}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue placeholder="Filter by Committee" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Committees</SelectItem>
                <SelectItem value="UNEP">UNEP</SelectItem>
                <SelectItem value="UNSC">UNSC</SelectItem>
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
                    <TableHead className="text-slate-300">Student ID</TableHead>
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Year</TableHead>
                    <TableHead className="text-slate-300">Department</TableHead>
                    <TableHead className="text-slate-300">College</TableHead>
                    <TableHead className="text-slate-300">Phone</TableHead>
                    <TableHead className="text-slate-300">Committee</TableHead>
                    <TableHead className="text-slate-300">Payment Status</TableHead>
                    <TableHead className="text-slate-300">Screenshot</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration: Registration) => (
                    <TableRow key={registration._id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-300">{registration.secId}</TableCell>
                      <TableCell className="text-white font-medium">{registration.fullName}</TableCell>
                      <TableCell className="text-slate-300">{registration.year}</TableCell>
                      <TableCell className="text-slate-300">{registration.department}</TableCell>
                      <TableCell className="text-slate-300">{registration.college}</TableCell>
                      <TableCell className="text-slate-300">{registration.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          {registration.committee || "Not Selected"}
                        </Badge>
                      </TableCell>
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
                      <TableCell>
                        {registration.paymentScreenshot ? (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleScreenshotClick(registration.paymentScreenshot!)}
                              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadScreenshot(registration.paymentScreenshot!, registration.fullName)}
                              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">No screenshot</span>
                        )}
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

      {/* Screenshot Preview Modal */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseScreenshot}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] overflow-auto bg-slate-800 border border-slate-700 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-700">
                <h3 className="text-white font-semibold">Payment Screenshot</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseScreenshot}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <img
                  src={selectedScreenshot}
                  alt="Payment Screenshot"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 