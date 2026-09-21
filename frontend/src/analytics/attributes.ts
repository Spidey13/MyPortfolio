export type PortfolioAction =
  | "assistant_open"
  | "assistant_submit"
  | "contact_email"
  | "github_profile_open"
  | "interactive_demo_open"
  | "linkedin_open"
  | "live_demo_open"
  | "project_navigation"
  | "project_open"
  | "publication_open"
  | "recorded_demo_open"
  | "repository_open"
  | "resume_open"
  | "technical_notes_open";

export type ActionLocation =
  | "about_navigation"
  | "assistant_dialog"
  | "contact"
  | "experience"
  | "identity_rail"
  | "mobile_navigation"
  | "project_body"
  | "project_evidence"
  | "project_footer"
  | "project_header"
  | "project_navigation"
  | "project_rail"
  | "publications";

interface CaptureAttributeOptions {
  action: PortfolioAction;
  location: ActionLocation;
  projectId?: string;
  navigationSource?: string;
}

export function captureAttributes({
  action,
  location,
  projectId,
  navigationSource,
}: CaptureAttributeOptions) {
  return {
    "data-ph-capture-attribute-portfolio-action": action,
    "data-ph-capture-attribute-action-location": location,
    ...(projectId
      ? { "data-ph-capture-attribute-project-id": projectId }
      : {}),
    ...(navigationSource
      ? { "data-ph-capture-attribute-navigation-source": navigationSource }
      : {}),
  };
}
