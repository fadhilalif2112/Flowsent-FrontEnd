import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { useEmails } from "../context/EmailContext";

const StarredPage = () => {
  const { emails: allEmails } = useEmails();

  // gabung semua folder jadi satu array, lalu filter flagged
  const allFolders = Object.values(allEmails).flat();
  const starredEmails = allFolders.filter((email) => email.flagged);

  return <EmailLayout customEmails={starredEmails} folderName="starred" />;
};

export default StarredPage;
