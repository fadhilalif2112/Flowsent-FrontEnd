import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { draftsEmails } from "../data/sampleEmails";

const DraftsPage = () => {
  return <EmailLayout folderName="drafts" emails={draftsEmails} />;
};

export default DraftsPage;
