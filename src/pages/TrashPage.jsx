import React from "react";
import EmailLayout from "../components/email/EmailLayout";
import { trashEmails } from "../data/sampleEmails";

const TrashPage = () => {
  return <EmailLayout folderName="trash" emails={trashEmails} />;
};

export default TrashPage;
