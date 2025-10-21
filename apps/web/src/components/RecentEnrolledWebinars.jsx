import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

function CountdownTimer({ initialCountdown }) {
  const [countdown, setCountdown] = useState(
    initialCountdown || { hours: 0, minutes: 0, seconds: 0 },
  );

  useEffect(() => {
    if (!initialCountdown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCountdown]);

  const formatTime = (time) => String(time).padStart(2, "0");

  return (
    <div
      className="flex items-center gap-1"
      aria-live="polite"
      aria-label={`Time remaining: ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
    >
      {/* Hours */}
      <div className="w-8 h-8 bg-[#001829] dark:bg-[#0D1117] rounded-lg flex items-center justify-center transition-colors duration-200">
        <span className="font-mono text-sm font-bold text-white">
          {formatTime(countdown.hours)}
        </span>
      </div>

      {/* Colon */}
      <span className="font-inter text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] mx-0.5 transition-colors duration-200">
        :
      </span>

      {/* Minutes */}
      <div className="w-8 h-8 bg-[#001829] dark:bg-[#0D1117] rounded-lg flex items-center justify-center transition-colors duration-200">
        <span className="font-mono text-sm font-bold text-white">
          {formatTime(countdown.minutes)}
        </span>
      </div>

      {/* Colon */}
      <span className="font-inter text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] mx-0.5 transition-colors duration-200">
        :
      </span>

      {/* Seconds */}
      <div className="w-8 h-8 bg-[#001829] dark:bg-[#0D1117] rounded-lg flex items-center justify-center transition-colors duration-200">
        <span className="font-mono text-sm font-bold text-white">
          {formatTime(countdown.seconds)}
        </span>
      </div>
    </div>
  );
}

function WebinarCard({ webinar, onWebinarClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleJoinClick = () => {
    if (webinar.join_url) {
      window.open(webinar.join_url, '_blank');
    }
  };

  const handleCardClick = () => {
    if (onWebinarClick) {
      onWebinarClick(webinar);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (startTime, endTime) => {
    const formatTimeOnly = (timeString) => {
      const time = new Date(`2000-01-01 ${timeString}`);
      return time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    };
    
    return `${formatTimeOnly(startTime)} – ${formatTimeOnly(endTime)}`;
  };

  return (
    <div
      className={`
        bg-white dark:bg-[#1E1E1E] border border-[#E7ECF3] dark:border-[#2A2A2A] rounded-xl p-5
        transition-all duration-200 ease-out cursor-pointer
        ${isHovered ? "shadow-sm dark:shadow-lg" : ""}
      `}
      style={{
        boxShadow: isHovered
          ? document.documentElement.classList.contains("dark")
            ? "0 2px 8px rgba(255,255,255,0.08)"
            : "0 2px 4px 8px rgba(0,0,0,0.04)"
          : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Block */}
        <div className="flex gap-5">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <img
              src={webinar.thumbnail_url}
              alt={`${webinar.title} webinar thumbnail`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category Line */}
            <div className="flex items-center gap-1 mb-1">
              <span className="font-inter text-xs text-[#0E7BFF] dark:text-[#3B82F6] transition-colors duration-200">
                {webinar.category}
              </span>
              <span className="text-[#94A3B8] dark:text-[#6B7280] text-xs transition-colors duration-200">
                •
              </span>
              <span className="font-inter text-xs text-[#6D7A8B] dark:text-[#9CA3AF] transition-colors duration-200">
                By {webinar.instructor}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-montserrat font-bold text-base text-[#04111C] dark:text-[#E5E7EB] mb-2 leading-tight transition-colors duration-200">
              {webinar.title}
            </h3>

            {/* Meta Line */}
            <div className="flex items-center gap-2 text-xs text-[#6D7A8B] dark:text-[#9CA3AF] transition-colors duration-200">
              <div className="flex items-center gap-1">
                <Calendar
                  size={12}
                  className="text-[#6D7A8B] dark:text-[#9CA3AF] transition-colors duration-200"
                />
                <span className="font-inter">{formatDate(webinar.scheduled_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock
                  size={12}
                  className="text-[#6D7A8B] dark:text-[#9CA3AF] transition-colors duration-200"
                />
                <span className="font-inter">{formatTime(webinar.start_time, webinar.end_time)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Block */}
        <div className="flex-shrink-0 md:min-w-[120px] flex justify-center md:justify-end">
          {webinar.hasJoinButton ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleJoinClick();
              }}
              className="
                bg-[#34C9B7] hover:bg-[#2FB3A3] dark:bg-[#059669] dark:hover:bg-[#047857] text-white font-inter font-semibold text-sm
                rounded-full h-11 px-6 transition-colors duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-[#34C9B7] focus:ring-opacity-50
              "
              aria-label="Join webinar now"
            >
              Join Now
            </button>
          ) : webinar.countdown ? (
            <CountdownTimer initialCountdown={webinar.countdown} />
          ) : (
            <div className="text-xs text-[#6D7A8B] dark:text-[#9CA3AF]">
              Scheduled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecentEnrolledWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledWebinars();
  }, []);

  const fetchEnrolledWebinars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-dashboard?userId=1');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setWebinars(result.data.enrolledWebinars);
      } else {
        throw new Error(result.error || 'Failed to fetch enrolled webinars');
      }
    } catch (error) {
      console.error('Error fetching enrolled webinars:', error);
      setError('Could not load enrolled webinars');
    } finally {
      setLoading(false);
    }
  };

  const handleWebinarClick = (webinar) => {
    console.log('Webinar clicked:', webinar);
  };

  const handleViewAll = () => {
    console.log('View all webinars clicked');
  };

  if (loading) {
    return (
      <section className="w-full">
        <div className="max-w-[1280px] mx-auto bg-white dark:bg-[#1E1E1E] border border-[#E7ECF3] dark:border-[#2A2A2A] rounded-xl p-6 md:p-8 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="max-w-[1280px] mx-auto bg-white dark:bg-[#1E1E1E] border border-[#E7ECF3] dark:border-[#2A2A2A] rounded-xl p-6 md:p-8 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat text-xl font-bold text-[#04111C] dark:text-[#E5E7EB] transition-colors duration-200">
              Recent Enrolled Webinar
            </h2>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchEnrolledWebinars}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* Container with background */}
      <div className="max-w-[1280px] mx-auto bg-white dark:bg-[#1E1E1E] border border-[#E7ECF3] dark:border-[#2A2A2A] rounded-xl p-6 md:p-8 transition-colors duration-200">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-montserrat text-xl font-bold text-[#04111C] dark:text-[#E5E7EB] transition-colors duration-200"
            role="heading"
            aria-level="2"
          >
            Recent Enrolled Webinar ({webinars.length})
          </h2>
          <button
            onClick={handleViewAll}
            className="
              px-4 py-2 rounded-full text-xs font-inter font-medium
              bg-[#C3F3EC] bg-opacity-60 text-[#0F9C92]
              dark:bg-[#1A2E2B] dark:bg-opacity-80 dark:text-[#34D399]
              hover:bg-[#B5EEDF] hover:bg-opacity-80 hover:text-[#0D8A7F]
              dark:hover:bg-[#1F3D33] dark:hover:text-[#22C55E]
              active:bg-[#A8E8D8] active:text-[#0B7A6F]
              dark:active:bg-[#16302A] dark:active:text-[#16A34A]
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-[#0F9C92] focus:ring-opacity-50
            "
            aria-label="View all enrolled webinars"
          >
            View All
          </button>
        </div>

        {/* Webinar Grid */}
        {webinars.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {webinars.map((webinar) => (
              <WebinarCard 
                key={webinar.id} 
                webinar={webinar} 
                onWebinarClick={handleWebinarClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              You haven't enrolled in any webinars yet
            </p>
            <button
              onClick={() => console.log('Browse webinars clicked')}
              className="px-6 py-3 bg-[#30C4B5] hover:bg-[#29AF9F] text-white rounded-lg font-medium transition-colors"
            >
              Browse Webinars
            </button>
          </div>
        )}
      </div>
    </section>
  );
}