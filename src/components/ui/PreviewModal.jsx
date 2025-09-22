// src/components/ui/PreviewModal.jsx
import React, { useEffect } from "react";

const PreviewModal = ({ url, type, filename, onClose }) => {
  if (!url) return null;

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isImage = type.startsWith("image/");
  const isPdf = type === "application/pdf";
  const isText = type.startsWith("text/");

  // Get file extension for display
  const fileExtension =
    filename?.split(".").pop()?.toUpperCase() ||
    type.split("/")[1]?.toUpperCase();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    >
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 h-14 flex items-center justify-between px-4 z-10">
        {/* Left section - Close button */}
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white"
            title="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Center section - File info */}
        <div className="flex items-center space-x-3 text-white">
          <div className="flex items-center space-x-2">
            {isImage && (
              <svg
                className="w-5 h-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isPdf && (
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {!isImage && !isPdf && (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="text-sm font-medium truncate max-w-xs">
              {filename || `File.${fileExtension}`}
            </span>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Download button */}
          <a
            href={url}
            download={filename}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white"
            title={`Download ${filename}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>

          {/* Print button */}
          <button
            onClick={() => {
              if (isImage) {
                // For images, create a new window for printing
                const printWindow = window.open("", "_blank");
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Print ${filename}</title>
                      <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        img { max-width: 100%; max-height: 100%; object-fit: contain; }
                      </style>
                    </head>
                    <body>
                      <img src="${url}" onload="window.print(); window.close();" />
                    </body>
                  </html>
                `);
                printWindow.document.close();
              } else {
                // For other files, open in new window and print
                const printWindow = window.open(url, "_blank");
                printWindow.onload = () => {
                  printWindow.print();
                };
              }
            }}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white"
            title="Print"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
          </button>

          {/* More options button */}
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full h-full pt-14 flex items-center justify-center">
        {isImage && (
          <div className="max-w-full max-h-full p-4 flex items-center justify-center">
            <img
              src={url}
              alt={filename}
              className="max-h-[calc(100vh-100px)] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        )}

        {isPdf && (
          <div className="w-full h-full p-4">
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
              title={filename}
              className="w-full h-[585px] rounded-lg shadow-2xl bg-white"
            ></iframe>
          </div>
        )}

        {isText && (
          <div className="w-full h-full p-4">
            <iframe
              src={url}
              title={filename}
              className="w-full h-full bg-gray-900 text-white rounded-lg shadow-2xl"
            ></iframe>
          </div>
        )}

        {!isImage && !isPdf && !isText && (
          <div className="flex flex-col items-center justify-center text-center text-white p-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-md">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Cannot preview file
              </h3>
              <p className="text-gray-300 mb-4">
                <strong>{filename}</strong> cannot be previewed in the browser.
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href={url}
                  download={filename}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </a>
                <button
                  onClick={() => {
                    const printWindow = window.open(url, "_blank");
                    printWindow.onload = () => {
                      printWindow.print();
                    };
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
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
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
        Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>{" "}
        to close
      </div>
    </div>
  );
};

export default PreviewModal;
