import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "../ui/ProfileDropdown";
import {
  Menu,
  Search,
  X,
  Edit,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  LogOut,
  Mails,
  Mailbox,
} from "lucide-react";

// Sidebar items for navigation
const sidebarItems = [
  { icon: Mails, label: "Inbox", key: "inbox", path: "/inbox" },
  { icon: Edit, label: "Compose", key: "compose", path: "/compose" }, // path dummy
  { icon: Star, label: "Starred", key: "starred", path: "/starred" },
  { icon: Send, label: "Sent", key: "sent", path: "/sent" },
  { icon: FileText, label: "Drafts", key: "drafts", path: "/drafts", count: 2 },
  { icon: Archive, label: "Archive", key: "archive", path: "/archive" },
  { icon: Trash2, label: "Trash", key: "trash", path: "/trash" },
]; // end of sidebarItems

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // useEffect for checking mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []); // end of useEffect

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  }; // end of handleSidebarToggle

  // Handle tab click for navigation
  const handleTabClick = (item) => {
    navigate(item.path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }; // end of handleTabClick

  // Get active tab based on current path
  const getActiveTab = () => {
    const found = sidebarItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return found ? found.key : "inbox";
  }; // end of getActiveTab

  const activeTab = getActiveTab();

  return (
    <div className="h-screen flex bg-slate-900 relative">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* end of Mobile Overlay */}

      {/* Sidebar */}
      <div
        className={`bg-slate-900 border-r border-slate-700 flex flex-col transition-all duration-300 z-50 ${
          isMobile
            ? `fixed left-0 top-0 h-full ${
                mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
              }`
            : sidebarCollapsed
            ? "w-16"
            : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Mailbox className="w-6 h-6 text-white" />
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <span className="text-white font-bold text-xl italic">
                  FLOWSENT
                </span>
              )}
            </div>
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        {/* end of Logo */}

        {/* Navigation Sidebar */}
        <nav
          className={`space-y-1 flex-1 py-4 ${
            sidebarCollapsed && !isMobile ? "px-2" : "px-4"
          }`}
        >
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${
                activeTab === item.key
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              } ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
              title={sidebarCollapsed && !isMobile ? item.label : ""}
            >
              <item.icon size={18} />
              {(!sidebarCollapsed || isMobile) && (
                <>
                  <span className="text-sm md:text-base">{item.label}</span>
                  {item.count && (
                    <div className="ml-auto bg-slate-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </div>
                  )}
                </>
              )}
              {sidebarCollapsed && !isMobile && item.count && (
                <div className="absolute -top-1 -right-1 bg-slate-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.count}
                </div>
              )}
            </button>
          ))}
        </nav>
        {/* end of Navigation Sidebar */}

        {/* Bottom Section Sidebar */}
        <div
          className={`border-t border-slate-700 ${
            sidebarCollapsed && !isMobile ? "p-2" : "p-4"
          }`}
        >
          {!sidebarCollapsed || isMobile ? (
            <button className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut size={16} />
              <span className="text-sm md:text-base">Logout</span>
            </button>
          ) : (
            <button
              className="w-full p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {/* end of Bottom Section Sidebar */}
      </div>
      {/* end of Sidebar */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar/Nav */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={handleSidebarToggle}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={
                isMobile
                  ? "Toggle menu"
                  : sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 md:mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <ProfileDropdown
              isOpen={profileOpen}
              onToggle={() => setProfileOpen(!profileOpen)}
            />
          </div>
        </div>
        {/* end of Topbar/Nav */}

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-white">{children}</div>
        {/* end of Main Content */}
      </div>
      {/* end of Main Content Area */}
    </div>
  );
};

export default MainLayout;
