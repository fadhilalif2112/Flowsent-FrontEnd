import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchEmailsApi,
  downloadAttachmentApi,
  previewAttachmentApi,
  markAsReadApi,
  markAsFlaggedApi,
  markAsUnflaggedApi,
  deletePermanentAllApi,
  moveEmailApi,
  deletePermanentApi,
} from "../services/api.js";
import Notification from "../components/ui/Notification.jsx";
import PreviewModal from "../components/ui/PreviewModal.jsx";

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [previewFilename, setPreviewFilename] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [notification, setNotification] = useState({
    show: false,
    type: "info",
    message: "",
    duration: 4000,
    position: "top-center",
  });

  const showNotification = (
    type,
    message,
    duration = 4000,
    position = "top-center"
  ) => {
    console.log(`[Notification] ${type.toUpperCase()}: ${message}`); // ⬅️ log tetap ada
    setNotification({ show: true, type, message, duration, position });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const fetchEmails = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await fetchEmailsApi(forceRefresh);
      setEmails(data);
      console.log("Emails fetched", forceRefresh ? "(forced)" : "(cached)");
      console.log(data);
    } catch (err) {
      setError(err.message);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(true);
  }, []);

  const refreshEmails = async () => {
    await fetchEmails(false);
  };

  const downloadAttachment = async (uid, filename) => {
    try {
      await downloadAttachmentApi(uid, filename);
    } catch (err) {
      console.error("Error downloading attachment:", err);
      setError(err.message);
    }
  };

  // preview attachment
  const previewAttachment = async (uid, filename) => {
    try {
      const result = await previewAttachmentApi(uid, filename);

      if (result.fallbackDownload) {
        await downloadAttachmentApi(uid, filename);
        return;
      }

      setPreviewUrl(result.url);
      setPreviewType(result.mimeType);
      setPreviewFilename(result.filename);
    } catch (err) {
      console.error("Error previewing attachment:", err);
      showNotification("error", "Gagal preview attachment");
    }
  };

  // helper untuk update 1 email di state secara imutabel
  const updateEmailInState = (folderKey, messageId, changes) => {
    setEmails((prev) => {
      const list = prev?.[folderKey] || [];
      const idx = list.findIndex(
        (e) => String(e.messageId) === String(messageId)
      );
      if (idx === -1) return prev;
      const updatedList = [...list];
      updatedList[idx] = { ...updatedList[idx], ...changes };
      return { ...prev, [folderKey]: updatedList };
    });
  };

  // === Handlers ===

  // Mark as read
  const markAsRead = async (folder, messageId) => {
    const prev = {};
    try {
      const list = emails?.[folder] || [];
      const target = list.find(
        (e) => String(e.messageId) === String(messageId)
      );
      if (target) {
        prev.seen = target.seen;
        updateEmailInState(folder, messageId, { seen: true });
      }

      await markAsReadApi(folder, messageId);
    } catch (err) {
      if (prev.hasOwnProperty("seen")) {
        updateEmailInState(folder, messageId, { seen: prev.seen });
      }
      console.error("Error marking email as read:", err);
      setError(err.message);
      throw err;
    }
  };

  // Flag
  const markAsFlagged = async (folder, messageId) => {
    const prev = {};
    try {
      const list = emails?.[folder] || [];
      const target = list.find(
        (e) => String(e.messageId) === String(messageId)
      );
      if (target) {
        prev.flagged = target.flagged;
        updateEmailInState(folder, messageId, { flagged: true });
      }

      await markAsFlaggedApi(folder, messageId);
    } catch (err) {
      if (prev.hasOwnProperty("flagged")) {
        updateEmailInState(folder, messageId, { flagged: prev.flagged });
      }
      console.error("Error flagging email:", err);
      setError(err.message);
      throw err;
    }
  };

  // Unflag
  const markAsUnflagged = async (folder, messageId) => {
    const prev = {};
    try {
      const list = emails?.[folder] || [];
      const target = list.find(
        (e) => String(e.messageId) === String(messageId)
      );
      if (target) {
        prev.flagged = target.flagged;
        updateEmailInState(folder, messageId, { flagged: false });
      }

      await markAsUnflaggedApi(folder, messageId);
    } catch (err) {
      if (prev.hasOwnProperty("flagged")) {
        updateEmailInState(folder, messageId, { flagged: prev.flagged });
      }
      console.error("Error unflagging email:", err);
      setError(err.message);
      throw err;
    }
  };

  // Delete permanent all (empty trash)
  const deletePermanentAll = async () => {
    try {
      // Optimistic update → langsung kosongkan trash
      setEmails((prev) => {
        const updated = { ...prev };
        updated["deleted"] = [];
        return updated;
      });

      await deletePermanentAllApi();
      console.log("Trash emptied successfully");
    } catch (err) {
      console.error("Error emptying trash:", err);
      // rollback via refresh
      await refreshEmails();
      setError(err.message);
      throw err;
    }
  };

  // Delete permanent selected
  const deletePermanent = async (messageIds) => {
    try {
      const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

      await deletePermanentApi(ids);

      setEmails((prev) => {
        const updated = { ...prev };
        if (updated["deleted"]) {
          updated["deleted"] = updated["deleted"].filter(
            (email) => !ids.includes(email.messageId)
          );
        }
        return updated;
      });

      showNotification(
        "success",
        "Email(s) deleted permanently",
        4000,
        "bottom-left"
      );
    } catch (err) {
      console.error("Error deleting permanent:", err);
      await refreshEmails(); // rollback kalau gagal
      showNotification(
        "error",
        "Failed to delete emails permanently",
        4000,
        "bottom-left"
      );
      throw err;
    }
  };

  // move email by messageId
  const moveEmail = async (folder, messageIds, targetFolder) => {
    try {
      const ids = Array.isArray(messageIds) ? messageIds : [messageIds];

      // Panggil API backend
      await moveEmailApi(folder, ids, targetFolder);

      // Optimistic UI: update state langsung
      setEmails((prev) => {
        const updated = { ...prev };

        // Ambil semua email yang akan dipindah (berdasarkan messageId)
        const movedEmails =
          prev[folder]?.filter((email) => ids.includes(email.messageId)) || [];

        // Hapus dari folder asal
        if (updated[folder]) {
          updated[folder] = updated[folder].filter(
            (email) => !ids.includes(email.messageId)
          );
        }

        // Tambahkan ke folder tujuan
        if (movedEmails.length > 0) {
          if (!updated[targetFolder]) {
            updated[targetFolder] = [];
          }
          updated[targetFolder] = [...movedEmails, ...updated[targetFolder]];
        }

        return updated;
      });
    } catch (err) {
      console.error("Error moving email by messageId:", err);
      await refreshEmails(); // rollback kalau gagal
      throw err;
    }
  };

  return (
    <EmailContext.Provider
      value={{
        emails,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        refreshEmails,
        downloadAttachment,
        previewAttachment,
        markAsRead,
        markAsFlagged,
        markAsUnflagged,
        deletePermanentAll,
        showNotification,
        moveEmail,
        deletePermanent,
      }}
    >
      {children}
      <Notification
        type={notification.type}
        message={notification.message}
        show={notification.show}
        duration={notification.duration}
        onClose={hideNotification}
      />

      {/* Modal preview attachment */}
      <PreviewModal
        url={previewUrl}
        type={previewType}
        filename={previewFilename}
        onClose={() => {
          setPreviewUrl(null);
          setPreviewType(null);
          setPreviewFilename(null);
        }}
      />
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
