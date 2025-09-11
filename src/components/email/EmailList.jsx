import React, { useState } from "react";
import EmailItem from "./EmailItem";
import {
  Archive,
  Trash2,
  Mail,
  Plus,
  RefreshCcw,
  CircleAlert,
} from "lucide-react";
import ComposeModal from "../compose/ComposeModal";
import { useEmails } from "../../context/EmailContext";

const EmailList = ({ emails, folderName }) => {
  const { refreshEmails, markAsRead, moveEmail } = useEmails();

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [draftData, setDraftData] = useState(null);

  const handleOpenDraft = (email) => {
    setDraftData(email);
    setIsComposeOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      const allIds = emails.map((email) => email.uid);
      setSelectedEmails(allIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleEmailSelection = (emailId) => {
    setSelectedEmails((prev) => {
      const newSelection = prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId];

      setSelectAll(newSelection.length === emails.length);
      return newSelection;
    });
  };

  // ✅ Optimistic Mark as Read
  const handleMarkAsRead = async () => {
    const prevState = [...emails];

    try {
      emails.forEach((email) => {
        if (selectedEmails.includes(email.uid)) {
          email.seen = true;
        }
      });

      for (const emailId of selectedEmails) {
        await markAsRead(folderName, emailId);
      }

      setSelectedEmails([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // rollback
      prevState.forEach((prevEmail) => {
        const idx = emails.findIndex((e) => e.uid === prevEmail.uid);
        if (idx !== -1) {
          emails[idx].seen = prevEmail.seen;
        }
      });
    }
  };

  // ✅ Move emails to folder (Archive / Trash)
  const handleMove = async (targetFolder) => {
    try {
      await moveEmail(folderName, selectedEmails, targetFolder);
      console.log("Move emails success");

      // reset selection
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (err) {
      console.error(`Failed to move emails to ${targetFolder}:`, err);
    }
  };

  const handleComposeClick = () => setIsComposeOpen(true);

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
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-blue-400"
              onClick={refreshEmails}
              title="Refresh"
            >
              <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800"
              title="Archive"
              disabled={selectedEmails.length === 0}
              onClick={() => handleMove("archive")}
            >
              <Archive className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
              title="Spam"
              disabled={selectedEmails.length === 0}
              onClick={() => handleMove("junk")}
            >
              <CircleAlert className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
              title="Move to Trash"
              disabled={selectedEmails.length === 0}
              onClick={() => handleMove("deleted")}
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400"
              onClick={handleMarkAsRead}
              disabled={selectedEmails.length === 0}
              title="Mark as Read"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
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
                moment. Messages will appear here once available.
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
              isSelected={selectedEmails.includes(email.uid)}
              onToggleSelect={toggleEmailSelection}
              folderName={folderName}
              onOpenDraft={handleOpenDraft}
            />
          ))
        )}
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        draft={draftData}
      />
    </div>
  );
};

export default EmailList;
