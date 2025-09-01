import React from "react";
import {
  ArrowLeft,
  Reply,
  Forward,
  Trash2,
  Star,
  Download,
  FileText,
  Image,
  Video,
  Music,
  Archive,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const EmailDetail = ({ email, loading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous folder from state or default to inbox
  const previousFolder = location.state?.from || "inbox";

  const handleBack = () => {
    navigate(`/${previousFolder}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.toLowerCase().split(".").pop();
    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "webp":
        return <Image className="w-5 h-5" />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <Video className="w-5 h-5" />;
      case "mp3":
      case "wav":
      case "flac":
        return <Music className="w-5 h-5" />;
      case "zip":
      case "rar":
      case "7z":
        return <Archive className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex-1 bg-white">
        {/* Header skeleton */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-full h-4 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Email not found
          </h3>
          <p className="text-gray-500">
            The email you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <button
              onClick={handleBack}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {email.subject}
            </h1>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Reply"
            >
              <Reply className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Forward"
            >
              <Forward className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                email.flagged
                  ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
              title="Star"
            >
              <Star
                className={`w-5 h-5 ${email.flagged ? "fill-current" : ""}`}
              />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-4 sm:p-6">
        {/* Email Info */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            {/* Label + Sender */}
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-sm font-medium text-gray-500 w-16 flex-shrink-0">
                From:
              </span>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {email.sender.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {email.sender}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {email.senderEmail}
                </div>
              </div>
            </div>

            {/* Date on the right */}
            <span className="text-sm text-gray-700">
              {email.timestamp.split(",")[0]}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0">
            <span className="text-sm font-medium text-gray-500 w-16 flex-shrink-0">
              To:
            </span>
            <div className="flex flex-wrap gap-2">
              {email.recipients.map((recipient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {recipient.email}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="mb-6">
          <div className="prose prose-sm sm:prose max-w-none">
            {email.body?.html ? (
              <div
                dangerouslySetInnerHTML={{ __html: email.body.html }}
                className="break-words"
              />
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 break-words">
                {email.body?.text}
              </div>
            )}
          </div>
        </div>

        {/* Attachments */}
        {email.rawAttachments && email.rawAttachments.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Attachments ({email.rawAttachments.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {email.rawAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex-shrink-0 text-gray-400">
                    {getFileIcon(attachment.filename)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {attachment.filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </div>
                  </div>
                  <a
                    href={attachment.download_url}
                    download={attachment.filename}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDetail;
