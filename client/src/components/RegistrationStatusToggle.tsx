import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationStatusToggle() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  
  const { status, isRegistrationOpen, updateStatus, isUpdating: isStatusUpdating } = useRegistrationStatus();
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    if (isStatusUpdating) return;
    
    setIsUpdating(true);
    try {
      const newStatus = !isRegistrationOpen;
      await updateStatus({
        isOpen: newStatus,
        message: customMessage || undefined
      });
      
      toast({
        title: `Registration ${newStatus ? 'Opened' : 'Closed'}`,
        description: newStatus 
          ? "Students can now register for Sairam MUN 2025." 
          : "Registration is now closed. Students will see a closed message.",
      });
      
      if (newStatus) {
        setCustomMessage("");
        setShowMessageInput(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update registration status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMessageSubmit = async () => {
    if (!customMessage.trim()) return;
    
    try {
      await updateStatus({
        isOpen: isRegistrationOpen,
        message: customMessage.trim()
      });
      
      toast({
        title: "Message Updated",
        description: "Custom message has been updated successfully.",
      });
      
      setShowMessageInput(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Status Display */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isRegistrationOpen 
            ? "bg-green-900/30 text-green-400 border border-green-500/30" 
            : "bg-red-900/30 text-red-400 border border-red-500/30"
        }`}>
          {isRegistrationOpen ? (
            <>
              <Unlock size={16} />
              <span className="font-medium">Registration Open</span>
            </>
          ) : (
            <>
              <Lock size={16} />
              <span className="font-medium">Registration Closed</span>
            </>
          )}
        </div>
        
        {status?.closedAt && !isRegistrationOpen && (
          <div className="text-slate-400 text-sm">
            Closed on {new Date(status.closedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleToggleStatus}
          disabled={isStatusUpdating || isUpdating}
          className={`${
            isRegistrationOpen
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } font-medium`}
        >
          {isStatusUpdating || isUpdating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : isRegistrationOpen ? (
            <>
              <Lock className="mr-2" size={16} />
              Close Registration
            </>
          ) : (
            <>
              <Unlock className="mr-2" size={16} />
              Open Registration
            </>
          )}
        </Button>

        {!isRegistrationOpen && (
          <Button
            variant="outline"
            onClick={() => setShowMessageInput(!showMessageInput)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <AlertCircle className="mr-2" size={16} />
            {showMessageInput ? "Cancel" : "Custom Message"}
          </Button>
        )}
      </div>

      {/* Custom Message Input */}
      {showMessageInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div>
            <Label htmlFor="customMessage" className="text-slate-300 text-sm">
              Custom Message for Closed Registration
            </Label>
            <Input
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter a custom message to show when registration is closed..."
              className="mt-1 bg-slate-900 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMessageSubmit}
              disabled={!customMessage.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="mr-2" size={16} />
              Update Message
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMessageInput(false)}
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Current Message Display */}
      {status?.message && !isRegistrationOpen && (
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-slate-300 font-medium mb-1">Current Message:</p>
              <p className="text-slate-400">{status.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
