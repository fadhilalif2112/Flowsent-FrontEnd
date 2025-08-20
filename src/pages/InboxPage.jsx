import React from "react";
import EmailLayout from "../components/email/EmailLayout";
import { inboxEmail } from "../data/sampleEmails";

const InboxPage = () => {
  return <EmailLayout folderName="inbox" emails={inboxEmail} />;
};

export default InboxPage;
