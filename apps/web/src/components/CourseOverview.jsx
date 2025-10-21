import { useState, useEffect } from "react";
import {
  BookOpenText,
  PlaySquare,
  Image,
  Award,
  ArrowRight,
} from "lucide-react";

function DecorativeOverlay({ accentColor, darkAccentColor, cardId }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[14px] pointer-events-none">
      {/* Top-left arc */}
      <svg
        className="absolute -top-2 -left-2 w-16 h-16"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 56 C8 31, 31 8, 56 8"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.15"
          fill="none"
          className="dark:hidden"
        />
        <path
          d="M2 60 C2 29, 29 2, 60 2"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.15"
          fill="none"
          className="dark:hidden"
        />
        <path
          d="M8 56 C8 31, 31 8, 56 8"
          stroke={darkAccentColor}
          strokeWidth="1"
          strokeOpacity="0.25"
          fill="none"
          className="hidden dark:block"
        />
        <path
          d="M2 60 C2 29, 29 2, 60 2"
          stroke={darkAccentColor}
          strokeWidth="1"
          strokeOpacity="0.25"
          fill="none"
          className="hidden dark:block"
        />
      </svg>

      {/* Bottom-right arc */}
      <svg
        className="absolute -bottom-2 -right-2 w-16 h-16 rotate-180"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 56 C8 31, 31 8, 56 8"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.15"
          fill="none"
          className="dark:hidden"
        />
        <path
          d="M2 60 C2 29, 29 2, 60 2"
          stroke={accentColor}
          strokeWidth="1"
          strokeOpacity="0.15"
          fill="none"
          className="dark:hidden"
        />
        <path
          d="M8 56 C8 31, 31 8, 56 8"
          stroke={darkAccentColor}
          strokeWidth="1"
          strokeOpacity="0.25"
          fill="none"
          className="hidden dark:block"
        />
        <path
          d="M2 60 C2 29, 29 2, 60 2"
          stroke={darkAccentColor}
          strokeWidth="1"
          strokeOpacity="0.25"
          fill="none"
          className="hidden dark:block"
        />
      </svg>
    </div>
  );
}

function StatCard({ stat }) {
  const IconComponent = stat.icon;

  return (
    <div
      className={`
        relative min-h-[124px] p-5 rounded-[14px] border transition-all duration-200 ease-out cursor-pointer
        ${stat.bgColor} ${stat.borderColor} ${stat.hoverBorderColor}
        hover:shadow-sm hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-offset-2
        dark:hover:shadow-lg
      `}
      style={{
        "--focus-ring-color": stat.accentColor,
        boxShadow: "var(--card-shadow, none)",
      }}
      tabIndex={0}
      role="button"
      onMouseEnter={(e) => {
        const isDark = document.documentElement.classList.contains("dark");
        e.currentTarget.style.setProperty(
          "--card-shadow",
          isDark
            ? "rgba(255,255,255,0.05) 0px 2px 8px 0px"
            : "rgba(0,0,0,0.05) 0px 2px 6px 0px",
        );
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--card-shadow", "none");
      }}
      onFocus={(e) => {
        const isDark = document.documentElement.classList.contains("dark");
        const color = isDark ? stat.darkAccentColor : stat.accentColor;
        e.currentTarget.style.outline = `2px solid ${color}`;
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      <DecorativeOverlay
        accentColor={stat.accentColor}
        darkAccentColor={stat.darkAccentColor}
        cardId={stat.id}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Upper block */}
        <div className="flex items-start gap-3">
          {/* Icon container */}
          <div className="w-12 h-12 bg-white dark:bg-[#262626] rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
            <IconComponent
              size={20}
              strokeWidth={2}
              color={stat.accentColor}
              className="dark:hidden"
            />
            <IconComponent
              size={20}
              strokeWidth={2}
              color={stat.darkAccentColor}
              className="hidden dark:block"
            />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="font-poppins font-medium text-[28px] leading-8 text-[#09121F] dark:text-[#E5E7EB] mb-1 transition-colors duration-200">
              {stat.value}
            </div>
            <div className="font-montserrat font-semibold text-sm leading-5 text-[#64748B] dark:text-[#9CA3AF] transition-colors duration-200">
              {stat.title}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px bg-black bg-opacity-6 dark:bg-white dark:bg-opacity-10 my-4 transition-colors duration-200"
          style={{ marginTop: "auto", marginBottom: "16px" }}
        />

        {/* Lower block */}
        <div className="flex items-center justify-between">
          <button
            className={`font-montserrat font-semibold text-sm leading-5 ${stat.textColor} hover:underline focus:outline-none focus:underline transition-colors duration-200`}
          >
            See Details
          </button>
          <div>
            <ArrowRight
              size={18}
              color={stat.accentColor}
              className="dark:hidden"
            />
            <ArrowRight
              size={18}
              color={stat.darkAccentColor}
              className="hidden dark:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseOverview() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalCertificates: 0,
    quizAverage: 0,
    quizTotal: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-dashboard?userId=1');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Could not load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Dados dinâmicos baseados na API
  const statsData = [
    {
      id: "courses",
      title: "Total Course",
      value: stats.totalCourses.toString(),
      icon: BookOpenText,
      bgColor: "bg-[#DDF7F5] dark:bg-[#1A2F2B]",
      borderColor: "border-[#17C8AD] dark:border-[#1ED4B0]",
      accentColor: "#17C8AD",
      darkAccentColor: "#1ED4B0",
      textColor: "text-[#17C8AD] dark:text-[#1ED4B0]",
      hoverBorderColor: "hover:border-[#14B39A] dark:hover:border-[#1BC49D]",
    },
    {
      id: "workshops",
      title: "Completed Courses",
      value: stats.completedCourses.toString(),
      icon: PlaySquare,
      bgColor: "bg-[#EFE9FF] dark:bg-[#2A2440]",
      borderColor: "border-[#805EFF] dark:border-[#9A7DFF]",
      accentColor: "#805EFF",
      darkAccentColor: "#9A7DFF",
      textColor: "text-[#805EFF] dark:text-[#9A7DFF]",
      hoverBorderColor: "hover:border-[#7354E6] dark:hover:border-[#8B6EF7]",
    },
    {
      id: "quiz",
      title: "Average Quiz Score",
      value: `${stats.quizAverage}/${stats.quizTotal}`,
      icon: Image,
      bgColor: "bg-[#FFF1E4] dark:bg-[#3D2B1A]",
      borderColor: "border-[#FF983B] dark:border-[#FFB366]",
      accentColor: "#FF983B",
      darkAccentColor: "#FFB366",
      textColor: "text-[#FF983B] dark:text-[#FFB366]",
      hoverBorderColor: "hover:border-[#E6863C] dark:hover:border-[#FF9F52]",
    },
    {
      id: "certificates",
      title: "Total Certificates",
      value: stats.totalCertificates.toString(),
      icon: Award,
      bgColor: "bg-[#E4F3FF] dark:bg-[#1A2E3D]",
      borderColor: "border-[#009EF7] dark:border-[#1DB5FF]",
      accentColor: "#009EF7",
      darkAccentColor: "#1DB5FF",
      textColor: "text-[#009EF7] dark:text-[#1DB5FF]",
      hoverBorderColor: "hover:border-[#008EDE] dark:hover:border-[#0AA6F0]",
    },
  ];

  if (loading) {
    return (
      <section className="w-full">
        <h2 className="font-poppins font-bold text-xl md:text-2xl text-[#0B0F1A] dark:text-[#E5E7EB] mb-6 transition-colors duration-200">
          Course Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[124px] bg-gray-200 dark:bg-gray-700 rounded-[14px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <h2 className="font-poppins font-bold text-xl md:text-2xl text-[#0B0F1A] dark:text-[#E5E7EB] mb-6 transition-colors duration-200">
          Course Overview
        </h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* Section Title */}
      <h2 className="font-poppins font-bold text-xl md:text-2xl text-[#0B0F1A] dark:text-[#E5E7EB] mb-6 transition-colors duration-200">
        Course Overview
      </h2>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  );
}