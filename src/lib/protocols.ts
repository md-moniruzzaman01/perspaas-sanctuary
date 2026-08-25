export type ProtocolCategory =
  | "Meeting"
  | "Negotiation"
  | "Presentation"
  | "Crisis"
  | "Media"
  | "Investor"
  | "Legal"
  | "Leadership";

export type Difficulty = "Foundational" | "Intermediate" | "Advanced";

export interface ProtocolStep {
  title: string;
  instruction: string;
  seconds: number;
  breathing?: boolean;
}

export interface Protocol {
  id: string;
  name: string;
  durationMinutes: number;
  category: ProtocolCategory;
  difficulty: Difficulty;
  stressLevel: "Elevated" | "High" | "Acute";
  goal: string;
  outcome: string;
  description: string;
  steps: ProtocolStep[];
}

export const protocols: Protocol[] = [
  {
    id: "high-pressure-reset",
    name: "3-Minute High-Pressure Reset",
    durationMinutes: 3,
    category: "Crisis",
    difficulty: "Foundational",
    stressLevel: "Acute",
    goal: "Down-regulate acute stress response",
    outcome: "Steady breath, level voice, controlled tempo",
    description:
      "The default emergency protocol. Deployed in corridors, cars, and green rooms minutes before you are seen.",
    steps: [
      {
        title: "Physiological Sigh",
        instruction:
          "Two sharp inhales through the nose — one full, one short topping breath. Then one long, complete exhale through the mouth. Repeat five times.",
        seconds: 45,
        breathing: true,
      },
      {
        title: "Ground Through the Feet",
        instruction:
          "Press both heels into the floor. Feel the weight travel up through the legs. Unlock the knees. Let the floor hold you rather than your muscles.",
        seconds: 25,
      },
      {
        title: "Release the Face",
        instruction:
          "Unclench the jaw and separate the back teeth. Soften the space between the eyebrows. Let the tongue drop from the roof of the mouth.",
        seconds: 25,
      },
      {
        title: "Cold Point",
        instruction:
          "Notice the coolest air you can feel — at the nostrils, the wrists, the back of the neck. Hold attention there. It interrupts the alarm loop.",
        seconds: 30,
      },
      {
        title: "One Sentence",
        instruction:
          "Choose the single sentence you will say first. Say it internally, slowly, and stop. Do not rehearse the second one.",
        seconds: 35,
      },
    ],
  },
  {
    id: "executive-recovery",
    name: "5-Minute Executive Recovery",
    durationMinutes: 5,
    category: "Leadership",
    difficulty: "Intermediate",
    stressLevel: "High",
    goal: "Full physiological and cognitive reset",
    outcome: "Restored decision quality after sustained load",
    description:
      "A longer sequence for the end of an escalating day, or between two consecutive high-consequence conversations.",
    steps: [
      {
        title: "Extended Exhale Cycling",
        instruction:
          "Inhale four counts through the nose. Exhale eight counts through the mouth. Eight full cycles. Longer out than in, every time.",
        seconds: 80,
        breathing: true,
      },
      {
        title: "Systematic Muscle Release",
        instruction:
          "Work downward: brow, jaw, throat, shoulders, hands, abdomen, thighs, feet. Tense each for three seconds, then let it go completely.",
        seconds: 60,
      },
      {
        title: "Cognitive Offload",
        instruction:
          "Name every unresolved item still running in the background. For each one, assign the hour you will address it. Then close it.",
        seconds: 55,
      },
      {
        title: "Decision Audit",
        instruction:
          "Identify the last decision you made under load. Ask once: would you make it again with a clear head? Note the answer. Do not relitigate it.",
        seconds: 45,
      },
      {
        title: "Horizon Shift",
        instruction:
          "Look at the furthest point available to you — a window, a corridor, a wall. Soften your gaze wide. Peripheral vision lowers arousal.",
        seconds: 30,
      },
      {
        title: "Re-Entry Intention",
        instruction:
          "State the standard you are returning at: measured, unhurried, precise. Take one breath at that tempo before you move.",
        seconds: 30,
      },
    ],
  },
  {
    id: "pre-board",
    name: "Pre-Board Meeting Protocol",
    durationMinutes: 4,
    category: "Meeting",
    difficulty: "Intermediate",
    stressLevel: "High",
    goal: "Command the room before entering it",
    outcome: "Measured pace, authoritative presence",
    description: "Calibrates tempo and tone for governance settings where restraint reads as strength.",
    steps: [
      {
        title: "Cadence Breathing",
        instruction:
          "Inhale five counts. Exhale five counts. Even and unhurried. This is the tempo your speech will inherit in the room.",
        seconds: 50,
        breathing: true,
      },
      {
        title: "Vertical Posture",
        instruction:
          "Lengthen through the crown of the head. Shoulders back and down, not lifted. Sit or stand as though the chair is optional.",
        seconds: 30,
      },
      {
        title: "Chest Resonance",
        instruction:
          "Hum low on the exhale until you feel vibration in the sternum, not the throat. Three passes. This is the register you will open in.",
        seconds: 35,
      },
      {
        title: "The Single Question",
        instruction:
          "Name the one question the board actually needs answered. Everything else in your material is supporting evidence for it.",
        seconds: 40,
      },
      {
        title: "Rehearse the Pause",
        instruction:
          "Imagine the hardest question. Count two full seconds before answering. Practise the silence — it is the signal of authority.",
        seconds: 40,
      },
      {
        title: "Entry Frame",
        instruction:
          "You are not being examined; you are reporting stewardship. Walk in at half your usual pace.",
        seconds: 25,
      },
    ],
  },
  {
    id: "investor-pitch",
    name: "Investor Pitch Reset",
    durationMinutes: 3,
    category: "Investor",
    difficulty: "Foundational",
    stressLevel: "High",
    goal: "Convert anticipation into conviction",
    outcome: "Clear narrative, unhurried delivery",
    description: "Sharpens the opening ninety seconds, where capital decisions are informally made.",
    steps: [
      {
        title: "Energy Channelling Breath",
        instruction:
          "Inhale four counts. Hold four. Exhale six. Four cycles. You are not eliminating the charge — you are directing it.",
        seconds: 45,
        breathing: true,
      },
      {
        title: "Open the Sternum",
        instruction:
          "Roll the shoulders back once and let the chest stay open. Hands unclenched and visible. Closed posture reads as doubt.",
        seconds: 25,
      },
      {
        title: "The Thesis in One Line",
        instruction:
          "State your thesis internally in a single sentence, without qualifiers. If it needs a caveat, you are not ready to say it out loud.",
        seconds: 40,
      },
      {
        title: "Anchor the Number",
        instruction:
          "Fix the raise amount and its use in mind. Say them without apology or upward inflection. Never end a number on a question.",
        seconds: 30,
      },
      {
        title: "Own the First Ninety Seconds",
        instruction:
          "Deliver your opening line internally at deliberate speed. Slow is expensive; fast is available. Choose slow.",
        seconds: 35,
      },
    ],
  },
  {
    id: "media-interview",
    name: "Media Interview Reset",
    durationMinutes: 3,
    category: "Media",
    difficulty: "Advanced",
    stressLevel: "Acute",
    goal: "Protect message discipline under scrutiny",
    outcome: "Controlled pauses, no reactive answers",
    description: "Built for live and recorded formats where every hesitation is preserved permanently.",
    steps: [
      {
        title: "Silent Nasal Breathing",
        instruction:
          "Breathe only through the nose, low into the belly, silently. Six cycles. Audible breath carries on a microphone.",
        seconds: 40,
        breathing: true,
      },
      {
        title: "Throat and Jaw Release",
        instruction:
          "Swallow once. Drop the jaw slightly. Relax the throat so the voice sits low. Tension pitches the voice upward on camera.",
        seconds: 25,
      },
      {
        title: "Three Pillars",
        instruction:
          "Fix your three message points. Every answer routes back to one of them. If a question fits none, bridge and return.",
        seconds: 45,
      },
      {
        title: "The Two-Second Rule",
        instruction:
          "Rehearse waiting two seconds before every answer. It removes reactivity and gives the editor a clean cut point.",
        seconds: 35,
      },
      {
        title: "Pre-Commit to the Line You Will Not Cross",
        instruction:
          "Name the one thing you will not say today. Decide it now, while calm, not under a follow-up question.",
        seconds: 35,
      },
    ],
  },
  {
    id: "hostile-negotiation",
    name: "Hostile Negotiation Reset",
    durationMinutes: 4,
    category: "Negotiation",
    difficulty: "Advanced",
    stressLevel: "Acute",
    goal: "Neutralize provocation response",
    outcome: "Emotional detachment from tactics",
    description: "For adversarial tables where the other side benefits from your escalation.",
    steps: [
      {
        title: "Box Breathing",
        instruction:
          "Inhale four. Hold four. Exhale four. Hold four. Six full squares. The rhythm blunts the provocation reflex.",
        seconds: 55,
        breathing: true,
      },
      {
        title: "Neutral Face",
        instruction:
          "Relax the brow and jaw into a flat, unreadable expression. Hold it. Your face is information you are giving away for free.",
        seconds: 30,
      },
      {
        title: "Depersonalize the Tactic",
        instruction:
          "Whatever they do next is a move, not a message about you. Label it silently — pressure, anchor, insult — and let it pass.",
        seconds: 45,
      },
      {
        title: "Fix the Walk-Away",
        instruction:
          "State your walk-away line precisely. Numbers, terms, date. A defined floor makes you immune to their tempo.",
        seconds: 45,
      },
      {
        title: "Slow Speech Calibration",
        instruction:
          "Rehearse one sentence at 70 percent of your normal speed. Under attack, speed rises. Set the governor now.",
        seconds: 35,
      },
      {
        title: "Silence Tolerance",
        instruction:
          "Sit through five seconds of deliberate silence. Whoever is uncomfortable first concedes. It will not be you.",
        seconds: 30,
      },
    ],
  },
  {
    id: "brand-crisis",
    name: "Brand Crisis Reset",
    durationMinutes: 5,
    category: "Crisis",
    difficulty: "Advanced",
    stressLevel: "Acute",
    goal: "Stabilize judgment during an active incident",
    outcome: "Sequenced thinking under compressed time",
    description: "Deployed inside war rooms when information is incomplete and the clock is public.",
    steps: [
      {
        title: "Emergency Down-Regulation",
        instruction:
          "Two sharp inhales, one long exhale. Six repetitions. Fastest available route out of the acute stress state.",
        seconds: 50,
        breathing: true,
      },
      {
        title: "Separate Fact From Fear",
        instruction:
          "List what is confirmed. Then list what is assumed. Act only on the first column for the next hour.",
        seconds: 55,
      },
      {
        title: "Establish the Time Horizon",
        instruction:
          "Fix your next decision point — thirty minutes, two hours, end of day. You are not solving the whole crisis, only reaching that marker.",
        seconds: 45,
      },
      {
        title: "Identify the Irreversible",
        instruction:
          "Name any action on the table that cannot be undone. Those require a second opinion. Everything else can move now.",
        seconds: 50,
      },
      {
        title: "Assign, Do Not Absorb",
        instruction:
          "For each open thread, name the owner. If you own more than three, you are the bottleneck. Redistribute.",
        seconds: 45,
      },
      {
        title: "Composure as Signal",
        instruction:
          "The room calibrates to you. Lower your voice, slow your pace, and take one visible breath before you speak next.",
        seconds: 35,
      },
    ],
  },
  {
    id: "difficult-conversation",
    name: "Difficult Conversation Reset",
    durationMinutes: 3,
    category: "Legal",
    difficulty: "Intermediate",
    stressLevel: "Elevated",
    goal: "Separate the person from the decision",
    outcome: "Firm, humane, unambiguous delivery",
    description: "Terminations, disputes, and counsel-adjacent conversations that must remain composed.",
    steps: [
      {
        title: "Settling Breath",
        instruction:
          "Inhale four counts. Exhale seven counts. Five cycles. Steady enough to speak clearly, soft enough to listen.",
        seconds: 45,
        breathing: true,
      },
      {
        title: "Soften Without Collapsing",
        instruction:
          "Drop the shoulders and unclench the hands, but keep the spine long. Firm posture, open face. Both are required.",
        seconds: 25,
      },
      {
        title: "The First Two Sentences",
        instruction:
          "Draft the opening exactly. Lead with the decision, not the preamble. Ambiguity is the cruelty here, not directness.",
        seconds: 45,
      },
      {
        title: "Separate Person From Decision",
        instruction:
          "The decision is final; the person is not the decision. Hold both. Do not soften the first to comfort yourself.",
        seconds: 35,
      },
      {
        title: "Prepare to Absorb",
        instruction:
          "Expect anger, silence, or bargaining. Your task is to stay present and repeat the decision once, calmly, without new justifications.",
        seconds: 35,
      },
    ],
  },
];


export const categories: ProtocolCategory[] = [
  "Meeting",
  "Negotiation",
  "Presentation",
  "Crisis",
  "Media",
  "Investor",
  "Legal",
  "Leadership",
];

export const getProtocol = (id: string) => protocols.find((p) => p.id === id);

export const protocolDuration = (p: Protocol) =>
  p.steps.reduce((total, step) => total + step.seconds, 0);
