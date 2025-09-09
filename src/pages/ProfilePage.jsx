import React, { useState } from "react";
import { Edit, X } from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    email: "john.doe@flowsent.com",
    phone: "+1 (555) 123-4567",
    userRole: "Admin",
    country: "United States",
    city: "New York",
    postalCode: "10001",
  });

  const [backupData, setBackupData] = useState(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Logic untuk save (API call, dsb) bisa ditambahkan di sini
    setBackupData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(backupData); // reset ke data lama
    setIsEditing(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const renderField = (label, name, type = "text") => (
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
          className="w-full border rounded-lg px-3 py-2 text-gray-900"
        />
      ) : (
        <p className="text-gray-900 font-medium">{formData[name]}</p>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header Section */}
        <div className="relative p-6 md:p-8 border-b border-gray-200">
          {/* Edit Button */}
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

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Profile Picture */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xl md:text-2xl">
                {getInitials(formData.firstName, formData.lastName)}
              </span>
            </div>

            {/* Profile Details */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-gray-600 mb-2">{formData.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formData.userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Personal Information & Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                />
              ) : (
                <p className="text-gray-900 font-medium">
                  {new Date(formData.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            {renderField("Email Address", "email", "email")}
            {renderField("Phone Number", "phone")}
            {renderField("User Role", "userRole")}
            {renderField("Country", "country")}
            {renderField("City", "city")}
            {renderField("Postal Code", "postalCode")}
          </div>

          {/* Save / Cancel Buttons */}
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
