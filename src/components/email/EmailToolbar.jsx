import React, { useState } from "react";
import { Archive, Trash2, Mail, Clock, Plus } from "lucide-react";

const EmailToolbar = ({ selectedCount, selectAll, onSelectAll }) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  return (
    <div className="bg-white border-2 border-gray-200 px-3 md:px-6 py-3 md:py-4">
      {/* Mobile Layout */}
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Mark as read"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Compose</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
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
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <Archive className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <Mail className="w-5 h-5" />
          </button>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Compose</span>
        </button>
      </div>

      {/* Click overlay to close dropdown */}
      {showMoreActions && (
        <div
          className="fixed inset-0 z-0 md:hidden"
          onClick={() => setShowMoreActions(false)}
        />
      )}
    </div>
  );
};

export default EmailToolbar;
