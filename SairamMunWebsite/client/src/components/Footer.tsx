import { Link } from "wouter";
import { Phone, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const quickLinks = [
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
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">Sairam MUN</span>
            </div>
            <p className="text-slate-400 italic">"Empowering Voices, Shaping Futures"</p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
          
          {/* Center Section: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-slate-400 hover:text-white transition-colors duration-200"
                  onClick={link.href === "/brochure" ? handleBrochureClick : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Section: Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-yellow-500" />
                <div>
                  <p className="text-slate-300 font-medium">Sushil Gopinath</p>
                  <p className="text-slate-400">+91 7845600485</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-yellow-500" />
                <div>
                  <p className="text-slate-300 font-medium">Arvind</p>
                  <p className="text-slate-400">+91 0000000000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Line */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-slate-400">
            © Designed and Developed by MUN Web Development Team.
          </p>
        </div>
      </div>
    </footer>
  );
}
