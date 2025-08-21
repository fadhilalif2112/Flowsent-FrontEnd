import React, { useState } from "react";
import EmailList from "../email/EmailList";

const EmailLayout = ({ folderName, emails }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      const allIds = emails.map((email) => email.id);
      setSelectedEmails(allIds);
      console.log(allIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleEmailSelection = (emailId) => {
    setSelectedEmails((prev) => {
      const newSelection = prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId];

      setSelectAll(newSelection.length === emails.length);
      console.log(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* List Email */}
      <EmailList
        emails={emails}
        selectedEmails={selectedEmails}
        onToggleSelect={toggleEmailSelection}
        selectedCount={selectedEmails.length}
        selectAll={selectAll}
        onSelectAll={toggleSelectAll}
      />
    </div>
  );
};

export default EmailLayout;
