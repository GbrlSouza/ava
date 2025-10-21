import {
  Home,
  Newspaper,
  Megaphone,
  ChevronDown,
  Plus,
  Settings,
  Info,
  Power,
} from "lucide-react";

export default function LeftSidebar() {
  return (
    <div
      className="w-64 bg-[#001D2E] dark:bg-[#0D1117] text-white flex flex-col fixed left-0 top-0 h-full font-onest md:block hidden transition-colors duration-200"
      style={{
        paddingTop: "32px",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingBottom: "28px",
      }}
    >
      {/* Brand Section */}
      <div className="mb-5">
        <h1
          className="font-montserrat font-bold text-lg text-white"
          style={{ letterSpacing: "-0.25px" }}
        >
          Sharecourse
        </h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center mb-7 cursor-pointer hover:bg-white hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 rounded-lg p-2 -m-2 transition-colors duration-200">
        <img
          src="https://images.pexels.com/photos/8555232/pexels-photo-8555232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Marcelino Hwang"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <div className="font-onest font-semibold text-[13px] text-white">
            Marcelino Hwang
          </div>
          <div
            className="font-onest font-normal text-[11px] text-white"
            style={{ opacity: "0.5" }}
          >
            heymarcel@email.com
          </div>
        </div>
        <ChevronDown
          size={18}
          className="text-white opacity-60 hover:opacity-80 transition-opacity"
        />
      </div>

      {/* Main Menu Section */}
      <div className="mb-9">
        <h2
          className="font-onest font-semibold text-[11px] text-white mb-3"
          style={{ opacity: "0.6" }}
        >
          Main Menu
        </h2>
        <div className="space-y-3">
          {/* Active Menu Item - My Progress */}
          <div
            className="flex items-center bg-[#38C5B0] dark:bg-[#30C4B5] rounded-md px-4 py-3 transition-colors duration-150 ease-out hover:bg-[#32B5A1] dark:hover:bg-[#29AF9F] active:bg-[#2DA496] dark:active:bg-[#239E8F] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#38C5B0]"
            tabIndex="0"
          >
            <Home size={18} className="text-white mr-4" />
            <span className="font-onest font-medium text-[13px] text-white">
              My Progress
            </span>
          </div>

          {/* Inactive Menu Items */}
          <div
            className="flex items-center px-4 py-3 rounded-md transition-colors duration-150 hover:bg-white hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-15 active:bg-white active:bg-opacity-15 dark:active:bg-white dark:active:bg-opacity-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#38C5B0] group"
            tabIndex="0"
          >
            <Newspaper
              size={18}
              className="text-white opacity-60 mr-4 group-hover:opacity-80 transition-opacity"
            />
            <span className="font-onest font-normal text-[13px] text-white opacity-60 group-hover:opacity-80 transition-opacity">
              Explore Courses
            </span>
          </div>

          <div
            className="flex items-center px-4 py-3 rounded-md transition-colors duration-150 hover:bg-white hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-15 active:bg-white active:bg-opacity-15 dark:active:bg-white dark:active:bg-opacity-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#38C5B0] group"
            tabIndex="0"
          >
            <Megaphone
              size={18}
              className="text-white opacity-60 mr-4 group-hover:opacity-80 transition-opacity"
            />
            <span className="font-onest font-normal text-[13px] text-white opacity-60 group-hover:opacity-80 transition-opacity">
              Explore Workshops
            </span>
          </div>
        </div>
      </div>

      {/* Labels Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-onest font-semibold text-[11px] text-white"
            style={{ opacity: "0.6" }}
          >
            Labels
          </h2>
          <button className="w-6 h-6 border border-[#2F4C65] dark:border-[#4A5568] rounded flex items-center justify-center hover:bg-white hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 hover:border-[#4A6A8A] dark:hover:border-[#6B7280] active:bg-white active:bg-opacity-10 dark:active:bg-white dark:active:bg-opacity-15 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#38C5B0]">
            <Plus
              size={14}
              className="text-white opacity-70 hover:opacity-90 transition-opacity"
            />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 rounded p-1 -m-1 transition-colors duration-150">
            <div className="w-2.5 h-2.5 bg-[#006DFF] dark:bg-[#3B82F6] rounded-full mr-4"></div>
            <span className="font-onest font-normal text-[12px] text-white">
              UI Design
            </span>
          </div>
          <div className="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 rounded p-1 -m-1 transition-colors duration-150">
            <div className="w-2.5 h-2.5 bg-[#794CFF] dark:bg-[#8B5CF6] rounded-full mr-4"></div>
            <span className="font-onest font-normal text-[12px] text-white">
              UX Design
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Utility Links */}
      <div className="mt-60">
        <hr className="border-[#0B3144] dark:border-[#1F2937] border-t mb-6" />
        <div className="space-y-3">
          <div
            className="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 active:bg-white active:bg-opacity-10 dark:active:bg-white dark:active:bg-opacity-15 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#38C5B0] rounded px-2 py-1 group"
            tabIndex="0"
          >
            <Settings
              size={18}
              className="text-white opacity-60 mr-4 group-hover:opacity-80 transition-opacity"
            />
            <span className="font-onest font-normal text-[12px] text-white opacity-60 group-hover:opacity-80 transition-opacity">
              System Settings
            </span>
          </div>

          <div
            className="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 active:bg-white active:bg-opacity-10 dark:active:bg-white dark:active:bg-opacity-15 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#38C5B0] rounded px-2 py-1 group"
            tabIndex="0"
          >
            <Info
              size={18}
              className="text-white opacity-60 mr-4 group-hover:opacity-80 transition-opacity"
            />
            <span className="font-onest font-normal text-[12px] text-white opacity-60 group-hover:opacity-80 transition-opacity">
              Help Center
            </span>
          </div>

          <div
            className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-[#062236] dark:hover:bg-[#1F2937] active:bg-[#0A1E2D] dark:active:bg-[#111827] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#38C5B0]"
            tabIndex="0"
          >
            <Power size={18} className="text-white mr-4" />
            <span className="font-onest font-medium text-[12px] text-white">
              Logout Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}