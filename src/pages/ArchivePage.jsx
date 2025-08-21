import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { archivedEmails } from "../data/sampleEmails";

const ArchivePage = () => {
  return <EmailLayout folderName="archive" emails={archivedEmails} />;
};

export default ArchivePage;
