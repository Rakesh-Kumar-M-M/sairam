import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isRegistrationOpen, isLoading: isStatusLoading } = useRegistrationStatus();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/brochure", label: "Brochure" },
    { 
      href: "/register", 
      label: isRegistrationOpen ? "Register Now" : "Registration Closed",
      disabled: !isRegistrationOpen,
      icon: !isRegistrationOpen ? AlertCircle : undefined
    },
    { href: "/admin-login", label: "Admin" },
  ];

  const handleBrochureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open("/assets/brochure.pdf", "_blank");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Sairam Institutions Logo */}
          <div className="flex items-center">
            <img
              src="/assets/sairamlogo.jpg"
              alt="Sairam Institutions Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          
          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.disabled ? "#" : link.href}
                className={`transition-colors duration-200 ${
                  location === link.href
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                } ${
                  link.label === "Register Now" && isRegistrationOpen
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg"
                    : ""
                } ${
                  link.disabled
                    ? "text-red-400 cursor-not-allowed opacity-60"
                    : ""
                }`}
                onClick={(e) => {
                  if (link.href === "/brochure") {
                    handleBrochureClick(e);
                  }
                  if (link.disabled) {
                    e.preventDefault();
                    // Show registration closed popup
                    const modal = document.createElement('div');
                    modal.innerHTML = `
                      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                          <div class="flex justify-center mb-4">
                            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                              </svg>
                            </div>
                          </div>
                          <h2 class="text-2xl font-bold text-center text-gray-900 mb-4">Registration Closed</h2>
                          <p class="text-gray-600 text-center mb-6">Registration for Sairam MUN 2025 is currently closed. Please check back later for updates or contact the organizers for more information.</p>
                          <div class="flex flex-col space-y-3">
                            <button onclick="this.closest('.fixed').remove()" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:shadow-lg">Got it</button>
                          </div>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(modal);
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon size={16} />}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Right: Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.disabled ? "#" : link.href}
                  className={`px-4 py-2 transition-colors duration-200 ${
                    location === link.href
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  } ${
                    link.label === "Register Now" && isRegistrationOpen
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium mx-4"
                      : ""
                  } ${
                    link.disabled
                      ? "text-red-400 cursor-not-allowed opacity-60"
                      : ""
                  }`}
                  onClick={(e) => {
                    if (link.href === "/brochure") {
                      handleBrochureClick(e);
                    }
                    if (link.disabled) {
                      e.preventDefault();
                      // Show registration closed popup
                      const modal = document.createElement('div');
                      modal.innerHTML = `
                        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                            <div class="flex justify-center mb-4">
                              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                              </div>
                            </div>
                            <h2 class="text-2xl font-bold text-center text-gray-900 mb-4">Registration Closed</h2>
                            <p class="text-gray-600 text-center mb-6">Registration for Sairam MUN 2025 is currently closed. Please check back later for updates or contact the organizers for more information.</p>
                            <div class="flex flex-col space-y-3">
                              <button onclick="this.closest('.fixed').remove()" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:shadow-lg">Got it</button>
                            </div>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(modal);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon size={16} />}
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
