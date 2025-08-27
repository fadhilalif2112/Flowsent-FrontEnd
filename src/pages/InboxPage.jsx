import React from "react";
import EmailLayout from "../components/layout/EmailLayout";

const InboxPage = () => {
  // Pass folder name to EmailLayout, which will handle API calls
  return <EmailLayout folderName="inbox" />;
};

export default InboxPage;
