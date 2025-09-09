import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import EmailLayout from "../components/layout/EmailLayout";

const TrashPage = () => {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="p-4">
      {/* Warning Notification */}
      {showAlert && (
        <div className="relative flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
          <p className="text-sm text-center">
            Emails that have been in the Trash for more than 30 days will be
            deleted automatically.
          </p>
          <button
            onClick={() => setShowAlert(false)}
            className="absolute right-3 top-3 text-yellow-600 hover:text-yellow-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Layout Email */}
      <EmailLayout folderName="deleted" />
    </div>
  );
};

export default TrashPage;
