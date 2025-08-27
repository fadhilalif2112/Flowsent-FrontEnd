import React, { useState } from "react";
import EmailList from "../email/EmailList";
import { useEmails } from "../../context/EmailContext";

const EmailLayout = ({ folderName }) => {
  const { emails: allEmails, loading, error, refreshEmails } = useEmails(); // ambil dari Context
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const emails = allEmails[folderName] || [];

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      const allIds = emails.map((email) => email.uid);
      setSelectedEmails(allIds);
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

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emails...</p>
          </div>
        </div>
      </div>
    );
  }

  //if error not null
  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
              <h3 className="text-red-800 font-semibold mb-2">
                {error.message}
              </h3>
              <p className="text-red-600 text-sm">{error.details}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <EmailList
        emails={emails}
        selectedEmails={selectedEmails}
        onToggleSelect={toggleEmailSelection}
        selectedCount={selectedEmails.length}
        selectAll={selectAll}
        onSelectAll={toggleSelectAll}
        refreshEmails={refreshEmails}
      />
    </div>
  );
};

export default EmailLayout;
