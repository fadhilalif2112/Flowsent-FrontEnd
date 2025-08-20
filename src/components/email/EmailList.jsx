import React from "react";
import EmailItem from "./EmailItem";

// Email List Component
const EmailList = ({ emails, selectedEmails, onToggleSelect }) => {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div>
        {emails.map((email) => (
          <EmailItem
            key={email.id}
            email={email}
            isSelected={selectedEmails.includes(email.id)}
            onToggleSelect={onToggleSelect}
            showAvatar={true}
          />
        ))}
      </div>

      {/* Footer with storage info and pagination */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-100">
        {/* Mobile Footer */}
        <div className="md:hidden">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-xs text-gray-500">1-4 of 4</span>
            <div className="flex items-center space-x-1">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                disabled
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                disabled
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden md:flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>1-4 of 4</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailList;
