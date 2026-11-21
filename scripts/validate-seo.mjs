import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("frontend/dist");
const read = (file) => fs.readFileSync(path.join(dist, file), "utf8");
const fail = (message) => {
  throw new Error(`SEO validation failed: ${message}`);
};
const first = (html, expression, label) => {
  const match = html.match(expression);
  if (!match?.[1]) fail(`${label} is missing`);
  return match[1];
};

if (!fs.existsSync(path.join(dist, "index.html"))) fail("dist/index.html is missing; run the production build first");

const projectFiles = fs.readdirSync(path.join(dist, "project"))
  .filter((file) => file.endsWith(".html"))
  .sort();
const indexableFiles = ["index.html", ...projectFiles.map((file) => `project/${file}`)];
const metadata = indexableFiles.map((file) => {
  const html = read(file);
  const title = first(html, /<title>([^<]+)<\/title>/i, `${file} title`);
  const description = first(html, /<meta\s+name="description"\s+content="([^"]+)"/i, `${file} description`);
  const canonical = first(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i, `${file} canonical`);
  const robots = first(html, /<meta\s+name="robots"\s+content="([^"]+)"/i, `${file} robots`);
  const jsonLd = first(html, /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i, `${file} JSON-LD`);

  if (!robots.startsWith("index,follow")) fail(`${file} is not indexable`);
  if (!canonical.startsWith("https://www.prathamesh-more.com/")) fail(`${file} uses a non-canonical hostname`);
  if (/og:image|twitter:image/i.test(html)) fail(`${file} contains a social image tag`);
  try {
    JSON.parse(jsonLd);
  } catch (error) {
    fail(`${file} contains invalid JSON-LD: ${error.message}`);
  }
  return { file, title, description, canonical };
});

for (const field of ["title", "description", "canonical"]) {
  const values = metadata.map((entry) => entry[field]);
  if (new Set(values).size !== values.length) fail(`indexable routes share a ${field}`);
}

const sitemap = read("sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length !== indexableFiles.length) {
  fail(`sitemap contains ${sitemapUrls.length} URLs for ${indexableFiles.length} indexable HTML routes`);
}
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail("sitemap contains duplicate URLs");
for (const entry of metadata) {
  if (!sitemapUrls.includes(entry.canonical)) fail(`${entry.file} is missing from the sitemap`);
}
if (sitemapUrls.some((url) => !url.startsWith("https://www.prathamesh-more.com/"))) fail("sitemap contains a non-canonical hostname");
if (sitemapUrls.some((url) => url.includes("/demo/") || url.includes("/projects") || url.includes("#"))) fail("sitemap contains an excluded route");

const demo = read("demo/diagnostiq.html");
if (!/content="noindex,follow"/i.test(demo)) fail("Diagnostiq demo is not noindex,follow");
if (sitemap.includes("/demo/diagnostiq")) fail("Diagnostiq demo appears in the sitemap");

const robots = read("robots.txt");
const expectedRobots = "User-agent: *\nAllow: /\n\nSitemap: https://www.prathamesh-more.com/sitemap.xml\n";
if (robots !== expectedRobots) fail("robots.txt does not match the required crawl policy");

console.log(`SEO validation passed: ${metadata.length} indexable HTML routes, ${sitemapUrls.length} sitemap URLs, and one noindex demo route.`);
