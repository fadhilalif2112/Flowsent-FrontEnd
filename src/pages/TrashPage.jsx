import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { trashEmails } from "../data/sampleEmails";

const TrashPage = () => {
  return <EmailLayout folderName="trash" emails={trashEmails} />;
};

export default TrashPage;
