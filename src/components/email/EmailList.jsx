import React, { useState } from "react";
import EmailItem from "./EmailItem";
import {
  Archive,
  Trash2,
  Mail,
  Plus,
  RefreshCcw,
  CircleAlert,
  Inbox,
} from "lucide-react";
import ComposeModal from "../compose/ComposeModal";
import { useEmails } from "../../context/EmailContext";
import LoadingIcon from "../ui/LoadingIcon";

const EmailList = ({ emails, folderName }) => {
  const {
    refreshEmails,
    markAsRead,
    moveEmail,
    showNotification,
    deletePermanent,
  } = useEmails();

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [composeMode, setComposeMode] = useState("new");

  // kondisi folder
  const isInbox = folderName === "inbox";
  const isArchive = folderName === "archive";
  const isJunk = folderName === "junk";
  const isTrash = folderName === "deleted";
  const isSent = folderName === "sent";
  const isDraft = folderName === "draft";
  const isStarred = folderName === "starred";

  // folder yang tidak support mark-as-read
  const disableMarkAsRead = isSent || isDraft || isTrash;

  const mapFolderName = (folder) => {
    if (!folder) return "inbox";
    const normalized = folder.toLowerCase();
    const folderMap = {
      inbox: "inbox",
      "sent items": "sent",
      drafts: "draft",
      "deleted items": "deleted",
      "junk mail": "junk",
      archive: "archive",
    };
    return folderMap[normalized] || "inbox";
  };

  const handleOpenDraft = (email) => {
    setDraftData(email);
    setComposeMode("draft");
    setIsComposeOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      const allEmails = emails.map((email) => ({ messageId: email.messageId }));
      setSelectedEmails(allEmails);
    }
    setSelectAll(!selectAll);
  };

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) => {
      const exists = prev.find((e) => e.messageId === email.messageId);
      let newSelection;
      if (exists) {
        newSelection = prev.filter((e) => e.messageId !== email.messageId);
      } else {
        newSelection = [...prev, { messageId: email.messageId }];
      }
      setSelectAll(newSelection.length === emails.length);
      return newSelection;
    });
  };

  const handleRefresh = async () => {
    try {
      setLoadingAction("refresh");
      await refreshEmails();
      showNotification("success", "Emails refreshed", 3000, "top-center");
    } catch (err) {
      console.error("Failed to refresh emails:", err);
      showNotification("error", "Failed to refresh emails", 3000, "top-center");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMarkAsRead = async () => {
    setLoadingAction("markAsRead");
    const prevState = [...emails];
    try {
      emails.forEach((email) => {
        if (selectedEmails.some((sel) => sel.messageId === email.messageId)) {
          email.seen = true;
        }
      });

      for (const sel of selectedEmails) {
        const email = emails.find((e) => e.messageId === sel.messageId);
        if (!email) continue;
        const folder =
          folderName === "starred"
            ? mapFolderName(email.folder)
            : mapFolderName(folderName);
        await markAsRead(folder, sel.messageId);
      }

      showNotification(
        "success",
        "Selected emails marked as read",
        4000,
        "bottom-left"
      );
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      showNotification(
        "error",
        "Failed to mark emails as read",
        4000,
        "bottom-left"
      );
      // rollback
      prevState.forEach((prevEmail) => {
        const idx = emails.findIndex((e) => e.uid === prevEmail.uid);
        if (idx !== -1) {
          emails[idx].seen = prevEmail.seen;
        }
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMove = async (targetFolder) => {
    setLoadingAction(`move:${targetFolder}`);
    try {
      const messageIds = selectedEmails.map((sel) => sel.messageId);
      await moveEmail(folderName, messageIds, targetFolder);
      showNotification(
        "success",
        `Moved to ${targetFolder}`,
        4000,
        "bottom-left"
      );
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (err) {
      console.error(`Failed to move emails to ${targetFolder}:`, err);
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

  const handleDeletePermanent = async () => {
    setLoadingAction("delete");
    try {
      const messageIds = selectedEmails.map((sel) => sel.messageId);
      await deletePermanent(messageIds);
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Failed to permanently delete:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleComposeClick = () => {
    setDraftData(null);
    setComposeMode("new");
    setIsComposeOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4 md:w-5 md:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            {selectedEmails.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedEmails.length} selected
              </span>
            )}
            {isTrash && selectedEmails.length > 0 && (
              <button
                onClick={handleDeletePermanent}
                className="ml-2 text-sm font-medium text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                disabled={loadingAction === "delete"}
              >
                {loadingAction === "delete" ? (
                  <LoadingIcon size="w-3 h-3" color="text-red-600" />
                ) : (
                  "Delete Forever"
                )}
              </button>
            )}

            {/* Refresh */}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-blue-400 disabled:opacity-50"
              onClick={handleRefresh}
              title="Refresh"
              disabled={loadingAction === "refresh"}
            >
              {loadingAction === "refresh" ? (
                <LoadingIcon
                  size="w-4 h-4 md:w-5 md:h-5"
                  color="text-blue-600"
                />
              ) : (
                <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Archive */}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800 disabled:opacity-50"
              title="Archive"
              disabled={
                isArchive ||
                isStarred ||
                selectedEmails.length === 0 ||
                loadingAction === "move:archive"
              }
              onClick={() => handleMove("archive")}
            >
              {loadingAction === "move:archive" ? (
                <LoadingIcon
                  size="w-4 h-4 md:w-5 md:h-5"
                  color="text-amber-800"
                />
              ) : (
                <Archive className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Spam */}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600 disabled:opacity-50"
              title="Spam"
              disabled={
                isJunk ||
                isStarred ||
                selectedEmails.length === 0 ||
                loadingAction === "move:junk"
              }
              onClick={() => handleMove("junk")}
            >
              {loadingAction === "move:junk" ? (
                <LoadingIcon
                  size="w-4 h-4 md:w-5 md:h-5"
                  color="text-red-600"
                />
              ) : (
                <CircleAlert className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Trash */}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600 disabled:opacity-50"
              title="Move to Trash"
              disabled={
                isTrash ||
                isStarred ||
                selectedEmails.length === 0 ||
                loadingAction === "move:deleted"
              }
              onClick={() => handleMove("deleted")}
            >
              {loadingAction === "move:deleted" ? (
                <LoadingIcon
                  size="w-4 h-4 md:w-5 md:h-5"
                  color="text-red-600"
                />
              ) : (
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Move to Inbox */}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-blue-600 disabled:opacity-50"
              title="Move to Inbox"
              disabled={
                isInbox ||
                isSent ||
                isDraft ||
                isStarred ||
                selectedEmails.length === 0 ||
                loadingAction === "move:inbox"
              }
              onClick={() => handleMove("inbox")}
            >
              {loadingAction === "move:inbox" ? (
                <LoadingIcon
                  size="w-4 h-4 md:w-5 md:h-5"
                  color="text-blue-600"
                />
              ) : (
                <Inbox className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Mark as Read */}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400 disabled:opacity-50"
              onClick={handleMarkAsRead}
              disabled={
                disableMarkAsRead ||
                selectedEmails.length === 0 ||
                loadingAction === "markAsRead"
              }
              title="Mark as Read"
            >
              {loadingAction === "markAsRead" ? (
                <LoadingIcon
                  size="w-4 h-4 md:w-5 md:h-5"
                  color="text-green-400"
                />
              ) : (
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>

          {/* Compose */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium flex items-center space-x-1 text-sm md:text-base"
            onClick={handleComposeClick}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Compose</span>
          </button>
        </div>
      </div>

      {/* Email List */}
      <div>
        {emails.length === 0 ? (
          <div className="flex flex-col md:flex-row items-center justify-center py-24 px-6 space-y-6 md:space-y-0 md:space-x-10">
            <div className="flex space-x-3 text-gray-300">
              <Mail className="w-14 h-14" />
              <Archive className="w-14 h-14" />
              <Trash2 className="w-14 h-14" />
            </div>
            <div className="text-center md:text-left max-w-sm">
              <h2 className="text-2xl font-bold text-gray-700">
                No messages found
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                This {folderName || "folder"} doesn’t contain any emails at the
                moment.
              </p>
              <p className="mt-4 text-xs text-gray-400 italic">
                Try checking other folders or come back later.
              </p>
            </div>
          </div>
        ) : (
          emails.map((email) => (
            <EmailItem
              key={email.messageId}
              email={email}
              isSelected={selectedEmails.some(
                (sel) => sel.messageId === email.messageId
              )}
              onToggleSelect={toggleEmailSelection}
              folderName={folderName}
              onOpenDraft={handleOpenDraft}
              mapFolderName={mapFolderName}
            />
          ))
        )}
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        draft={draftData}
        mode={composeMode}
      />
    </div>
  );
};

export default EmailList;
