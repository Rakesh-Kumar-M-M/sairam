import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselCard {
  emoji: string;
  title: string;
  description: string;
}

const carouselCards: CarouselCard[] = [
  {
    emoji: "🍱",
    title: "Lunch and Snacks Provided",
    description: "Enjoy complimentary meals and refreshments throughout the conference to keep you energized."
  },
  {
    emoji: "📜",
    title: "Certificates for All",
    description: "Receive official participation certificates to enhance your academic and professional portfolio."
  },
  {
    emoji: "🌍",
    title: "Country Representative",
    description: "Represent a nation and experience global diplomacy firsthand in realistic UN simulations."
  },
  {
    emoji: "🧠",
    title: "Enhance Skills",
    description: "Develop diplomacy, public speaking, and critical thinking skills that will benefit your future career."
  }
];

export function CardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselCards.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselCards.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselCards.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative">
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {carouselCards.map((card, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 snap-center"
          >
            <div className="text-4xl mb-4">{card.emoji}</div>
            <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
            <p className="text-slate-400">{card.description}</p>
          </div>
        ))}
      </div>
      
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-slate-800 border border-slate-700 rounded-full p-3 text-slate-300 hover:text-white hover:border-blue-500 transition-all duration-200"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-slate-800 border border-slate-700 rounded-full p-3 text-slate-300 hover:text-white hover:border-blue-500 transition-all duration-200"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
