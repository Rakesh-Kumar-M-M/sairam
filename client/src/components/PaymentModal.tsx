import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (screenshot: string) => void;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setScreenshot(result);
      setIsUploading(false);
      toast({
        title: "Screenshot Uploaded",
        description: "Payment screenshot uploaded successfully!",
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload screenshot. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleCompletePayment = () => {
    if (!screenshot) {
      toast({
        title: "Screenshot Required",
        description: "Please upload a payment screenshot to continue.",
        variant: "destructive",
      });
      return;
    }

    onPaymentComplete(screenshot);
    onClose();
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-white">Payment - ₹300</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Bank Details Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow text-slate-800">
                  <tbody>
                    <tr>
                      <td className="font-semibold px-4 py-2">Account Number</td>
                      <td className="px-4 py-2">500101012193121</td>
                    </tr>
                    <tr>
                      <td className="font-semibold px-4 py-2">IFSC Code</td>
                      <td className="px-4 py-2">CIUB0000634</td>
                    </tr>
                    <tr>
                      <td className="font-semibold px-4 py-2">Account Holder</td>
                      <td className="px-4 py-2">SAI MAGNICON</td>
                    </tr>
                    <tr>
                      <td className="font-semibold px-4 py-2">Bank Name</td>
                      <td className="px-4 py-2">CITY UNION BANK</td>
                    </tr>
                    <tr>
                      <td className="font-semibold px-4 py-2">Branch Name</td>
                      <td className="px-4 py-2">POONTHANDALAM BRANCH</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Instructions */}
              <Card className="bg-slate-900 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-2">Payment Instructions:</h4>
                  <ol className="text-slate-300 text-sm space-y-1">
                    <li>1. Complete the payment of ₹300 using your preferred method</li>
                    <li>2. Take a screenshot of the payment confirmation</li>
                    <li>3. Upload the screenshot below</li>
                    <li>4. Click "Complete Registration"</li>
                  </ol>
                </CardContent>
              </Card>

              {/* Screenshot Upload */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 font-semibold">
                    Upload Payment Screenshot <span className="text-red-500">*</span>
                  </Label>
                  {!screenshot ? (
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-slate-400 text-sm mb-2">
                        Click to upload payment screenshot
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {isUploading ? "Uploading..." : "Choose File"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={screenshot}
                          alt="Payment Screenshot"
                          className="w-full h-32 object-cover rounded-lg border border-slate-600"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={handleRemoveScreenshot}
                          className="absolute top-2 right-2 h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-green-400 text-sm">✓ Screenshot uploaded successfully</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Button */}
              <Button
                onClick={handleCompletePayment}
                disabled={!screenshot}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
              >
                Complete Registration
              </Button>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 