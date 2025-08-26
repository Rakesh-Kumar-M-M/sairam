import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegistrationClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function RegistrationClosedModal({
  isOpen,
  onClose,
  message
}: RegistrationClosedModalProps) {
  const defaultMessage = "Registration for Sairam MUN 2025 is currently closed. Please check back later for updates or contact the organizers for more information.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Registration Closed
            </h2>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {message || defaultMessage}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                Got it
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-all duration-200"
              >
                Back to Home
              </Button>
            </div>

            {/* Footer note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              For inquiries, contact the Sairam MUN organizing committee
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
