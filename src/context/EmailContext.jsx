// src/context/EmailContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchEmailsApi,
  downloadAttachmentApi,
  markAsReadApi,
  markAsFlaggedApi,
  markAsUnflaggedApi,
  moveEmailApi,
  deletePermanentAllApi,
} from "../services/api.js";
import Notification from "../components/ui/Notification.jsx";

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const data = await fetchEmailsApi();
      setEmails(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
      // optional: arahkan ke login jika token invalid/expired
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const refreshEmails = async () => {
    await fetchEmails();
  };

  const downloadAttachment = async (uid, filename) => {
    try {
      await downloadAttachmentApi(uid, filename);
    } catch (err) {
      console.error("Error downloading attachment:", err);
      setError(err.message);
    }
  };

  // helper untuk update 1 email di state secara imutabel
  const updateEmailInState = (folderKey, uid, changes) => {
    setEmails((prev) => {
      const list = prev?.[folderKey] || [];
      const idx = list.findIndex((e) => String(e.uid) === String(uid));
      if (idx === -1) return prev;
      const updatedList = [...list];
      updatedList[idx] = { ...updatedList[idx], ...changes };
      return { ...prev, [folderKey]: updatedList };
    });
  };

  // === Handlers ===

  // Mark as read
  const markAsRead = async (folder, emailId) => {
    const prev = {}; // simpan prev untuk rollback
    try {
      // optimistic
      const list = emails?.[folder] || [];
      const target = list.find((e) => String(e.uid) === String(emailId));
      if (target) {
        prev.seen = target.seen;
        updateEmailInState(folder, emailId, { seen: true });
      }

      await markAsReadApi(folder, emailId);
    } catch (err) {
      // rollback
      if (prev.hasOwnProperty("seen")) {
        updateEmailInState(folder, emailId, { seen: prev.seen });
      }
      console.error("Error marking email as read:", err);
      setError(err.message);
      throw err;
    }
  };

  // Flag
  const markAsFlagged = async (folder, emailId) => {
    const prev = {};
    try {
      const list = emails?.[folder] || [];
      const target = list.find((e) => String(e.uid) === String(emailId));
      if (target) {
        prev.flagged = target.flagged;
        updateEmailInState(folder, emailId, { flagged: true });
      }

      await markAsFlaggedApi(folder, emailId);
    } catch (err) {
      if (prev.hasOwnProperty("flagged")) {
        updateEmailInState(folder, emailId, { flagged: prev.flagged });
      }
      console.error("Error flagging email:", err);
      setError(err.message);
      throw err;
    }
  };

  // Unflag
  const markAsUnflagged = async (folder, emailId) => {
    const prev = {};
    try {
      const list = emails?.[folder] || [];
      const target = list.find((e) => String(e.uid) === String(emailId));
      if (target) {
        prev.flagged = target.flagged;
        updateEmailInState(folder, emailId, { flagged: false });
      }

      await markAsUnflaggedApi(folder, emailId);
    } catch (err) {
      if (prev.hasOwnProperty("flagged")) {
        updateEmailInState(folder, emailId, { flagged: prev.flagged });
      }
      console.error("Error unflagging email:", err);
      setError(err.message);
      throw err;
    }
  };

  //move email
  const moveEmail = async (folder, emailIds, targetFolder) => {
    try {
      // pastikan selalu array
      const ids = Array.isArray(emailIds) ? emailIds : [emailIds];

      // Optimistic UI: update state langsung
      setEmails((prev) => {
        const updated = { ...prev };

        // Ambil semua email yang akan dipindah
        const movedEmails =
          prev[folder]?.filter((email) => ids.includes(email.uid)) || [];

        // Hapus dari folder asal
        if (updated[folder]) {
          updated[folder] = updated[folder].filter(
            (email) => !ids.includes(email.uid)
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

      // Panggil API backend
      await moveEmailApi(folder, ids, targetFolder);
    } catch (err) {
      console.error("Error moving email:", err);
      // Rollback jika gagal
      await refreshEmails();
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
        markAsRead,
        markAsFlagged,
        markAsUnflagged,
        moveEmail,
        deletePermanentAll,
        showNotification,
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
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
