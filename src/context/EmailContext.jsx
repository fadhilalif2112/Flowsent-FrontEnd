// src/context/EmailContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEmails = async () => {
    try {
      setLoading(true);

      // Ambil authToken dari localStorage
      const authToken = localStorage.getItem("authToken");

      // Jika tidak ada token, redirect ke login
      if (!authToken) {
        setError("Authentication token not found. Please login again.");
        //make alert
        alert("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/emails/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Jika response 401 (Unauthorized), token mungkin expired
      if (res.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setError("Session expired. Please login again.");
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch emails");
      }

      const data = await res.json();

      setEmails(data);
      console.log(data);
    } catch (err) {
      console.error("Fetch emails error:", err);
      setError(err.message);
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

  return (
    <EmailContext.Provider
      value={{
        emails,
        loading,
        error,
        refreshEmails,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
