import React, { useState } from "react";
import EmailItem from "./EmailItem";
import { Archive, Trash2, Mail, Plus, RefreshCcw } from "lucide-react";

const EmailList = ({
  emails,
  selectedEmails,
  onToggleSelect,
  selectedCount,
  selectAll,
  onSelectAll,
  refreshEmails,
}) => {
  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* === Toolbar (Mobile + Desktop) === */}
      <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
        {/* Mobile Toolbar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between ml-1 mr-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {selectedCount > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedCount} selected
                </span>
              )}
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-blue-400"
                onClick={refreshEmails}
                title="Refresh"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                title="Move to Trash"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400"
                title="Mark as Read"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium flex items-center space-x-1 text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Compose</span>
            </button>
          </div>
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onSelectAll}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            {selectedCount > 0 && (
              <span className="text-sm text-gray-600 mr-2">
                {selectedCount} selected
              </span>
            )}
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-blue-400"
              onClick={refreshEmails}
              title="Refresh"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-amber-800"
              title="Archive"
            >
              <Archive className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-red-600"
              title="Move to Trash"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-green-400"
              title="Mark as Read"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      {/* === Email List === */}
      <div>
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Mail className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">Tidak ada email</p>
            <p className="text-sm">Kotak masuk kamu kosong</p>
          </div>
        ) : (
          emails.map((email) => (
            <EmailItem
              key={email.uid}
              email={email}
              isSelected={selectedEmails.includes(email.uid)}
              onToggleSelect={onToggleSelect}
              showAvatar={true}
            />
          ))
        )}
      </div>

      {/* Footer pagination */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-100">
        {/* Desktop Footer */}
        <div className="hidden md:flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>1-4 of 4</span>
            <button className="p-1 hover:bg-gray-200 rounded">
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
            <button className="p-1 hover:bg-gray-200 rounded">
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
      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-100">
        {/* Mobile Footer */}
        <div className="md:hidden">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-xs text-gray-500">1-4 of 4</span>
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
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
    </div>
  );
};

export default EmailList;
