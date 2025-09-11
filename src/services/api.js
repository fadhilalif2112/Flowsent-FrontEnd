const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// LOGIN
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login gagal, coba lagi.");
  }

  // simpan token & user ke localStorage
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify(data.user.email));

  return data;
};

// LOGOUT
export const logout = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    localStorage.removeItem("user");
    return { message: "No token found, user logged out locally" };
  }

  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  // tetap hapus token & user meskipun gagal
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  if (!response.ok) {
    throw new Error(data.message || "Logout gagal.");
  }

  return data;
};

// FETCH EMAILS
export const fetchEmailsApi = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const res = await fetch(`${API_BASE_URL}/emails/all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch emails");
  }

  return await res.json();
};

// DOWNLOAD ATTACHMENT
export const downloadAttachmentApi = async (uid, filename) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const res = await fetch(
    `${API_BASE_URL}/emails/attachments/${uid}/download/${filename}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Download failed:", res.status, errorText);
    throw new Error("Failed to download attachment");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// SEND EMAIL
export const sendEmailApi = async ({ to, subject, body, attachments }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const formData = new FormData();
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("body", body);

  if (attachments && attachments.length > 0) {
    attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/emails/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send email");
  }

  return data;
};

// MARK AS READ
export const markAsReadApi = async (folder, emailId) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/emails/mark-as-read`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      folder: folder,
      email_id: emailId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark email as read");
  }

  return data;
};

// MARK AS FLAGGED
export const markAsFlaggedApi = async (folder, emailId) => {
  const response = await fetch(`${API_BASE_URL}/emails/flag`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      folder: folder,
      email_id: emailId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to flag email");
  }

  return data;
};

// MARK AS UNFLAGGED
export const markAsUnflaggedApi = async (folder, emailId) => {
  const response = await fetch(`${API_BASE_URL}/emails/unflag`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      folder: folder,
      email_id: emailId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to unflag email");
  }

  return data;
};

// MOVE EMAIL
export const moveEmailApi = async (folder, emailIds, targetFolder) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/emails/move`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      folder: folder,
      email_ids: emailIds,
      target_folder: targetFolder,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to move email(s)");
  }

  return data;
};

// DELETE ALL PERMANENT FROM TRASH
export const deletePermanentAllApi = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/emails/delete-permanent-all`, {
    method: "DELETE", // ganti POST kalau route kamu pakai POST
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to permanently delete all emails");
  }

  return data;
};

// SAVE DRAFT
export const saveDraftApi = async ({ to, subject, body, attachments }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const formData = new FormData();
  if (to) formData.append("to", to);
  if (subject) formData.append("subject", subject);
  if (body) formData.append("body", body);

  if (attachments && attachments.length > 0) {
    attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/emails/draft`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save draft");
  }

  return data;
};
