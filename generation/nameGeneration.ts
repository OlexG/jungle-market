import { Company } from "../routes/models/company.ts"

const companyFirstNames: string[] = [
  "Banana",
  "Ape",
  "Monkey",
  "Jungle",
  "Primate",
  "BananaLeaf",
  "MonkeyPalm",
  "BananaPeak",
  "ApeVine",
  "MonkeyBridge",
  "JungleLadder",
  "BananaCrown",
  "ApeGrove",
  "MonkeyHaven",
  "JungleBreeze",
  "Bamboo",
  "Simian",
  "Vine",
  "Leaf",
  "Canopy",
  "Treetop",
  "Chimp",
  "Coconut",
  "BananaTree",
  "ApeTraders",
  "Monarch",
  "JungleQuest",
  "Palm",
  "Wild",
  "PrimatePower",
  "MonkeyMagic",
  "Vineyard",
  "BananaBunch",
  "ApeHut",
  "JungleKing",
  "BananaBerry",
  "CocoCo",
  "Chatter",
  "SimianSphere",
  "Leafy",
  "JungleSafari",
  "Tropic",
  "ApeJungle",
  "MonkeyMind",
  "BambooGrove",
  "PalmCoast",
  "BananaPath",
  "MonkeyShine",
  "JungleGem",
  "ApeEcho",
  "CanopyCove",
  "BananaRoot",
  "Leaflet",
  "PrimatePort",
  "Monkeystar",
  "Banyan",
  "CocoTrail",
  "VineLine",
  "JungleRise",
  "BananaPeel",
  "ApeAdventures",
  "MonkeySong",
  "PalmIsle",
  "TreetopTrek",
  "ChimpCharm",
  "SimianSquad",
  "BananaTrove",
  "ApeTracks",
  "JungleWhisper",
  "LeafyGreen",
  "PrimatePlaza",
  "MonkeyManor",
  "VineVista",
  "CoconutCoop",
  "BambooBloom",
  "BananaHarvest",
  "ApeAvenue",
  "JungleTrail",
  "Monkeystream",
  "PalmShade",
  "BananaSway",
  "TreetopTower",
  "SimianSquare",
  "VineyardValley",
  "JungleJive",
  "ApeHaven",
  "MonkeyMaze",
  "LeafyLush",
  "PrimateParade",
  "CocoDreams",
  "BananaBliss",
  "ApeDomain",
  "JungleCrest",
  "MonkeyMeadow",
  "PalmBreeze",
  "TropicTales",
  "BambooBliss",
  "BananaBloom",
  "ApeSanctuary",
  "JungleGlow",
];

const technologySector: string[] = [
  "Technologies",
  "Systems",
  "Digital",
  "Software",
  "Innovation",
  "Consulting",
  "Communications",
  "Telecom",
  "Corp",
  "Productions",
  "LLC",
  "Incorporated",
  "Global",
  "Worldwide",
  "Security",
  "Wireless",
  "Tools",
  "Media",
  "Electric",
];

const productionSector: string[] = [
  "Industries",
  "Enterprises",
  "Manufacturing",
  "Manufacturers",
  "Agriculture",
  "Dyanmics",
  "Brands",
  "& Partners",
  "Projects",
  "Farms",
  "Farmers",
  "Public",
];

const healthcareSector: string[] = [
  "Healthcare",
  "Pharmaceuticals",
  "Labs",
  "Solutions",
  "Specialties",
  "Health",
  "Bio",
  "Creations",
  "Medical",
  "Supplies",
  "Pharmacy",
  "Agency",
  "Biotech-Group",
  "Foundation",
  "Science",
];

const financialSector: string[] = [
  "Group",
  "Corp",
  "Ltd",
  "Ventures",
  "Holdings",
  "Investments",
  "Consultants",
  "Bank",
  "Insurance",
  "Trading",
];

const energySector: string[] = [
  "Energy",
  "Utilities",
  "Logistics",
];

const realEstateSector: string[] = [
  "Real Estate",
  "Properties",
  "Development",
];

export const sectorNames = [
  "Technology Sector",
  "Production Sector",
  "Healthcare Sector",
  "Financial Sector",
  "Energy Sector",
  "Real Estate Sector",
];

function generateCompanyName(): { name: string; sector: string } {
  const firstName =
    companyFirstNames[Math.floor(Math.random() * companyFirstNames.length)];
  const hasLastName = Math.random() > 0.2;
  let sector;

  if (hasLastName) {
    sector = getRandomSector();
    return { name: firstName, sector };
  } else {
    sector =
      productionSector[Math.floor(Math.random() * productionSector.length)];
    return { name: firstName, sector };
  }
}

function getRandomSector(): string {
  const sectors = [
    technologySector,
    productionSector,
    healthcareSector,
    financialSector,
    energySector,
    realEstateSector,
  ];
  const randomIndex = Math.floor(Math.random() * sectors.length);
  return sectors[randomIndex][
    Math.floor(Math.random() * sectors[randomIndex].length)
  ];
}

function CompanyNameToTicker(companyName: string): string {
  const firstName = companyName.split(" ")[0].toLowerCase();

  let ticker = "";

  const nonVowels = firstName.split("").filter((char) =>
    !"aeiou".includes(char)
  );
  if (nonVowels.length >= 3) {
    ticker = nonVowels.slice(0, 3).join("");
  } else {
    ticker = firstName.slice(0, 3);
  }

  while (ticker.length < 4) {
    ticker += firstName[Math.floor(Math.random() * firstName.length)];
  }

  return ticker.toUpperCase();
}

function nameToSector(lastName: string): string {
  const sectors = [
    technologySector,
    productionSector,
    healthcareSector,
    financialSector,
    energySector,
    realEstateSector,
  ];
  for (let i = 0; i < sectors.length; i++) {
    if (sectors[i].includes(lastName)) {
      return sectorNames[i];
    }
  }
  return "";
}

export function generateRandomCompany(): Company {
  const company: Company = {
    id: crypto.randomUUID(),
    name: "",
    ticker: "",
    sector: "",
  };
  const { name, sector } = generateCompanyName();
  const ticker = CompanyNameToTicker(name);

  company.name = name + " " + sector;
  company.ticker = ticker;
  company.sector = nameToSector(sector);
  return company;
}

