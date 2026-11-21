import type { ComponentType } from "react";
import BranchVoicePremiere from "./premieres/BranchVoicePremiere";
import CachefaultPremiere from "./premieres/CachefaultPremiere";
import CodieyPremiere from "./premieres/CodieyPremiere";
import DiagnostiqPremiere from "./premieres/DiagnostiqPremiere";
import QueueWhispererPremiere from "./premieres/QueueWhispererPremiere";
import ReMindPremiere from "./premieres/ReMindPremiere";
import type { PremierePageProps } from "./premieres/PremiereShared";

const PREMIERE_PAGES: Record<string, ComponentType<PremierePageProps>> = {
  p2: ReMindPremiere,
  p6: CodieyPremiere,
  p8: DiagnostiqPremiere,
  p9: QueueWhispererPremiere,
  p10: CachefaultPremiere,
  p12: BranchVoicePremiere,
};

export default function ProductPremiere({ project, previous, next }: PremierePageProps) {
  const Page = PREMIERE_PAGES[project.id];
  if (!Page) return null;
  return <Page project={project} previous={previous} next={next} />;
}
