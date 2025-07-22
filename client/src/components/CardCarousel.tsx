import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselCards.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(timer);
  }, [isPlaying, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselCards.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselCards.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {carouselCards.map((card, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 mx-auto max-w-4xl">
                <div className="text-center">
                  <div className="text-6xl md:text-7xl mb-6">{card.emoji}</div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">{card.title}</h3>
                  <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full p-3 text-slate-300 hover:text-white hover:border-blue-500 transition-all duration-200 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full p-3 text-slate-300 hover:text-white hover:border-blue-500 transition-all duration-200 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-3 mt-8">
        {carouselCards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-blue-500 w-8" 
                : "bg-slate-600 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={togglePlayPause}
          className="bg-slate-800 border border-slate-700 rounded-full p-2 text-slate-300 hover:text-white hover:border-blue-500 transition-all duration-200"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </div>
  );
}
