import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CardCarousel } from "@/components/CardCarousel";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          {/* Sairam MUN Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3 mt-8 flex justify-center"
          >
            <img
              src="/assets/munlogo.png"
              alt="Sairam MUN Logo"
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))'
              }}
            />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent -mt-4">
            Sairam MUN
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-yellow-500 mb-4">
            "Speak. Lead. Resolve."
          </p>
          <div className="space-y-2 mb-8 text-slate-300">
            <p className="text-lg flex items-center justify-center gap-2">
              <MapPin className="text-yellow-500" size={20} />
              Sri Sairam Institutions
            </p>
            <p className="text-lg flex items-center justify-center gap-2">
              <Calendar className="text-yellow-500" size={20} />
              September 2-3, 2025
            </p>
          </div>
          
          <div className="mb-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Register Now
              </Button>
            </Link>
          </div>
          
          {/* Countdown Timer */}
          <CountdownTimer targetDate="2025-08-20T00:00:00" />
        </motion.div>
      </section>

      {/* Card Carousel Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-white"
          >
            Why Join Sairam MUN?
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CardCarousel />
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
