import React from "react";
import EmailLayout from "../components/email/EmailLayout";
import { archivedEmails } from "../data/sampleEmails";

const ArchivePage = () => {
  return <EmailLayout folderName="archive" emails={archivedEmails} />;
};

export default ArchivePage;
