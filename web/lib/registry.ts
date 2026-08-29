// Synthetic suspect registry for the demo. Mirrors NCRP's "Report & Check
// Suspect" facility in shape. No real numbers, IDs, sites or people.

export interface RegistryEntry {
  id: string;
  kind: "mobile" | "upi" | "website" | "account";
  value: string;
  normalized: string[];
  reports: number;
  firstReported: string;
  pattern: string;
  status: "under review" | "blocked on request" | "forwarded to LEA";
}

export const REGISTRY: RegistryEntry[] = [
  {
    id: "SUS-0001",
    kind: "mobile",
    value: "+91 98XX XXX 431",
    normalized: ["98xxxxx431", "9198xxxxx431", "98431"],
    reports: 14,
    firstReported: "2026-07-30",
    pattern: "Digital arrest, impersonating police over WhatsApp video calls",
    status: "forwarded to LEA",
  },
  {
    id: "SUS-0002",
    kind: "account",
    value: "a/c ending 4471 · Example Bank",
    normalized: ["4471"],
    reports: 9,
    firstReported: "2026-08-04",
    pattern: "Mule account receiving “verification” payments",
    status: "under review",
  },
  {
    id: "SUS-0003",
    kind: "upi",
    value: "quickkyc.verify@examplepay",
    normalized: ["quickkyc.verify@examplepay", "quickkyc"],
    reports: 22,
    firstReported: "2026-07-12",
    pattern: "Fake KYC-update collection VPA",
    status: "blocked on request",
  },
  {
    id: "SUS-0004",
    kind: "website",
    value: "aadhaar-parcel-clearance.example",
    normalized: ["aadhaar-parcel-clearance.example", "aadhaar-parcel-clearance", "parcel-clearance"],
    reports: 31,
    firstReported: "2026-06-28",
    pattern: "Fake customs-clearance payment page used in parcel scams",
    status: "forwarded to LEA",
  },
];

export function searchRegistry(qRaw: string): RegistryEntry[] {
  const q = qRaw.trim().toLowerCase().replace(/[\s-]+/g, "");
  if (q.length < 3) return [];
  return REGISTRY.filter(
    (e) =>
      e.normalized.some((n) => n.includes(q) || q.includes(n)) ||
      e.value.toLowerCase().replace(/[\s-]+/g, "").includes(q)
  );
}
