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
