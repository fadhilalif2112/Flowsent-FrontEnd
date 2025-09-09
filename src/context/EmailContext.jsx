// src/context/EmailContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchEmailsApi,
  downloadAttachmentApi,
  markAsReadApi,
  markAsFlaggedApi,
  markAsUnflaggedApi,
} from "../services/api.js";

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const data = await fetchEmailsApi();
      setEmails(data);
    } catch (err) {
      setError(err.message);
      // optional: arahkan ke login jika token invalid/expired
      // navigate("/login");
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

  // Mark as read (optimistic)
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

  // Flag (optimistic)
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

  // Unflag (optimistic)
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

  return (
    <EmailContext.Provider
      value={{
        emails,
        loading,
        error,
        refreshEmails,
        downloadAttachment,
        markAsRead,
        markAsFlagged,
        markAsUnflagged,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
