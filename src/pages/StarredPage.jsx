import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { inboxEmail } from "../data/sampleEmails";

const StarredPage = () => {
  return <EmailLayout folderName="starred" emails={inboxEmail} />;
};

export default StarredPage;
