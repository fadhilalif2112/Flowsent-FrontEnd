import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import EmailDetail from "../components/email/EmailDetail";
import { useEmails } from "../context/EmailContext";

const EmailDetailPage = () => {
  const params = useParams();
  const location = useLocation();
  const { emails, loading: emailsLoading, markAsRead } = useEmails();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findEmail = () => {
      setLoading(true);

      if (emailsLoading) {
        return;
      }

      const pathSegments = location.pathname.split("/").filter(Boolean);
      const folder = pathSegments[0];
      const uid = params.uid;

      if (!emails || !folder || !uid) {
        setEmail(null);
        setLoading(false);
        return;
      }

      let foundEmail = null;

      if (folder === "starred") {
        const allFolders = Object.values(emails).flat();
        foundEmail = allFolders.find((email) => email.uid === parseInt(uid));
      } else {
        const folderData = emails[folder];
        if (folderData && Array.isArray(folderData)) {
          foundEmail = folderData.find((email) => email.uid === parseInt(uid));
        }
      }

      if (foundEmail) {
        setEmail(foundEmail);
        // Mark as read otomatis jika belum seen
        if (!foundEmail.seen) {
          // Optimistic UI: langsung update di frontend
          foundEmail.seen = true;
          markAsRead(folder, foundEmail.uid).catch((err) => {
            console.error("Failed to mark as read:", err);
            // rollback kalau gagal
            foundEmail.seen = false;
          });
          console.log("Read berhasil");
        }
      } else {
        setEmail(null);
      }

      setLoading(false);
    };

    findEmail();
  }, [params, location.pathname, emails, emailsLoading, markAsRead]);

  if (emailsLoading) {
    return <EmailDetail loading={true} />;
  }

  return <EmailDetail email={email} loading={loading} />;
};

export default EmailDetailPage;
