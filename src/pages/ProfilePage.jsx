import React, { useState, useEffect } from "react";
import { Edit, X } from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [backupData, setBackupData] = useState(formData);
  const [lockName, setLockName] = useState({
    firstName: false,
    lastName: false,
  });

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        if (typeof parsed === "string") {
          // versi lama: cuma email string
          const email = parsed;
          const namePart = email.split("@")[0];
          const nameParts = namePart.split(/[._ ]+/);

          let firstName = "";
          let lastName = "";

          if (nameParts.length > 1) {
            firstName = capitalize(nameParts[0]);
            lastName = capitalize(nameParts[nameParts.length - 1]);
          } else {
            firstName = capitalize(nameParts[0]);
          }

          const newData = {
            firstName,
            lastName,
            email,
            phone: "",
          };

          setFormData(newData);
          setBackupData(newData);

          setLockName({
            firstName: true, // firstname dari email selalu dikunci
            lastName: lastName !== "", // kunci lastname hanya kalau ada
          });
        } else {
          // versi baru: object
          const newData = {
            firstName: parsed.firstName || "Guest",
            lastName: parsed.lastName || "",
            email: parsed.email || "guest@example.com",
            phone: parsed.phone || "",
          };

          setFormData(newData);
          setBackupData(newData);

          setLockName({
            firstName: false,
            lastName: false,
          });
        }
      } catch (err) {
        console.error("Error parsing user:", err);
        setFallback();
      }
    } else {
      setFallback();
    }
  }, []);

  const setFallback = () => {
    const fallbackData = {
      firstName: "Guest",
      lastName: "",
      email: "guest@example.com",
      phone: "",
    };
    setFormData(fallbackData);
    setBackupData(fallbackData);
    setLockName({ firstName: false, lastName: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (/^\d*$/.test(value) && value.length <= 15) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setBackupData(formData);
    setIsEditing(false);

    const toSave = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    };
    localStorage.setItem("user", JSON.stringify(toSave));

    // setelah disimpan manual → buka lock
    setLockName({ firstName: false, lastName: false });
  };

  const handleCancel = () => {
    setFormData(backupData);
    setIsEditing(false);
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const renderField = (label, name, type = "text", disabled = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          disabled={disabled}
          className={`w-full border rounded-lg px-3 py-2 text-gray-900 ${
            disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white"
          }`}
        />
      ) : (
        <p className="text-gray-900 font-medium">{formData[name]}</p>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="relative p-6 md:p-8 border-b border-gray-200">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isEditing ? (
              <X className="w-5 h-5" />
            ) : (
              <Edit className="w-5 h-5" />
            )}
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xl md:text-2xl">
                {getInitials(formData.firstName, formData.lastName)}
              </span>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-gray-600 mb-2">{formData.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("First Name", "firstName", "text", lockName.firstName)}
            {renderField("Last Name", "lastName", "text", lockName.lastName)}
            {renderField("Email Address", "email", "email", true)}
            {renderField("Phone Number", "phone", "text")}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
