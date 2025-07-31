import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/brochure", label: "Brochure" },
    { href: "/register", label: "Register Now" },
  ];

  const handleBrochureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open("/assets/brochure.pdf", "_blank");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-white">Sairam</span>
          </Link>
          
          {/* Center: Sairam MUN */}
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sairam MUN
            </h1>
          </div>
          
          {/* Right: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 ${
                  location === link.href
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                } ${
                  link.label === "Register Now"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg"
                    : ""
                }`}
                onClick={link.href === "/brochure" ? handleBrochureClick : undefined}
              >
                {link.label}
              </Link>
            ))}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
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
                  href={link.href}
                  className={`px-4 py-2 transition-colors duration-200 ${
                    location === link.href
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  } ${
                    link.label === "Register Now"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium mx-4"
                      : ""
                  }`}
                  onClick={(e) => {
                    if (link.href === "/brochure") {
                      handleBrochureClick(e);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="px-4">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="text-slate-300 hover:text-white"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun size={20} className="mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={20} className="mr-2" />
                      Dark Mode
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
