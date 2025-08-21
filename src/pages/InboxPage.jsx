import React from "react";
import EmailLayout from "../components/layout/EmailLayout";
import { inboxEmail } from "../data/sampleEmails";

const InboxPage = () => {
  return <EmailLayout folderName="inbox" emails={inboxEmail} />;
};

export default InboxPage;
