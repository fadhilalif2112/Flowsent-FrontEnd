import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EmailDetail from "../components/email/EmailDetail";
import { useEmails } from "../context/EmailContext";

const EmailDetailPage = () => {
  const { folder, uid } = useParams();
  const { emails, loading: emailsLoading } = useEmails(); // Gunakan 'emails' bukan 'allEmails'
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findEmail = () => {
      console.log("Finding email with params:", { folder, uid }); // Debug log
      console.log("Available emails:", emails); // Debug log

      setLoading(true);

      // Jika emails context masih loading, tunggu
      if (emailsLoading) {
        setLoading(true);
        return;
      }

      if (!emails || !folder || !uid) {
        console.log("Missing data:", { emails: !!emails, folder, uid }); // Debug log
        setEmail(null);
        setLoading(false);
        return;
      }

      // Cari email berdasarkan folder dan uid
      const folderData = emails[folder];
      console.log(`Folder '${folder}' data:`, folderData); // Debug log

      if (folderData && Array.isArray(folderData)) {
        const foundEmail = folderData.find(
          (email) => email.uid === parseInt(uid)
        );
        console.log("Found email:", foundEmail); // Debug log
        setEmail(foundEmail || null);
      } else {
        console.log(`Folder '${folder}' not found or not an array`); // Debug log
        setEmail(null);
      }

      setLoading(false);
    };

    findEmail();
  }, [folder, uid, emails, emailsLoading]); // Tambahkan emailsLoading ke dependencies

  // Tampilkan loading jika context masih loading
  if (emailsLoading) {
    return <EmailDetail loading={true} />;
  }

  return <EmailDetail email={email} loading={loading} />;
};

export default EmailDetailPage;
