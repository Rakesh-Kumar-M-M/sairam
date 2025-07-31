import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react"; // Add this import

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

// Carousel images array
const carouselImages = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  // Add more image URLs as needed
];

function AboutCarousel() {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="embla overflow-hidden rounded-2xl shadow-2xl w-full h-auto" ref={emblaRef}>
      <div className="embla__container flex">
        {carouselImages.map((src, idx) => (
          <div className="embla__slide flex-[0_0_100%] px-2" key={idx}>
            <img src={src} alt={`About ${idx + 1}`} className="w-full h-80 object-cover rounded-2xl" />
          </div>
        ))}
      </div>
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
          >
            {/* Carousel replaces static image */}
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