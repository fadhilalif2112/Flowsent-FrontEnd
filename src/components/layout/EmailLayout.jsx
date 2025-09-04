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
      <div className="flex-1 overflow-auto bg-white">
        {/* Toolbar skeleton */}
        <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Email list skeleton */}
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center px-4 py-3 border-b border-gray-100 animate-pulse"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              {/* Content */}
              <div className="flex-1 ml-3 space-y-2">
                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
              </div>
              {/* Time */}
              <div className="w-10 h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //if error not null
  if (error) {
    return (
      <div className="flex flex-col min-h-[70vh]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
              <h3 className="text-red-800 font-semibold mb-2">
                Unable to load emails
              </h3>
              <p className="text-red-600 text-sm">Please try again later.</p>
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
