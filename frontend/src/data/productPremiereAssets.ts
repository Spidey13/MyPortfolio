export type PremiereAsset =
  | {
      kind: "video";
      src: string;
      alt: string;
      caption: string;
      durationLabel: string;
    }
  | {
      kind: "placeholder";
      label: string;
      brief: string;
      ratio: "landscape" | "portrait" | "square";
    };

export const PRODUCT_PREMIERE_ASSETS = {
  codieyHero: {
    kind: "video",
    src: "/codiey-demo.mp4",
    alt: "Codiey voice session showing repository inspection and a live reasoning graph",
    caption: "A real voice session — repository tools, graph context, and the spoken answer.",
    durationLabel: "02:05",
  },
  codieyGraph: {
    kind: "placeholder",
    label: "Repository reasoning graph",
    brief: "Final populated graph capture from the same session is pending.",
    ratio: "portrait",
  },
  codieyToolState: {
    kind: "placeholder",
    label: "Repository inspection state",
    brief: "Final readable file and tool-state capture is pending.",
    ratio: "landscape",
  },
  diagnostiqHero: {
    kind: "video",
    src: "/diagnostiq-demo.mp4",
    alt: "Diagnostiq demo moving from an equipment fault to cited manual evidence and a job card",
    caption: "One service call, from fault intake to a cited field procedure.",
    durationLabel: "05:21",
  },
  diagnostiqManual: {
    kind: "placeholder",
    label: "Cited manual page",
    brief: "Replace with the exact Trane page and highlighted region used by the final demo scenario.",
    ratio: "portrait",
  },
  diagnostiqArtifact: {
    kind: "placeholder",
    label: "Generated field artifact",
    brief: "Replace with the final checklist from the same service-call scenario.",
    ratio: "portrait",
  },
  remindQueryState: {
    kind: "placeholder",
    label: "Final query-state capture",
    brief: "The live DOM visualization is canonical; use this only if a product capture is stronger.",
    ratio: "landscape",
  },
} satisfies Record<string, PremiereAsset>;
