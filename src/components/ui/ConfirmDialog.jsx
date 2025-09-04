import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
