import React, { useState } from "react";
import EmailToolbar from "./EmailToolbar";
import EmailList from "./EmailList";

const EmailLayout = ({ folderName, emails }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map((email) => email.id));
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

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <EmailToolbar
        selectedCount={selectedEmails.length}
        selectAll={selectAll}
        onSelectAll={toggleSelectAll}
      />

      {/* List */}
      <EmailList
        emails={emails}
        selectedEmails={selectedEmails}
        onToggleSelect={toggleEmailSelection}
      />
    </div>
  );
};

export default EmailLayout;
