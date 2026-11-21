export interface IncidentReport {
  id: string;
  date: string;
  dist: number;
  addr: string;
  cls: keyof typeof incidentReportStatus;
  note: string;
  qs: readonly string[];
  win?: readonly [
    string,
    string
  ];
  lead?: string;
  read: string;
}
export interface IncidentRecallSource {
  id: string;
  org: string;
  title: string;
  range: readonly [
    number,
    number
  ];
  rtxt: string;
  quote: string;
  res: readonly [
    string,
    "warn" | "ok"
  ];
  date: string | null;
  cap: string;
  file: string;
  qs: readonly string[];
  lead: string;
  read: string;
}
/* verified: eval/results/runs/L1/packet.md + 00_sf311_snapshot.json */
const Q = {
  pin: (address: string) => `Is ${address} the same frontage and side of the street as the incident?`,
  closed: 'Request the work order, or confirm whether any repair was performed and when.',
  sched: 'Confirm whether the scheduled work was carried out, and whether before or after the incident date.',
  rfa: 'Request RFA 21566584 from SF Public Works. The 311 rows point to it but do not contain it.',
  later: 'Does this later report describe the same condition? It is not evidence of prior notice.'
};
export const incidentReportStatus = { work_scheduled: ['Closed, work scheduled', 'warn'], resolved_unspecified: ['Closed, resolved', ''], duplicate: ['Closed, duplicate', ''], open: ['Open', ''] };
export const incidentLocationCase: {
  incident: string;
  records: readonly IncidentReport[];
} = { incident: '2026-07-20', records: [
    {
      id: '101003489046', date: '2026-02-12', dist: 54, addr: '4847 Geary Blvd', cls: 'duplicate', note: 'Case Resolved - duplicate of RFA 21566584 -', qs: [Q.rfa], read: 'Declared a duplicate. The Aug 23 report cites the same RFA.'
    },
    {
      id: '101003807362', date: '2026-04-04', dist: 98, addr: '4933 Geary Blvd', cls: 'work_scheduled', note: "case_resolved - Maximo Service Request has been resolved Memo:emailed SCSR w/updates. Pending WO# 9172690 …", qs: [Q.sched], read: 'Closed with a work order still pending. No date for the work.'
    },
    {
      id: '101003861426', date: '2026-04-13', dist: 58, addr: '395 Funston Ave', cls: 'resolved_unspecified', note: 'Case Resolved - Resolved', qs: [Q.closed], read: 'Closed, with no repair described.'
    },
    {
      id: '101003934639', date: '2026-04-24', dist: 54, addr: '376 Funston Ave', cls: 'resolved_unspecified', note: 'Case Resolved - 4/28/26 site inspection, issues has been corrected.GD  -', qs: [Q.closed], read: 'The rules did not read this note as described work.'
    },
    {
      id: '101004057137', date: '2026-05-14', dist: 58, addr: '4784 Geary Blvd', cls: 'open', note: 'accepted', qs: [], read: 'Still open in the snapshot.'
    },
    {
      id: '101004322858', date: '2026-06-26', dist: 42, addr: '4841 Geary Blvd', cls: 'resolved_unspecified', note: 'Case Resolved - Resolved', qs: [Q.pin('4841 Geary Blvd, about 42 m away,'), Q.closed], read: 'Closed, with no repair described.'
    },
    {
      id: '101004322877', date: '2026-06-26', dist: 36, addr: '4837 Geary Blvd', cls: 'resolved_unspecified', note: 'Case Resolved - Resolved', qs: [Q.pin('4837 Geary Blvd, about 36 m away,'), Q.closed], read: 'The closest earlier report. Closed, with no repair described.'
    },
    {
      id: '101004430229', date: '2026-07-14', dist: 81, addr: '4901 Geary Blvd', cls: 'work_scheduled', note: 'case_resolved - Contractors will be installing new sidewalk between 7/27/26 and 7/31/26.', qs: [Q.pin('4901 Geary Blvd, about 81 m away,'), Q.sched], win: ['2026-07-27', '2026-07-31'], lead: 'Filed six days before the incident.', read: 'The note schedules work for after it. The packet shows status Closed with no closure date, and cannot say whether the work happened.'
    },
    {
      id: '101004679039', date: '2026-08-23', dist: 55, addr: '4845 Geary Blvd', cls: 'duplicate', note: 'Case Resolved - Duplicate of RFA # 21566584. Please contact Urban Forestry … for repair timeline/status. -', qs: [Q.later, Q.rfa], read: 'Filed after the incident. It cites the same RFA as the Feb 12 report.'
    },
    {
      id: '202000201702', date: '2026-10-19', dist: 0, addr: '4820 Geary Blvd', cls: 'open', note: 'open', qs: [Q.later], read: 'Filed three months after the incident, at the search center.'
    }
  ] };
/* verified: eval/results/runs/P2/packet.md, result.json, sources.json */
const PQ = { auth: 'Which serial range is authoritative? Ask the manufacturer or CPSC to reconcile them.', label: "Photograph the unit's data label to confirm model and serial as printed.", when: 'Was the unit inspected or repaired under the recall before or after the incident? Publication date is not knowledge date.' };
export const incidentRecallCase: {
  incident: string;
  serial: number;
  sources: readonly IncidentRecallSource[];
} = { incident: '2025-06-15', serial: 24000000, sources: [
    {
      id: 'S00', org: 'CPSC', title: 'CPSC recall 25369', range: [24061381, 24453189], rtxt: '24061381FA - 24453189FA', quote: '4YCZ5024F1060A 24061381FA - 24453189FA', res: ['out of range', 'warn'], date: '2025-07-03', cap: '2025-07-04T21:20:01Z', file: 'S00, saferproducts.gov Recall API, SHA-256 prefix bee7249c4e3d353a', qs: [PQ.auth, PQ.label, PQ.when],
      lead: 'The regulator range starts above the entered serial.', read: 'The notice is dated Jul 3, 2025, after the incident, so it was not public information on Jun 15.'
    },
    {
      id: 'S02', org: 'Trane', title: 'Trane recall page', range: [23494053, 24453189], rtxt: '23494053FA-24453189FA', quote: '23494053FA-24453189FA', res: ['IN RANGE', 'ok'], date: null, cap: '2025-07-03T14:54:19Z', file: 'S02, trane.com recall page, SHA-256 prefix ae278259b8718d2f', qs: [PQ.auth, PQ.label],
      lead: 'In range here, out of range at CPSC.', read: 'The packet keeps both. Overall applicability: needs clarification.'
    },
    {
      id: 'S04', org: 'American Standard', title: 'American Standard recall page', range: [23494053, 24453189], rtxt: '23494053FA-24453189FA', quote: '4YCZ5024F1060A [tab] 23494053FA-24453189FA', res: ['IN RANGE', 'ok'], date: null, cap: '2025-07-03T15:14:18Z', file: 'S04, americanstandardair.com recall page, SHA-256 prefix 27513ff2de2be7b3', qs: [PQ.auth],
      lead: 'A different brand.', read: 'The CPSC record names this page as a contact, and the extractor noted it is an American Standard recall, not Trane.'
    }
  ] };
export const incidentCaseStudy = {
  question: "After an injury, what was already on the public record, and what came later?",
  savedNotice: "Saved hypothetical case, nothing fetched live",
  locationSource: "Source S00, SF311 snapshot retrieved Oct 20, 2026. Closed does not mean repaired.",
  howItWorks: [
    "Each official source is stored as it was retrieved, with an ID and a hash.",
    "Claude extracts recall conditions and their supporting quotes. The location workflow uses SF311 records and rules on status notes.",
    "Plain code runs the checks. When sources disagree, both answers stay.",
  ],
  metrics: [
    ["Identifiers found", "117 of 192"],
    ["Quotes that hold the value", "98 of 106"],
    ["Range checks right, incl. abstaining", "30 of 30"],
  ],
  limits: [
    "The quote check flagged only 1 of 15 wrong conditions.",
    "58 of 75 missed identifiers sit in two flattened tables.",
    "Models wrote the labels, and the owner adjudicated disagreements. No domain-expert labels were used.",
  ],
  evaluation: [
    ["Identifier value precision, 40 recalls", "117/133"],
    ["Identifier value recall", "117/192"],
    ["Quote found and contains the value", "98/106"],
    ["Wrong conditions flagged by the quote check", "1/15"],
    ["Status notes, rules used in packets", "95/150"],
    ["Status notes, few-shot alternative", "115/150"],
    ["End-to-end expectations, 17 owner scenarios", "102/102"],
    ["Recorded model cost, 34 calls", "$0.2702"],
  ],
  identifiers: [
    ["UPC", 12, 12],
    ["Date code", 19, 19],
    ["Manufactured between", 17, 19],
    ["Lot", 14, 18],
    ["Serial", 37, 64],
    ["Model", 15, 57],
  ],
  evaluationNote: "Checker fixes were measured on identical cached model outputs: quote support 89/106 to 98/106, range probes 22/30 to 30/30.",
  snapshotNote: "The evaluation used development sets. 11,200 of 321,687 SF311 snapshot rows have zero coordinates and never fall inside a radius search.",
  footer: "Built solo with coding-agent help. Python, Claude structured outputs with Pydantic, DuckDB. The measured pipeline is in a local repository. The packet supplies research leads for review.",
} as const;
