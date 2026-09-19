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
    caption: "A real voice session with repository tools, graph context, and the spoken answer.",
    durationLabel: "02:05",
  },
  diagnostiqHero: {
    kind: "video",
    src: "/diagnostiq-demo.mp4",
    alt: "Diagnostiq demo moving from an equipment fault to cited manual evidence and a job card",
    caption: "One service call, from fault intake to a cited field procedure.",
    durationLabel: "05:21",
  },
} satisfies Record<string, PremiereAsset>;
