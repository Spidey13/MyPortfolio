import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, getJsonLd, getRouteSeo } from "./routeSeo";

const GENERATED_ATTRIBUTE = "data-seo-generated";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const element = document.createElement("meta");
  element.setAttribute(attribute, key);
  element.setAttribute("content", content);
  element.setAttribute(GENERATED_ATTRIBUTE, "true");
  document.head.appendChild(element);
}

export default function RouteSeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = getRouteSeo(pathname);
    const canonical = absoluteUrl(route.canonicalPath);
    const robots = route.indexing === "index" ? "index,follow,max-image-preview:large" : "noindex,follow";

    document.title = route.title;
    document.head.querySelectorAll(`[${GENERATED_ATTRIBUTE}], meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]`).forEach((element) => element.remove());
    setMeta("name", "description", route.description);
    setMeta("name", "robots", robots);

    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = canonical;
    canonicalLink.setAttribute(GENERATED_ATTRIBUTE, "true");
    document.head.appendChild(canonicalLink);

    setMeta("property", "og:type", route.pageType === "article" ? "article" : "website");
    setMeta("property", "og:title", route.title);
    setMeta("property", "og:description", route.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:site_name", "Prathamesh More");
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", route.title);
    setMeta("name", "twitter:description", route.description);
    setMeta("name", "twitter:url", canonical);

    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.setAttribute(GENERATED_ATTRIBUTE, "true");
    jsonLd.textContent = JSON.stringify(getJsonLd(route));
    document.head.appendChild(jsonLd);
  }, [pathname]);

  return null;
}
