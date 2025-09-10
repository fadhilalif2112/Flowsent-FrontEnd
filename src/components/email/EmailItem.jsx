import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import yang hilang
import {
  Star,
  Archive,
  Trash2,
  Mail,
  FileText,
  MoreVertical,
  Download,
  CircleAlert,
} from "lucide-react";
import { useEmails } from "../../context/EmailContext";

const EmailItem = ({ email, isSelected, onToggleSelect, folderName }) => {
  const [isStarred, setIsStarred] = useState(email.flagged); // flagged dari backend
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  const {
    downloadAttachment,
    markAsFlagged,
    markAsUnflagged,
    markAsRead,
    moveEmail,
  } = useEmails();

  // Hooks yang diperlukan untuk navigasi
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileActions = (e) => {
    e.stopPropagation();
    setShowMobileActions(!showMobileActions);
  };

  const handleStarToggle = async (e) => {
    e.stopPropagation();

    // simpan state sebelumnya
    const prevStarred = isStarred;

    // langsung toggle UI
    setIsStarred(!isStarred);

    try {
      if (prevStarred) {
        // sebelumnya starred → unflag
        await markAsUnflagged(folderName, email.uid);
        console.log("Unflagged berhasil");
      } else {
        // sebelumnya unstarred → flag
        await markAsFlagged(folderName, email.uid);
        console.log("Flagged berhasil");
      }
    } catch (err) {
      console.error("Failed to toggle star:", err);
      // rollback kalau gagal
      setIsStarred(prevStarred);
    }
  };

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();

    if (!email.seen) {
      email.seen = true;
    }

    try {
      await markAsRead(folderName, email.uid);
      console.log("Email berhasil ditandai sebagai read");
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // rollback jika gagal
      email.seen = false;
    }
  };

  const handleMove = async (e, targetFolder) => {
    e.stopPropagation();

    try {
      await moveEmail(folderName, [email.uid], targetFolder);
      console.log(`Email berhasil dipindahkan ke ${targetFolder}`);
    } catch (err) {
      console.error(`Gagal memindahkan email ke ${targetFolder}:`, err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown"; // null atau kosong

    try {
      const emailDate = new Date(timestamp);
      if (isNaN(emailDate.getTime())) return "Unknown"; // cek invalid date

      const now = new Date();
      const diffInHours = (now - emailDate) / (1000 * 60 * 60);

      if (diffInHours < 1) return "now";
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d`;

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
    } catch {
      return "Unknown";
    }
  };

  const getCurrentFolder = () => {
    const path = location.pathname;
    if (path === "/") return "inbox";
    return path.substring(1); // Remove leading slash
  };

  const handleEmailClick = () => {
    const currentFolder = getCurrentFolder();
    navigate(`/${currentFolder}/${email.uid}`, {
      state: { from: currentFolder },
    });
  };

  return (
    <div
      className={`
        px-3 md:px-6 py-3 md:py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start md:items-center space-x-2 md:space-x-4 group border-b border-gray-100
        ${!email.seen ? "bg-slate-100 font-bold" : "bg-white"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEmailClick} // Event handler sudah benar
    >
      {/* Checkbox - Hidden on mobile */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(email.uid)}
        className="hidden md:block w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex flex-col items-center space-y-1">
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

        {/* Mobile Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(email.uid)}
          className="block md:hidden w-4 h-4 mt-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
          title="Select"
        />
      </div>
      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-medium">
          {email.sender.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`text-sm ${
                    !email.seen
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-700"
                  }`}
                >
                  {email.sender}
                </span>
                {!email.seen && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3
                  className={`text-sm ${
                    !email.seen
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
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800"
                title="Archive"
                onClick={(e) => handleMove(e, "archive")}
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                title="Spam"
                onClick={(e) => handleMove(e, "junk")}
              >
                <CircleAlert className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                title="Delete"
                onClick={(e) => handleMove(e, "deleted")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400"
                title="Mark as read"
                onClick={handleMarkAsRead}
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-3">
              <span
                className={`text-gray-900 ${
                  !email.seen ? "font-semibold" : "font-medium"
                }`}
              >
                {email.sender}
              </span>
              {!email.seen && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>

            {/* Hover actions / timestamp */}
            <div className="flex items-center space-x-1">
              {isHovered ? (
                <div className="flex items-center space-x-1">
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800"
                    title="Archive"
                    onClick={(e) => handleMove(e, "archive")}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                    title="Spam"
                    onClick={(e) => handleMove(e, "junk")}
                  >
                    <CircleAlert className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                    title="Delete"
                    onClick={(e) => handleMove(e, "deleted")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400"
                    title="Mark as read"
                    onClick={handleMarkAsRead}
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
                !email.seen ? "font-semibold text-gray-900" : "text-gray-800"
              }`}
            >
              {email.subject}
            </h3>
            <span className="text-sm text-gray-500">—</span>
            <p className="text-sm text-gray-600 truncate flex-1">
              {email.preview}
            </p>
          </div>
        </div>

        {/* Attachments */}
        {email.rawAttachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {email.rawAttachments.map((attachment, index) => (
              <div
                key={index}
                className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent email click when clicking attachment
              >
                <FileText className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {attachment.filename}
                </span>
                {attachment.size && (
                  <span className="text-blue-500 hidden sm:inline">
                    ({Math.round(attachment.size / 1024)}KB)
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAttachment(email.uid, attachment.filename);
                  }}
                  className="p-1 hover:bg-blue-200 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailItem;
