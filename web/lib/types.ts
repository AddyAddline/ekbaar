export type FactStatus = "candidate" | "confirmed";

export interface Fact {
  id: string;
  label: string;
  field: string;
  value: string;
  sourceKind: "statement" | "evidence" | "model";
  sourceName: string; // e.g. "Your account of the incident" or "Synthetic UPI receipt.png"
  locator?: string; // e.g. "Amount row"
  confidence: number;
  status: FactStatus;
}

export interface EvidenceItem {
  id: string;
  name: string;
  kind: "transfer_receipt" | "chat_screenshot";
  src: string;
}

export interface CaseEvent {
  id: string;
  at: string; // display time
  source: "system" | "ncrp" | "bank";
  raw: string;
  simulated: boolean;
  establishes?: string[];
  notEstablished?: string[];
  nextAction?: string;
}

export interface ActionItem {
  id: string;
  label: string;
  detail?: string;
  sourceId: string;
  status: "pending" | "done";
}

export type WorkflowState =
  | "urgent action required"
  | "collecting evidence"
  | "ready to file"
  | "filed and acknowledged"
  | "official update received"
  | "citizen action required";

export interface Msg {
  id: string;
  role: "system" | "user";
  text: string;
  badge?: string; // e.g. rule source chip
}

export interface Packet {
  id: string;
  recipient: string;
  title: string;
  lines: { label: string; value: string }[];
  note: string;
}
