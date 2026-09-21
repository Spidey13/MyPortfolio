import { PROFILE } from "../data/profile";
import { PROJECTS, type Project } from "../data/projects";
import { PROJECT_META } from "../redesign/projectMeta";

export const SEO = {
  origin: "https://www.prathamesh-more.com",
  siteName: "Prathamesh More",
  fullName: "Prathamesh Pravin More",
  professionalTitle: "AI Engineer",
  language: "en-US",
  homepageTitle: "Prathamesh More | AI Engineer",
  homepageDescription:
    "Prathamesh More is an AI engineer building agents, retrieval systems, evaluation tools, and applied machine learning products.",
  personId: "https://www.prathamesh-more.com/#person",
  websiteId: "https://www.prathamesh-more.com/#website",
} as const;

export type RoutePageType = "website" | "article" | "webpage";
export type RouteIndexing = "index" | "noindex";

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  canonicalPath: string;
  pageType: RoutePageType;
  indexing: RouteIndexing;
  projectId?: string;
}

const PROJECT_BY_ID = new Map(PROJECTS.map((project) => [project.id, project]));

function projectEntry(project: Project): RouteSeo {
  const meta = PROJECT_META[project.id];
  if (!meta) throw new Error(`Missing project metadata for ${project.id}`);

  const descriptionSource = `${meta.shortName}: ${meta.home.thesis}`;
  const descriptionSuffix = descriptionSource.length >= 80
    ? " Explore the technical decisions in this case study by Prathamesh More."
    : " Explore the technical decisions and evidence in this case study from Prathamesh More.";

  return {
    path: `/project/${project.id}`,
    title: `${meta.shortName} | ${SEO.siteName}`,
    description: `${descriptionSource}${descriptionSuffix}`,
    canonicalPath: `/project/${project.id}`,
    pageType: "article",
    indexing: "index",
    projectId: project.id,
  };
}

export const HOME_ROUTE: RouteSeo = {
  path: "/",
  title: SEO.homepageTitle,
  description: SEO.homepageDescription,
  canonicalPath: "/",
  pageType: "website",
  indexing: "index",
};

export const PROJECT_ROUTES = PROJECTS.map(projectEntry);

export const DEMO_ROUTE: RouteSeo = {
  path: "/demo/diagnostiq",
  title: "Diagnostiq demo | Prathamesh More",
  description: "Interactive Diagnostiq demo supporting the Diagnostiq AI technical support agent case study by Prathamesh More.",
  canonicalPath: "/project/p8",
  pageType: "webpage",
  indexing: "noindex",
  projectId: "p8",
};

export const LEGACY_ROUTES: RouteSeo[] = [
  {
    path: "/projects",
    title: HOME_ROUTE.title,
    description: HOME_ROUTE.description,
    canonicalPath: "/",
    pageType: "website",
    indexing: "noindex",
  },
  {
    path: "/experience/:id",
    title: HOME_ROUTE.title,
    description: HOME_ROUTE.description,
    canonicalPath: "/",
    pageType: "website",
    indexing: "noindex",
  },
];

export const ROUTE_SEO_MANIFEST: RouteSeo[] = [HOME_ROUTE, ...PROJECT_ROUTES, DEMO_ROUTE, ...LEGACY_ROUTES];

export const INDEXABLE_ROUTES = ROUTE_SEO_MANIFEST.filter((route) => route.indexing === "index");

export function absoluteUrl(path: string): string {
  return new URL(path, SEO.origin).toString();
}

export function getRouteSeo(pathname: string): RouteSeo {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const exact = ROUTE_SEO_MANIFEST.find((route) => route.path === normalizedPath);
  if (exact) return exact;
  if (normalizedPath.startsWith("/experience/")) return LEGACY_ROUTES[1];
  const projectMatch = normalizedPath.match(/^\/project\/([^/]+)$/);
  if (projectMatch) {
    const project = PROJECT_BY_ID.get(projectMatch[1]);
    if (project) return PROJECT_ROUTES.find((route) => route.projectId === project.id) ?? HOME_ROUTE;
  }
  return HOME_ROUTE;
}

function personStructuredData() {
  const links = Object.fromEntries(PROFILE.links.map((link) => [link.type, link.url]));
  return {
    "@type": "Person",
    "@id": SEO.personId,
    name: SEO.siteName,
    additionalName: "Pravin",
    alternateName: [SEO.fullName, "Spidey13"],
    url: absoluteUrl("/"),
    jobTitle: SEO.professionalTitle,
    sameAs: [links.github, links.linkedin, links.publications, "https://orcid.org/0009-0001-3761-0174"].filter(Boolean),
  };
}

export function getJsonLd(route: RouteSeo): Record<string, unknown> {
  if (route === HOME_ROUTE || route.path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": SEO.websiteId,
          name: SEO.siteName,
          alternateName: "Prathamesh More Portfolio",
          url: absoluteUrl("/"),
          inLanguage: SEO.language,
        },
        {
          "@type": "ProfilePage",
          "@id": `${absoluteUrl("/")}#profile`,
          name: SEO.homepageTitle,
          url: absoluteUrl("/"),
          isPartOf: { "@id": SEO.websiteId },
          mainEntity: { "@id": SEO.personId },
        },
        personStructuredData(),
      ],
    };
  }

  const project = route.projectId ? PROJECT_BY_ID.get(route.projectId) : undefined;
  if (project) {
    const canonical = absoluteUrl(route.canonicalPath);
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          name: route.title,
          description: route.description,
          url: canonical,
          isPartOf: { "@id": SEO.websiteId },
          mainEntity: { "@id": `${canonical}#creative-work` },
          inLanguage: SEO.language,
        },
        {
          "@type": "CreativeWork",
          "@id": `${canonical}#creative-work`,
          name: project.title,
          description: project.modalPreview.problemTeaser,
          url: canonical,
          author: { "@id": SEO.personId },
          keywords: project.technologies,
          ...(project.github_url ? { codeRepository: project.github_url } : {}),
        },
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: route.title,
    description: route.description,
    url: absoluteUrl(route.canonicalPath),
    isPartOf: { "@id": SEO.websiteId },
    inLanguage: SEO.language,
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export function renderSeoHead(route: RouteSeo): string {
  const canonical = absoluteUrl(route.canonicalPath);
  const robots = route.indexing === "index" ? "index,follow,max-image-preview:large" : "noindex,follow";
  const tags = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="${route.pageType === "article" ? "article" : "website"}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="${SEO.siteName}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:url" content="${canonical}" />`,
    `<script type="application/ld+json" data-seo-generated="true">${JSON.stringify(getJsonLd(route)).replace(/</g, "\\u003c")}</script>`,
  ];
  return `<!-- seo:generated:start -->\n${tags.join("\n")}\n<!-- seo:generated:end -->`;
}
