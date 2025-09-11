import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import EmailLayout from "../components/layout/EmailLayout";
import { useEmails } from "../context/EmailContext";

const TrashPage = () => {
  const [showAlert, setShowAlert] = useState(true);
  const { deletePermanentAll } = useEmails();

  const handleEmptyTrash = async () => {
    if (!window.confirm("Empty Trash now? This action cannot be undone."))
      return;

    try {
      await deletePermanentAll();
      alert("Trash has been empty");
    } catch {
      alert("Failed to empty trash.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Warning Notification */}
      {showAlert && (
        <div className="relative flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm">
              Emails that have been in the Trash for more than 30 days will be
              deleted automatically.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEmptyTrash}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Empty Trash now
            </button>
            <button
              onClick={() => setShowAlert(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Layout Email */}
      <EmailLayout folderName="deleted" />
    </div>
  );
};

export default TrashPage;
