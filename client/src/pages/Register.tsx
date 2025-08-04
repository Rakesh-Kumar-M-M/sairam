import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, Send, CheckCircle } from "lucide-react";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: "",
      year: undefined,
      department: "",
      section: "",
      secId: "",
      college: "",
      preferredCountry: "",
      phoneNumber: "",
      committee: undefined,
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      console.log('🚀 Submitting registration data:', data);
      try {
        const response = await apiRequest("POST", "/api/registrations", data);
        const result = await response.json();
        console.log('✅ Registration response:', result);
        return result;
      } catch (error) {
        console.error('❌ Registration error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🎉 Registration successful:', data);
      setIsRegistered(true);
      form.reset();
      toast({
        title: "Registration Successful!",
        description: "Thank you for registering. You will receive a confirmation email shortly.",
      });
    },
    onError: (error: any) => {
      console.error('💥 Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registrationMutation.mutate(data);
  };

  const handlePayment = () => {
    toast({
      title: "Payment Integration",
      description: "Payment integration coming soon! Please complete the registration form first.",
    });
  };

  if (isRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4"
      >
        <Card className="max-w-md w-full bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
              <p className="text-slate-300">
                Thank you for registering for Sairam MUN 2025. You will receive a confirmation email shortly with further details.
              </p>
              <Button
                onClick={() => setIsRegistered(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Register Another Participant
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-20 bg-gradient-to-b from-slate-900 to-slate-800"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Register for Sairam MUN</h2>
          <p className="text-xl text-slate-300">Join us for an unforgettable diplomatic experience</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-slate-800 border-slate-700 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                                         <Label htmlFor="fullName" className="text-slate-300 font-semibold">
                       Full Name <span className="text-red-500">*</span>
                     </Label>
                    <Input
                      id="fullName"
                      {...form.register("fullName")}
                      placeholder="Enter your full name"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-red-400 text-sm">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                                         <Label htmlFor="year" className="text-slate-300 font-semibold">
                       Year <span className="text-red-500">*</span>
                     </Label>
                    <Select onValueChange={(value) => form.setValue("year", value as "I" | "II" | "III" | "IV")}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="I">I Year</SelectItem>
                        <SelectItem value="II">II Year</SelectItem>
                        <SelectItem value="III">III Year</SelectItem>
                        <SelectItem value="IV">IV Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.year && (
                      <p className="text-red-400 text-sm">{form.formState.errors.year.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                                         <Label htmlFor="department" className="text-slate-300 font-semibold">
                       Department <span className="text-red-500">*</span>
                     </Label>
                    <Input
                      id="department"
                      {...form.register("department")}
                      placeholder="e.g., Computer Science"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {form.formState.errors.department && (
                      <p className="text-red-400 text-sm">{form.formState.errors.department.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                                         <Label htmlFor="section" className="text-slate-300 font-semibold">
                       Section <span className="text-red-500">*</span>
                     </Label>
                    <Input
                      id="section"
                      {...form.register("section")}
                      placeholder="e.g., A"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {form.formState.errors.section && (
                      <p className="text-red-400 text-sm">{form.formState.errors.section.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                                         <Label htmlFor="secId" className="text-slate-300 font-semibold">
                       Student ID <span className="text-red-500">*</span>
                     </Label>
                    <Input
                      id="secId"
                      {...form.register("secId")}
                      placeholder="Your college ID"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {form.formState.errors.secId && (
                      <p className="text-red-400 text-sm">{form.formState.errors.secId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                                         <Label htmlFor="college" className="text-slate-300 font-semibold">
                       College <span className="text-red-500">*</span>
                     </Label>
                    <Select onValueChange={(value) => form.setValue("college", value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select College" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="Sri Sairam Engineering College">Sri Sairam Engineering College</SelectItem>
                        <SelectItem value="Sri Sairam Institute of Technology">Sri Sairam Institute of Technology</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.college && (
                      <p className="text-red-400 text-sm">{form.formState.errors.college.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredCountry" className="text-slate-300 font-semibold">
                      Preferred Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="preferredCountry"
                      {...form.register("preferredCountry")}
                      placeholder="Enter your preferred country"
                      className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {form.formState.errors.preferredCountry && (
                      <p className="text-red-400 text-sm">{form.formState.errors.preferredCountry.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-300 font-semibold">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                                         <Input
                       id="phoneNumber"
                       {...form.register("phoneNumber")}
                       placeholder="Mobile number"
                       maxLength={10}
                       type="tel"
                       pattern="[0-9]*"
                       inputMode="numeric"
                       onKeyPress={(e) => {
                         if (!/[0-9]/.test(e.key)) {
                           e.preventDefault();
                         }
                       }}
                       className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                     />
                    {form.formState.errors.phoneNumber && (
                      <p className="text-red-400 text-sm">{form.formState.errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="committee" className="text-slate-300 font-semibold">
                    Committee Selection <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => form.setValue("committee", value as "UNEP" | "UNSC")}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select Committee" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600" position="popper" side="bottom" align="start">
                      <SelectItem value="UNEP">UNEP (United Nations Environment Policy)</SelectItem>
                      <SelectItem value="UNSC">UNSC (United Nations Security Council)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.committee && (
                    <p className="text-red-400 text-sm">{form.formState.errors.committee.message}</p>
                  )}
                </div>

                {/* Payment Section */}
                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Registration Fee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300">Conference Registration</span>
                      <span className="text-2xl font-bold text-yellow-500">₹300</span>
                    </div>
                    <Button
                      type="button"
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white font-semibold"
                    >
                      <CreditCard className="mr-2" size={20} />
                      Pay Now - ₹300
                    </Button>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={registrationMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg py-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                  >
                    <Send className="mr-2" size={20} />
                    {registrationMutation.isPending ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
