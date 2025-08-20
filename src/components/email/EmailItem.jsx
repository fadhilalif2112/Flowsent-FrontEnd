import React from "react";
import {
  Star,
  Archive,
  Trash2,
  Mail,
  Clock,
  FileText,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

// Email Item Component
const EmailItem = ({ email, isSelected, onToggleSelect }) => {
  const [isStarred, setIsStarred] = useState(email.starred);
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  const handleStarToggle = (e) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  const toggleMobileActions = (e) => {
    e.stopPropagation();
    setShowMobileActions(!showMobileActions);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const emailDate = new Date(timestamp);
    const diffInHours = (now - emailDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[emailDate.getMonth()]} ${emailDate.getDate()}`;
    }
  };

  return (
    <div
      className={`
        px-3 md:px-6 py-3 md:py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start md:items-center space-x-2 md:space-x-4 group border-b border-gray-100
        ${!email.read ? "bg-white" : "bg-white"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox - Hidden on mobile by default */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(email.id)}
        className="hidden md:block w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Star button */}
      <button
        onClick={handleStarToggle}
        className="text-gray-300 hover:text-yellow-500 transition-colors group-hover:text-gray-400 flex-shrink-0 mt-1 md:mt-0"
      >
        {isStarred ? (
          <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
        ) : (
          <Star className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`text-sm ${
                    !email.read
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-700"
                  }`}
                >
                  {email.sender}
                </span>
                {email.isNew && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3
                  className={`text-sm ${
                    !email.read
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-800"
                  } truncate flex-1`}
                >
                  {email.subject}
                </h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(email.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate mt-1">
                {email.preview}
              </p>
            </div>
            <button
              onClick={toggleMobileActions}
              className="p-2 -m-2 text-gray-400 hover:text-gray-600 ml-2"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Actions Dropdown */}
          {showMobileActions && (
            <div className="mt-2 bg-gray-50 rounded-lg p-2 flex items-center justify-around border">
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                title="Archive"
                onClick={(e) => e.stopPropagation()}
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                title="Delete"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                title="Mark as read"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                title="Snooze"
                onClick={(e) => e.stopPropagation()}
              >
                <Clock className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(email.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
                title="Select"
              />
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-3">
              <span
                className={`text-gray-900 ${
                  !email.read ? "font-semibold" : "font-medium"
                }`}
              >
                {email.sender}
              </span>
              {email.isNew && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>

            {/* Show action buttons on hover, otherwise show date */}
            <div className="flex items-center space-x-1">
              {isHovered ? (
                <div className="flex items-center space-x-1">
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400"
                    title="Mark as read"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500 flex-shrink-0">
                  {formatTime(email.timestamp)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <h3
              className={`text-sm ${
                !email.read ? "font-semibold text-gray-900" : "text-gray-800"
              }`}
            >
              {email.subject}
            </h3>
            <span className="text-sm text-gray-500">–</span>
            <p className="text-sm text-gray-600 truncate flex-1">
              {email.preview}
            </p>
          </div>
        </div>

        {/* Attachments - shown on both mobile and desktop */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="flex items-center space-x-2 mt-2">
            {email.attachments.map((attachment, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 bg-red-50 text-red-700 text-xs px-2 py-1 rounded-md border border-red-200"
              >
                <FileText className="w-3 h-3" />
                <span className="hidden sm:inline">{attachment}</span>
                <span className="sm:hidden">📎</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailItem;
