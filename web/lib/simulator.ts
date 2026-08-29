// The scam-call simulator script. Deterministic, built from the documented
// digital-arrest pattern in MHA/PIB releases (see docs/research/facts.md).
// Every "tell" cites the sourced rule it teaches.

export interface SimChoice {
  label: string;
  safe: boolean;
  feedback: string;
}

export interface SimBeat {
  caller: string[];
  pressure?: string; // what the scammer is doing psychologically
  choices: SimChoice[];
  tell: { title: string; detail: string; source: string };
}

export const SIM_BEATS: SimBeat[] = [
  {
    caller: [
      "Hello. I am calling from Mumbai Cyber Cell. A parcel booked against your Aadhaar number has been seized with illegal drugs inside.",
      "This is a matter of national security. Switch on your video immediately for verification.",
    ],
    pressure: "Authority + shock. A crime you know nothing about, tied to your identity.",
    choices: [
      {
        label: "Turn on video, it's the police, better to cooperate",
        safe: false,
        feedback:
          "This is the trap. Real investigators do not conduct proceedings over video calls. Staying on video is how they keep you isolated and afraid.",
      },
      {
        label: "Ask which police station, then say you'll visit in person",
        safe: true,
        feedback:
          "Exactly right. Real cases happen at police stations with written notices, not on WhatsApp video.",
      },
      {
        label: "Hang up immediately",
        safe: true,
        feedback:
          "Also correct. You cannot be arrested by phone. Hanging up on a fraudster is not a crime.",
      },
    ],
    tell: {
      title: "Tell #1, the video call itself",
      detail:
        "No government agency conducts investigations via phone or video calls. Police, CBI, customs and RBI do not work this way.",
      source: "MHA, Oct 2024 · pib.gov.in",
    },
  },
  {
    caller: [
      "Do not disconnect! I am sending you the arrest warrant with the official seal. See, your name, your Aadhaar.",
      "You are now under digital arrest. You may not leave the camera or contact anyone. Even your family must not know, or they become accomplices.",
    ],
    pressure: "Isolation. The secrecy demand is what makes the scam work.",
    choices: [
      {
        label: "Stay quiet and comply, the warrant looks real",
        safe: false,
        feedback:
          "Documents with seals are trivial to fake. And 'digital arrest' does not exist, there is no such procedure in Indian law.",
      },
      {
        label: "Tell them you are calling a family member right now",
        safe: true,
        feedback:
          "The moment you break the silence, the scam starts dying. Fraudsters demand secrecy because any second opinion exposes them.",
      },
      {
        label: "Ask them to email the warrant to you and end the call",
        safe: true,
        feedback:
          "Good instinct: get off the live call. Real legal process doesn't collapse because you hung up.",
      },
    ],
    tell: {
      title: "Tell #2, the secrecy order",
      detail:
        "“Tell no one” is not law enforcement, it is control. Real police have no problem with your family or a lawyer knowing.",
      source: "Documented pattern · I4C advisory reporting",
    },
  },
  {
    caller: [
      "There is one way to avoid arrest tonight. Transfer ₹1,20,000 to the RBI verification account I am sending. If you are innocent, the money returns in 30 minutes.",
      "Do it now. The senior officer is waiting.",
    ],
    pressure: "Urgency + a fake exit. The payment is framed as the safe choice.",
    choices: [
      {
        label: "Pay, it comes back if you're innocent, and this ends",
        safe: false,
        feedback:
          "This is the moment the money leaves forever. There is no such thing as a verification payment. The RBI does not hold citizens' money to prove innocence.",
      },
      {
        label: "Refuse, hang up, and call 1930",
        safe: true,
        feedback:
          "This is the correct exit at any point in the call: end it, then report it on 1930 or cybercrime.gov.in, immediately if any money already moved.",
      },
      {
        label: "Stall and ask for the officer's ID number",
        safe: false,
        feedback:
          "Better than paying, but every minute on the call is theirs, and they have fake IDs ready. Don't negotiate. Leave.",
      },
    ],
    tell: {
      title: "Tell #3, payment to prove innocence",
      detail:
        "No agency asks for money for verification, bail-by-phone, or 'account auditing.' A demand for payment is the confession, theirs.",
      source: "MHA, Oct 2024 · pib.gov.in",
    },
  },
];

export const SIM_DEBRIEF = {
  mantra: "Ruko. Socho. Action lo.",
  mantraSource: "the national mantra for this scam, MHA, Oct 2024",
  actions: [
    "End the call. You cannot be arrested by phone.",
    "Call 1930, immediately if money moved.",
    "Report at the portal, and tell one person you trust.",
  ],
};
