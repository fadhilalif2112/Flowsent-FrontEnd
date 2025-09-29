import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  Archive,
  Trash2,
  Mail,
  FileText,
  MoreVertical,
  Download,
  CircleAlert,
  Inbox,
  Eye,
} from "lucide-react";
import { useEmails } from "../../context/EmailContext";
import LoadingIcon from "../ui/LoadingIcon";

const EmailItem = ({
  email,
  isSelected,
  onToggleSelect,
  folderName,
  onOpenDraft,
  mapFolderName,
}) => {
  const [isStarred, setIsStarred] = useState(email.flagged);
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [previewing, setPreviewing] = useState({});
  const [starring, setStarring] = useState(false);

  const {
    downloadAttachment,
    previewAttachment,
    markAsFlagged,
    markAsUnflagged,
    markAsRead,
    showNotification,
    moveEmail,
  } = useEmails();

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileActions = (e) => {
    e.stopPropagation();
    setShowMobileActions(!showMobileActions);
  };

  const handleStarToggle = async (e) => {
    e.stopPropagation();
    const prevStarred = isStarred;
    setIsStarred(!isStarred);
    setStarring(true);
    try {
      const folder =
        folderName === "starred"
          ? mapFolderName(email.folder)
          : mapFolderName(folderName);

      if (prevStarred) {
        await markAsUnflagged(folder, email.messageId);
        showNotification("success", "Email unstarred", 4000, "top-center");
      } else {
        await markAsFlagged(folder, email.messageId);
        showNotification("success", "Email starred", 4000, "top-center");
      }
    } catch (err) {
      console.error("Failed to toggle star:", err);
      setIsStarred(prevStarred);
      showNotification("error", "Failed to toggle star", 4000, "top-center");
    } finally {
      setStarring(false);
    }
  };

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    setLoadingAction("markasread");
    if (!email.seen) email.seen = true;
    try {
      const folder =
        folderName === "starred"
          ? mapFolderName(email.folder)
          : mapFolderName(folderName);

      await markAsRead(folder, email.messageId);
      showNotification("success", "Email marked as read", 4000, "bottom-left");
    } catch (err) {
      console.error("Failed to mark as read:", err);
      email.seen = false;
      showNotification("error", "Failed to mark as read", 4000, "bottom-left");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMove = async (e, targetFolder) => {
    e.stopPropagation();
    setLoadingAction(targetFolder);
    try {
      await moveEmail(folderName, [email.messageId], targetFolder);
      showNotification(
        "success",
        `Email moved to ${targetFolder}`,
        4000,
        "bottom-left"
      );
    } catch (err) {
      console.error(`Gagal memindahkan email ke ${targetFolder}:`, err);
      showNotification(
        "error",
        `Failed to move to ${targetFolder}`,
        4000,
        "bottom-left"
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownload = async (e, attachment) => {
    e.stopPropagation();
    setDownloading((prev) => ({ ...prev, [attachment.filename]: true }));
    try {
      await downloadAttachment(email.uid, attachment.filename);
      showNotification(
        "success",
        `Downloaded ${attachment.filename}`,
        4000,
        "top-center"
      );
    } catch (err) {
      console.error(`Failed to download ${attachment.filename}:`, err);
      showNotification(
        "error",
        `Failed to download ${attachment.filename}`,
        4000,
        "top-center"
      );
    } finally {
      setDownloading((prev) => ({ ...prev, [attachment.filename]: false }));
    }
  };

  // preview attachment
  const handlePreview = async (e, attachment) => {
    e.stopPropagation();
    setPreviewing((prev) => ({ ...prev, [attachment.filename]: true }));
    try {
      await previewAttachment(email.uid, attachment.filename);
    } catch (err) {
      console.error(`Failed to preview ${attachment.filename}:`, err);
      showNotification(
        "error",
        `Failed to preview ${attachment.filename}`,
        4000,
        "top-center"
      );
    } finally {
      setPreviewing((prev) => ({ ...prev, [attachment.filename]: false }));
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const emailDate = new Date(timestamp);
      if (isNaN(emailDate.getTime())) return "Unknown";
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
    return path.substring(1);
  };

  const handleEmailClick = () => {
    const currentFolder = getCurrentFolder();
    if (currentFolder === "draft") {
      onOpenDraft(email);
    } else {
      navigate(`/${currentFolder}/${email.uid}`, {
        state: { from: currentFolder },
      });
    }
  };

  // Helper kondisi
  const isInbox = folderName === "inbox";
  const isArchive = folderName === "archive";
  const isJunk = folderName === "junk";
  const isTrash = folderName === "deleted";
  const isSent = folderName === "sent";
  const isDraft = folderName === "draft";
  const isStarredpage = folderName === "starred";

  // Helper: folder yang tidak support flag/mark as read
  const disableFlags = isSent || isDraft || isTrash;

  // Komponen tombol yang bisa dipakai ulang
  const renderActions = () => {
    return (
      <>
        {/* Archive */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            isArchive
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-200 hover:text-amber-800"
          }`}
          title="Archive"
          onClick={(e) => !isArchive && handleMove(e, "archive")}
          disabled={isArchive || loadingAction === "archive"}
        >
          {loadingAction === "archive" ? (
            <LoadingIcon size="w-4 h-4" color="text-amber-800" />
          ) : (
            <Archive className="w-4 h-4" />
          )}
        </button>

        {/* Spam */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            isJunk
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-200 hover:text-red-600"
          }`}
          title="Spam"
          onClick={(e) => !isJunk && handleMove(e, "junk")}
          disabled={isJunk || loadingAction === "junk"}
        >
          {loadingAction === "junk" ? (
            <LoadingIcon size="w-4 h-4" color="text-red-600" />
          ) : (
            <CircleAlert className="w-4 h-4" />
          )}
        </button>

        {/* Delete */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            isTrash
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-200 hover:text-red-600"
          }`}
          title="Delete"
          onClick={(e) => !isTrash && handleMove(e, "deleted")}
          disabled={isTrash || loadingAction === "deleted"}
        >
          {loadingAction === "deleted" ? (
            <LoadingIcon size="w-4 h-4" color="text-red-600" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>

        {/* Move to Inbox */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            isInbox || isSent || isDraft
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-200 hover:text-blue-600"
          }`}
          title="Move to Inbox"
          onClick={(e) =>
            !isInbox && !isSent && !isDraft && handleMove(e, "inbox")
          }
          disabled={isInbox || isSent || isDraft || loadingAction === "inbox"}
        >
          {loadingAction === "inbox" ? (
            <LoadingIcon size="w-4 h-4" color="text-blue-600" />
          ) : (
            <Inbox className="w-4 h-4" />
          )}
        </button>

        {/* Mark as Read */}
        <button
          className={`p-2 rounded-lg transition-colors ${
            disableFlags
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-200 hover:text-green-400"
          }`}
          title="Mark as read"
          onClick={(e) => !disableFlags && handleMarkAsRead(e)}
          disabled={disableFlags || loadingAction === "markasread"}
        >
          {loadingAction === "markasread" ? (
            <LoadingIcon size="w-4 h-4" color="text-green-400" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
        </button>
      </>
    );
  };

  return (
    <div
      className={`
        px-3 md:px-6 py-3 md:py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start md:items-center space-x-2 md:space-x-4 group border-b border-gray-100
        ${!email.seen ? "bg-slate-100 font-bold" : "bg-white"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEmailClick}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect({ messageId: email.messageId })}
        className="hidden md:block w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex flex-col items-center space-y-1">
        {!disableFlags && (
          <button
            onClick={handleStarToggle}
            disabled={starring}
            className={`flex-shrink-0 mt-1 md:mt-0 transition-colors group-hover:text-gray-400 ${
              starring
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-300 hover:text-yellow-500"
            }`}
          >
            {starring ? (
              <LoadingIcon
                size="w-4 h-4 md:w-5 md:h-5"
                color="text-yellow-500"
              />
            ) : isStarred ? (
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        )}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect({ messageId: email.messageId })}
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
        {/* Mobile actions */}
        <div className="md:hidden">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
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
                <span className="bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded-full ml-2">
                  NEW
                </span>
              )}
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
          {showMobileActions && (
            <div className="mt-2 bg-gray-50 rounded-lg p-2 flex items-center justify-around border">
              {renderActions(true)}
            </div>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-gray-900 ${
                !email.seen ? "font-semibold" : "font-medium"
              }`}
            >
              {email.sender}
            </span>

            <div className="flex items-center space-x-1">
              {isHovered ? (
                <div className="flex items-center space-x-1">
                  {renderActions()}
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
                onClick={(e) => e.stopPropagation()} // jangan buka email
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
                  onClick={(e) => handlePreview(e, attachment)}
                  disabled={previewing[attachment.filename]}
                  className={`p-1 rounded transition-colors ${
                    previewing[attachment.filename]
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-blue-200"
                  }`}
                  title="Preview"
                >
                  {previewing[attachment.filename] ? (
                    <LoadingIcon size="w-3 h-3" color="text-blue-500" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>

                <button
                  onClick={(e) => handleDownload(e, attachment)}
                  disabled={downloading[attachment.filename]}
                  className={`p-1 rounded transition-colors ${
                    downloading[attachment.filename]
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-blue-200"
                  }`}
                  title="Download"
                >
                  {downloading[attachment.filename] ? (
                    <LoadingIcon size="w-3 h-3" color="text-blue-500" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
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
