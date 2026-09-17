export const PRODUCT_PREMIERE_IDS = ["p2", "p6", "p8", "p9", "p10"] as const;

export type ProductPremiereId = (typeof PRODUCT_PREMIERE_IDS)[number];

const PRODUCT_PREMIERE_ID_SET = new Set<string>(PRODUCT_PREMIERE_IDS);

export const isProductPremiereId = (id: string): id is ProductPremiereId =>
  PRODUCT_PREMIERE_ID_SET.has(id);
