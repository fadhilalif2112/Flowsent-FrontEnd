import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { sentEmails } from "../data/sampleEmails";

const SentPage = () => {
  return <EmailLayout folderName="sent" emails={sentEmails} />;
};

export default SentPage;
