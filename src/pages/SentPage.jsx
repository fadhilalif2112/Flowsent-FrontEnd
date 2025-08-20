import React from "react";
import EmailLayout from "../components/email/EmailLayout";
import { sentEmails } from "../data/sampleEmails";

const SentPage = () => {
  return <EmailLayout folderName="sent" emails={sentEmails} />;
};

export default SentPage;
