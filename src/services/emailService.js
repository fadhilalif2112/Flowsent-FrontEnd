// services/emailService.js
const API_BASE_URL = "http://127.0.0.1:8000/api";

export const emailService = {
  // Fetch emails by folder
  async getEmailsByFolder(folder) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${folder}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching emails:", error);
      throw error;
    }
  },

  // Download attachment
  async downloadAttachment(uid, filename) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/download/uid/${uid}/${filename}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    } catch (error) {
      console.error("Error downloading attachment:", error);
      throw error;
    }
  },
};
