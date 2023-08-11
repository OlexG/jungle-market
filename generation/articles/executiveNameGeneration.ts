export function generateRandomName(): string {
  const firstNames = [
    "Aarav",
    "Emiko",
    "Hassan",
    "Lina",
    "Santiago",
    "Leila",
    "Hiroshi",
    "Aisha",
    "Rahul",
    "Yara",
    "Abdi",
    "Zara",
    "Mohammed",
    "Chen",
    "Ananya",
    "Ahmed",
    "Mei",
    "Omar",
    "Liyana",
    "Yuval",
    "Noam",
    "Lex",
    "Ido",
    "Sergiy",
    "Ben",
    "Matan",
    "Sasha"
  ];

  const lastNames = [
    "Garcia",
    "Silva",
    "Kim",
    "Khan",
    "Santos",
    "Mwangi",
    "Singh",
    "Abbas",
    "Fernandez",
    "Nguyen",
    "Ali",
    "Choi",
    "Ahmed",
    "Yamamoto",
    "Zhang",
    "Das",
    "Chung",
    "Rahman",
    "Sato",
    "Fridman",
    "Jones",
    "Nurmagomedov",
  ];

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
}
