// src/context/EmailContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmailsApi, downloadAttachmentApi } from "../services/api.js";

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
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Fetch emails saat pertama kali mount
  useEffect(() => {
    fetchEmails();
  }, []);

  // Function untuk refresh emails (bisa dipanggil dari komponen lain)
  const refreshEmails = async () => {
    await fetchEmails();
  };

  //download attachment dari backend
  const downloadAttachment = async (uid, filename) => {
    try {
      await downloadAttachmentApi(uid, filename);
    } catch (err) {
      console.error("Error downloading attachment:", err);
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
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
