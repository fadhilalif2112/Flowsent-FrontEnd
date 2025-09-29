import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import EmailDetail from "../components/email/EmailDetail";
import { useEmails } from "../context/EmailContext";
import ComposeModal from "../components/compose/ComposeModal";

const EmailDetailPage = () => {
  const params = useParams();
  const location = useLocation();
  const { emails, loading: emailsLoading, markAsRead } = useEmails();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const [composeDraft, setComposeDraft] = useState(null);
  const [composeMode, setComposeMode] = useState("new");

  // helper untuk format tanggal
  const formatEmailDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // helper untuk ambil isi body email
  const getOriginalBody = (email) => {
    return email.body?.html
      ? email.body.html
      : `<p>${(email.body?.text || "").replace(/\n/g, "<br/>")}</p>`;
  };

  const handleReply = (email) => {
    const formattedDate = formatEmailDate(email.timestamp);
    const originalBody = getOriginalBody(email);

    setComposeDraft({
      recipients: [{ email: email.senderEmail }],
      subject: email.subject.startsWith("Re:")
        ? email.subject
        : "Re: " + email.subject,
      body: {
        html: `
        <br/><br/>
        <div style="margin:1em 0; padding-left:1em; border-left:2px solid #ccc; color:#555; font-size:0.9em;">
          On ${formattedDate}, <b>${email.sender}</b> &lt;${email.senderEmail}&gt; wrote:
          <blockquote style="margin:0; padding-left:1em; border-left:2px solid #ddd;">
            ${originalBody}
          </blockquote>
        </div>
      `,
      },
    });
    setIsComposeOpen(true);
    setComposeMode("reply");
  };

  const handleForward = (email) => {
    const formattedDate = formatEmailDate(email.timestamp);
    const originalBody = getOriginalBody(email);

    setComposeDraft({
      recipients: [],
      subject: email.subject.startsWith("Fwd:")
        ? email.subject
        : "Fwd: " + email.subject,
      body: {
        html: `
        <br/><br/>
        <div style="border-top:1px solid #ccc; padding-top:10px; font-size:0.9em; color:#555;">
          ---------- Forwarded message ----------<br/>
          <b>From:</b> ${email.sender} &lt;${email.senderEmail}&gt;<br/>
          <b>Date:</b> ${formattedDate}<br/>
          <b>Subject:</b> ${email.subject}<br/>
        </div>
        <br/>
        ${originalBody}
      `,
      },
    });
    setIsComposeOpen(true);
    setComposeMode("forward");
  };

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
          markAsRead(folder, foundEmail.messageId).catch((err) => {
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

  return (
    <>
      <EmailDetail
        email={email}
        loading={loading}
        onReply={handleReply}
        onForward={handleForward}
      />
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        draft={composeDraft}
        mode={composeMode}
      />
    </>
  );
};

export default EmailDetailPage;
