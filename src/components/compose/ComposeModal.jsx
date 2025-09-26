import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { X, Send, Save, Paperclip } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";
import { sendEmailApi, saveDraftApi } from "../../services/api";
import { useEmails } from "../../context/EmailContext";

const ComposeModal = ({ isOpen, onClose, draft, mode = "new" }) => {
  // State untuk form fields
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const { showNotification } = useEmails();

  // State untuk attachment
  const [attachments, setAttachments] = useState([]);

  // State untuk link dialog
  const [linkDialog, setLinkDialog] = useState({
    show: false,
    selection: null,
  });
  const [linkUrl, setLinkUrl] = useState("");

  // State untuk confirm dialog
  const [showConfirm, setShowConfirm] = useState(false);

  // State untuk validasi
  const [errors, setErrors] = useState({});

  // Ref untuk focus
  const toInputRef = useRef(null);
  const quillRef = useRef(null);

  // Handler untuk link custom dialog
  const handleInsertLink = (selection) => {
    setLinkDialog({ show: true, selection });
    setLinkUrl("");
  };

  // Handler untuk apply link
  const applyLink = () => {
    if (linkUrl && quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (linkDialog.selection) {
        editor.setSelection(linkDialog.selection);
      }
      const formattedUrl = linkUrl.match(/^https?:/)
        ? linkUrl
        : "https://" + linkUrl;
      editor.format("link", formattedUrl);
    }
    setLinkDialog({ show: false, selection: null });
  };

  useEffect(() => {
    if (isOpen) {
      if (draft) {
        setTo(draft.recipients?.map((r) => r.email).join(", ") || "");
        setSubject(draft.subject || "");

        let draftContent = "";
        if (draft.body?.html) {
          draftContent = draft.body.html;
        } else if (draft.body?.text) {
          draftContent = `<p>${draft.body.text.replace(/\n/g, "<br/>")}</p>`;
        }

        // kasih delay biar Quill udah mount
        setTimeout(() => {
          setBody(draftContent);
        }, 0);

        if (draft.rawAttachments) {
          const normalized = draft.rawAttachments.map((att) => ({
            name: att.filename,
            size: att.size,
            downloadUrl: att.download_url,
            isServer: true, // tandai ini attachment lama
          }));
          setAttachments(normalized);
        } else {
          setAttachments([]);
        }
      } else {
        resetForm();
      }
      setErrors({});
    }
  }, [isOpen, draft]);

  /**
   * Konfigurasi toolbar untuk ReactQuill
   * Menyediakan opsi formatting dasar untuk email
   */
  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        link: function (value) {
          if (value) {
            const range = this.quill.getSelection();
            // Trigger custom link dialog
            handleInsertLink(range);
          } else {
            this.quill.format("link", false);
          }
        },
      },
    },
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateEmails = (emails) => {
    if (!emails.trim()) return false;

    const emailList = emails
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter((e) => e);
    return emailList.length > 0 && emailList.every(validateEmail);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!to.trim()) {
      newErrors.to = "Recipient email is required";
    } else if (!validateEmails(to)) {
      newErrors.to = "Please enter valid email address(es)";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      showNotification(
        "error",
        "Please fix the validation errors before sending.",
        4000,
        "top-center"
      );
    }

    return isValid;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) return;
    setSending(true);
    try {
      const result = await sendEmailApi({
        to: to.trim(),
        subject: subject.trim(),
        body,
        attachments,
      });

      showNotification(
        "success",
        "Email sent successfully!",
        3000,
        "top-center"
      );
      console.log("Server response:", result);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error sending email:", error);
      showNotification(
        "error",
        error.message || "Failed to send email.",
        4000,
        "top-center"
      );
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    setDrafting(true);
    try {
      const result = await saveDraftApi({
        to: to.trim(),
        subject: subject.trim() || "(No Subject)",
        body,
        attachments,
      });

      showNotification(
        "success",
        "Draft saved successfully!",
        3000,
        "top-center"
      );
      console.log("Server response (draft):", result);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error saving draft:", error);
      showNotification(
        "error",
        error.message || "Failed to save draft.",
        4000,
        "top-center"
      );
    } finally {
      setDrafting(false);
    }
  };

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
    setErrors({});
    setAttachments([]);
  };

  const handleClose = () => {
    const isBodyEmpty = !body || body === "<p><br></p>";

    const hasContent = to.trim() || subject.trim() || !isBodyEmpty;

    if (hasContent) {
      setShowConfirm(true);
    } else {
      resetForm();
      onClose();
    }
  };

  // Handler untuk file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      showNotification(
        "warning",
        `Some files are too large (max 10MB): ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`,
        5000,
        "top-center"
      );
      const validFiles = files.filter((file) => file.size <= maxSize);
      setAttachments((prev) => [...prev, ...validFiles]);
    } else {
      setAttachments((prev) => [...prev, ...files]);
      if (files.length > 0) {
        showNotification(
          "info",
          `${files.length} file(s) attached successfully.`,
          3000,
          "bottom-left"
        );
      }
    }
  };

  // Handler untuk menghapus attachment
  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    showNotification("info", "Attachment removed.", 2000, "bottom-left");
  };

  // Jika modal tidak open, return null
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      {/* Modal Container */}
      <div className="fixed z-60 transition-all duration-300 inset-4 md:inset-8 lg:inset-12">
        <div className="bg-white rounded-lg shadow-2xl flex flex-col h-full">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === "draft" && "Edit Draft"}
              {mode === "reply" && "Reply Message"}
              {mode === "forward" && "Forward Message"}
              {mode === "new" && "New Message"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <>
            {/* Form Fields */}
            <div className="px-6 py-4 space-y-3 border-b border-gray-200">
              {/* To Field */}
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 w-12">
                    To:
                  </label>
                  <input
                    ref={toInputRef}
                    type="text"
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      if (errors.to) setErrors({ ...errors, to: "" });
                    }}
                    placeholder="Enter recipients"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.to ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.to && (
                  <p className="text-red-500 text-xs mt-1 ml-14">{errors.to}</p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 w-12">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors({ ...errors, subject: "" });
                    }}
                    placeholder="Enter subject"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.subject ? "border-yellow-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.subject && (
                  <p className="text-yellow-500 text-xs mt-1 ml-14">
                    {errors.subject}
                  </p>
                )}
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 px-6 py-4 overflow-auto">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={body}
                onChange={setBody}
                modules={quillModules}
                placeholder="Compose your email..."
                className="h-full pb-12"
                style={{ height: "calc(100% - 20px)" }}
              />
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="px-6 py-2 border-t border-gray-200">
                <p className="text-sm font-medium mb-2">Attachments:</p>
                <ul className="space-y-1">
                  {attachments.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Attachment Button */}
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach files"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Save Draft Button */}
                <button
                  onClick={handleSaveDraft}
                  disabled={drafting}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    drafting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {drafting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save as Draft
                    </>
                  )}
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendEmail}
                  disabled={sending}
                  className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                    sending
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        </div>
      </div>

      {/* Link Insertion Dialog */}
      {linkDialog.show && (
        <div className="fixed inset-0 bg-black/30 z-70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://example.com)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setLinkDialog({ show: false, selection: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={applyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog
          message="You have unsaved changes. Are you sure you want to close?"
          onConfirm={() => {
            setShowConfirm(false);
            resetForm();
            onClose();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default ComposeModal;
