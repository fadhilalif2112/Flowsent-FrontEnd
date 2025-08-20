export const inboxEmail = [
  {
    id: 1,
    sender: "Diana",
    subject: "Your Daily Work Summary",
    preview: "And they'd probably do a lot of damage to an...",
    timestamp: new Date("2024-03-26"),
    read: false,
    starred: true,
    isNew: true,
    avatar: null,
  },
  {
    id: 2,
    sender: "Unsplash Team",
    subject: "Get involved for International Women's Day - with link 😊",
    preview: "The link below is now clickable for Chrome users...",
    timestamp: new Date("2023-12-16"),
    read: true,
    starred: false,
    isNew: true,
    avatar: null,
    attachments: ["Winter", "Coffee"],
  },
  {
    id: 3,
    sender: "Goodreads",
    subject: "Goodreads Newsletter: March 5, 2019",
    preview:
      "The most anticipated books of spring, a rocking read, and more! Goodreads Spring...",
    timestamp: new Date("2024-03-05"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
  },
  {
    id: 4,
    sender: "Spectrum",
    subject: "Spectrum Weekly Digest: ZEIT watercooler, Escape Room!",
    preview: "You didn't gain any reputation last week. Reputation is an...",
    timestamp: new Date("2024-02-21"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
  },
  {
    id: 5,
    sender: "Bruce Banner",
    subject: "Invitation for migration",
    preview: "Bruce Wayne, you have an invitation of migration...",
    timestamp: new Date("2023-10-26"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
    attachments: ["Invitation"],
  },
];

// =======================
// Archive
// =======================
export const archivedEmails = [
  {
    id: 101,
    sender: "LinkedIn",
    subject: "You appeared in 5 searches this week",
    preview: "See who’s looking at your profile...",
    timestamp: new Date("2023-09-15"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
  },
  {
    id: 102,
    sender: "GitHub",
    subject: "Security alert on your repository",
    preview: "A dependency you use has a critical vulnerability...",
    timestamp: new Date("2023-11-05"),
    read: false,
    starred: true,
    isNew: true,
    avatar: null,
  },
];

// =======================
// Sent
// =======================
export const sentEmails = [
  {
    id: 201,
    sender: "Me",
    subject: "Meeting Follow-up",
    preview: "Thanks for attending today’s meeting, here’s a recap...",
    timestamp: new Date("2024-01-14"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
  },
  {
    id: 202,
    sender: "Me",
    subject: "Job Application - Frontend Developer",
    preview: "Attached is my CV and portfolio for your review...",
    timestamp: new Date("2024-02-02"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
    attachments: ["CV.pdf", "Portfolio.pdf"],
  },
  {
    id: 203,
    sender: "Me",
    subject: "Happy Birthday!",
    preview: "Wishing you an amazing year ahead 🎉...",
    timestamp: new Date("2023-12-20"),
    read: true,
    starred: true,
    isNew: false,
    avatar: null,
  },
];

// =======================
// Drafts
// =======================
export const draftsEmails = [
  {
    id: 301,
    sender: "Me",
    subject: "(Draft) Project Proposal",
    preview: "Still working on the final details, will send soon...",
    timestamp: new Date("2024-03-01"),
    read: false,
    starred: false,
    isNew: false,
    avatar: null,
  },
  {
    id: 302,
    sender: "Me",
    subject: "(Draft) Feedback for design team",
    preview: "Need to mention the UI color palette changes...",
    timestamp: new Date("2024-02-10"),
    read: false,
    starred: true,
    isNew: false,
    avatar: null,
  },
];

// =======================
// Trash
// =======================
export const trashEmails = [
  {
    id: 401,
    sender: "Spammy Newsletter",
    subject: "Congratulations! You won a prize!",
    preview: "Click here to claim your free gift card...",
    timestamp: new Date("2023-11-28"),
    read: true,
    starred: false,
    isNew: false,
    avatar: null,
  },
  {
    id: 402,
    sender: "Old Friend",
    subject: "Re: Catching up soon?",
    preview: "Hey, sorry I missed your message last time...",
    timestamp: new Date("2023-10-15"),
    read: false,
    starred: false,
    isNew: false,
    avatar: null,
  },
];
