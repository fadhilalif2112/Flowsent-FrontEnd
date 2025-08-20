import React from "react";
import { User, Settings, LogOut } from "lucide-react";

const ProfileDropdown = ({ isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="hidden md:block text-gray-700 font-medium">
          John Doe
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">john.doe@flowsent.com</p>
          </div>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
