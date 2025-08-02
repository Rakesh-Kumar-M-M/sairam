import { useCountdown } from "@/hooks/use-countdown";

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const timeLeft = useCountdown(targetDate);

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-slate-700">
      <p className="text-slate-300 mb-4 text-center">Registration Ends In:</p>
      <div className="flex justify-center space-x-4 text-center">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold text-white">
            {timeLeft.days.toString().padStart(3, '0')}
          </div>
          <div className="text-xs text-slate-200">Days</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold text-white">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-200">Hours</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold text-white">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-200">Minutes</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold text-white">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-200">Seconds</div>
        </div>
      </div>
    </div>
  );
}
