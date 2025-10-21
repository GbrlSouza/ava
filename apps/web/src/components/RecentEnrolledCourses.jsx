import { useState, useEffect, useRef } from "react";

function ProgressBar({ percentage, isHovered }) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isHovered && !hasAnimated) {
      setAnimatedWidth(0);
      const timer = setTimeout(() => {
        setAnimatedWidth(percentage);
        setHasAnimated(true);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!hasAnimated) {
      setAnimatedWidth(percentage);
      setHasAnimated(true);
    }
  }, [isHovered, percentage, hasAnimated]);

  return (
    <div
      className="w-full h-2 bg-[#E5F5F2] dark:bg-[#374151] rounded-full overflow-hidden transition-colors duration-200"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Course progress: ${percentage}%`}
    >
      <div
        className="h-full bg-[#21B89A] dark:bg-[#34D399] rounded-full transition-all duration-300 ease-out"
        style={{ width: `${animatedWidth}%` }}
      />
    </div>
  );
}

function CourseCard({ course, onCourseClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCardClick = () => {
    if (onCourseClick) {
      onCourseClick(course);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        bg-white dark:bg-[#1E1E1E] rounded-[10px] border border-[#E3E8F4] dark:border-[#2A2A2A] cursor-pointer
        transition-all duration-200 ease-out
        ${isHovered ? "transform -translate-y-0.5 shadow-lg dark:shadow-2xl" : ""}
      `}
      style={{
        boxShadow: isHovered
          ? document.documentElement.classList.contains("dark")
            ? "0 8px 25px rgba(255, 255, 255, 0.05)"
            : "0 6px 20px rgba(32, 50, 89, 0.05)"
          : "none",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={course.thumbnail_url}
          alt={`${course.title} course thumbnail`}
          className={`
            w-full h-full object-cover rounded-t-[10px]
            transition-transform duration-200 ease-out
            ${isHovered ? "scale-102" : "scale-100"}
          `}
          style={{ transform: isHovered ? "scale(1.02)" : "scale(1)" }}
        />

        {/* Tech Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {course.category_name && (
            <div
              className="w-8 h-8 rounded-full border border-[#E3E8F4] dark:border-[#374151] flex items-center justify-center transition-colors duration-200"
              style={{ 
                backgroundColor: course.category_color || '#006DFF',
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)" 
              }}
              aria-label={`Course category: ${course.category_name}`}
            >
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="px-4 pb-5">
        {/* Course Meta - 16px gap from thumbnail */}
        <div className="pt-4 mb-3">
          {/* Author */}
          <p
            className="font-inter text-xs text-[#7A8198] dark:text-[#9CA3AF] mb-1 transition-colors duration-200"
            style={{ letterSpacing: "0.1px" }}
          >
            A Course by {course.instructor}
          </p>

          {/* Course Title */}
          <h3
            className="font-montserrat font-semibold text-base text-black dark:text-[#E5E7EB] leading-[125%] line-clamp-2 transition-colors duration-200"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.title}
          </h3>
        </div>

        {/* Progress Summary Row - 12px gap from meta text */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-montserrat font-semibold text-xs text-black dark:text-[#E5E7EB] transition-colors duration-200">
            {course.progress}%
          </span>
          <span className="font-montserrat text-xs text-[#9BA2B3] dark:text-[#6B7280] text-right transition-colors duration-200">
            {course.completed_lessons}/{course.total_lessons} lessons
          </span>
        </div>

        {/* Progress Bar - 6px gap from summary row */}
        <ProgressBar percentage={course.progress} isHovered={isHovered} />
      </div>
    </div>
  );
}

export default function RecentEnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-dashboard?userId=1');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCourses(result.data.enrolledCourses);
      } else {
        throw new Error(result.error || 'Failed to fetch enrolled courses');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('Could not load enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    // Por enquanto apenas loggar, mais tarde pode navegar para página do curso
    console.log('Course clicked:', course);
  };

  const handleViewAll = () => {
    // Por enquanto apenas loggar, mais tarde pode navegar para página de todos os cursos
    console.log('View all courses clicked');
  };

  if (loading) {
    return (
      <section className="w-full">
        <div className="max-w-[1280px] mx-auto bg-white dark:bg-[#1E1E1E] border border-[#E7ECF3] dark:border-[#2A2A2A] rounded-xl p-6 md:p-8 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] h-64 bg-gray-200 dark:bg-gray-700 rounded-[10px] animate-pulse"
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
            <h2 className="font-inter font-semibold text-lg text-black dark:text-[#E5E7EB] transition-colors duration-200">
              Recent Enrolled Course
            </h2>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchEnrolledCourses}
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
            className="font-inter font-semibold text-lg text-black dark:text-[#E5E7EB] transition-colors duration-200"
            style={{ letterSpacing: "-0.01em" }}
          >
            Recent Enrolled Course ({courses.length})
          </h2>
          <button
            onClick={handleViewAll}
            className="
              px-4 py-2 rounded-full text-sm font-inter font-medium
              bg-[#E4FAF1] bg-opacity-70 text-[#23B4A0]
              dark:bg-[#1A332B] dark:bg-opacity-80 dark:text-[#34D399]
              hover:bg-[#D6F5EC] hover:text-[#189A84]
              dark:hover:bg-[#1F3D33] dark:hover:text-[#22C55E]
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-[#23B4A0] focus:ring-opacity-50
            "
            style={{ borderRadius: "4px" }}
          >
            View All
          </button>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="flex flex-wrap gap-4 md:gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <CourseCard course={course} onCourseClick={handleCourseClick} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              You haven't enrolled in any courses yet
            </p>
            <button
              onClick={() => console.log('Browse courses clicked')}
              className="px-6 py-3 bg-[#30C4B5] hover:bg-[#29AF9F] text-white rounded-lg font-medium transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </section>
  );
}