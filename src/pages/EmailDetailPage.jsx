import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import EmailDetail from "../components/email/EmailDetail";
import { useEmails } from "../context/EmailContext";

const EmailDetailPage = () => {
  const params = useParams();
  const location = useLocation();
  const { emails, loading: emailsLoading } = useEmails();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findEmail = () => {
      setLoading(true);

      // Jika emails context masih loading, tunggu
      if (emailsLoading) {
        setLoading(true);
        return;
      }

      // Extract folder dari pathname secara manual
      const pathSegments = location.pathname.split("/").filter(Boolean);
      const folder = pathSegments[0]; // folder adalah segment pertama
      const uid = params.uid; // uid dari useParams

      if (!emails || !folder || !uid) {
        console.log("Missing data:", { emails: !!emails, folder, uid });
        setEmail(null);
        setLoading(false);
        return;
      }

      // Cari email berdasarkan folder & uid
      let foundEmail = null;

      if (folder === "starred") {
        // gabung semua folder jadi satu array
        const allFolders = Object.values(emails).flat();
        foundEmail = allFolders.find((email) => email.uid === parseInt(uid));
      } else {
        const folderData = emails[folder];
        if (folderData && Array.isArray(folderData)) {
          foundEmail = folderData.find((email) => email.uid === parseInt(uid));
        }
      }

      setEmail(foundEmail || null);
      setLoading(false);
    };

    findEmail();
  }, [params, location.pathname, emails, emailsLoading]);

  // Tampilkan loading jika context masih loading
  if (emailsLoading) {
    return <EmailDetail loading={true} />;
  }

  return <EmailDetail email={email} loading={loading} />;
};

export default EmailDetailPage;
