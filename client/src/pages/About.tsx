import { motion } from "framer-motion";
import { useState } from "react";

interface StatCardProps {
  number: string;
  label: string;
  description: string;
  color: string;
}

function StatCard({ number, label, description, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} rounded-2xl p-8 text-center border border-opacity-30`}
    >
      <div className="text-4xl font-bold text-yellow-500 mb-2">{number}</div>
      <div className="text-xl text-white font-semibold">{label}</div>
      <div className="text-slate-400 mt-2">{description}</div>
    </motion.div>
  );
}

// Carousel images array using local assets
const carouselImages = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
  "/assets/img4.jpg"
];

function AboutCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Carousel Container */}
      <div className="relative h-96">
        {carouselImages.map((imageSrc, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % carouselImages.length;
          const isPrev = index === (currentIndex - 1 + carouselImages.length) % carouselImages.length;
          
          let transformClass = "";
          let zIndex = "";
          
          if (isActive) {
            transformClass = "translate-x-0 scale-100";
            zIndex = "z-20";
          } else if (isNext) {
            transformClass = "translate-x-8 scale-95";
            zIndex = "z-10";
          } else if (isPrev) {
            transformClass = "-translate-x-8 scale-95";
            zIndex = "z-10";
          } else {
            transformClass = index > currentIndex ? "translate-x-16 scale-90" : "-translate-x-16 scale-90";
            zIndex = "z-0";
          }

          return (
            <motion.div
              key={index}
              className={`absolute inset-0 ${zIndex} transition-all duration-500 ease-in-out ${transformClass}`}
              initial={false}
            >
              <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-2xl overflow-hidden h-full">
                {/* Image */}
                <img 
                  src={imageSrc} 
                  alt={`Sairam MUN Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Dots */}
                <div className="absolute top-4 right-4 flex space-x-1">
                  {carouselImages.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => goToSlide(dotIndex)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        dotIndex === currentIndex 
                          ? 'bg-yellow-400' 
                          : dotIndex === (currentIndex + 1) % carouselImages.length
                          ? 'bg-orange-400'
                          : 'bg-blue-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
             {/* Navigation Buttons */}
       <button
         onClick={prevSlide}
         className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all duration-200 z-30 shadow-lg border border-white/20 hover:border-white/30"
       >
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
         </svg>
       </button>
       
       <button
         onClick={nextSlide}
         className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all duration-200 z-30 shadow-lg border border-white/20 hover:border-white/30"
       >
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
         </svg>
       </button>
    </div>
  );
}

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-20 bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl font-bold text-white mb-6">About Sairam MUN</h2>
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
              <p>
                Model United Nations at Sri Sairam Engineering College is a prestigious simulation that brings together bright minds to tackle global challenges through diplomatic discourse and collaborative problem-solving.
              </p>
              <p>
                Our MUN program is designed to enhance critical thinking, public speaking, and leadership skills while providing participants with deep insights into international relations and global governance.
              </p>
              <p>
                Students gain invaluable experience in research, negotiation, and policy-making, preparing them for future careers in diplomacy, international business, law, and public service.
              </p>
              <p>
                Through realistic committee simulations and expert guidance, participants develop a nuanced understanding of complex global issues and the art of diplomatic resolution.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            {/* Enhanced Carousel */}
            <AboutCarousel />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">Event Overview</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <StatCard
              number="2000+"
              label="Delegates"
              description="Participants from various institutions"
              color="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30"
            />
            <StatCard
              number="23"
              label="Committees"
              description="Diverse topics and specialized councils"
              color="bg-gradient-to-br from-purple-600/20 to-yellow-500/20 border-purple-500/30"
            />
            <StatCard
              number="12"
              label="Partners"
              description="Supporting organizations and sponsors"
              color="bg-gradient-to-br from-yellow-500/20 to-blue-600/20 border-yellow-500/30"
            />
          </div>
        </motion.div>

        {/* Current Edition Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
        >
          <h3 className="text-2xl font-bold text-white mb-4">About This Edition</h3>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
            The current edition of Sairam MUN promises to be our most ambitious yet, featuring expanded committee diversity, expert keynote speakers, and innovative crisis simulations. With over 2000 expected participants representing institutions from across the region, this conference will provide unparalleled networking opportunities and learning experiences.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">
            Participants will engage with pressing contemporary issues including climate change, global security, human rights, and sustainable development. Our experienced committee directors and crisis managers ensure authentic, challenging, and educational experiences that mirror real-world diplomatic processes.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}