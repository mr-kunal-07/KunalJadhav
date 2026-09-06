import assert from "node:assert/strict";
import { readFile, access, stat } from "node:fs/promises";
import { JSDOM } from "jsdom";
import sharp from "sharp";

const origin = "https://kunaltech.vercel.app";
const titles = new Set();
for (const [file, route, indexable] of [["index.html", "/", true], ["kunal-resume/index.html", "/kunal-resume", true], ["articles/index.html", "/articles", true], ["admin/index.html", "/admin", false], ["404.html", "/404", false]]) {
  const html = await readFile(`dist/${file}`, "utf8");
  const { document } = new JSDOM(html).window;
  assert.equal(document.documentElement.lang, "en");
  assert.equal(document.querySelectorAll("h1").length, 1, `${route}: one main heading`);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(document.querySelector('link[rel="canonical"]').href, origin + route);
  assert.ok(!titles.has(document.title), "Route titles must be distinct");
  titles.add(document.title);
  assert.ok(document.querySelector('meta[name="description"]').content.length > 60);
  assert.equal(document.querySelector('meta[property="og:url"]').content, origin + route);
  assert.equal(document.querySelector('meta[name="robots"]').content.includes("noindex"), !indexable);
  assert.equal(document.querySelector("#root").dataset.prerendered, route);
  assert.ok(document.querySelector("#root").textContent.length > (route === "/" ? 3000 : 20), "Content must exist without executing JavaScript");
  for (const image of document.querySelectorAll("img")) {
    assert.ok(image.alt, "Images need meaningful alt text");
    if (image.src.startsWith("/")) await access(`dist${image.src}`);
    for (const candidate of image.srcset.split(",").filter(Boolean)) {
      const source = candidate.trim().split(/\s+/)[0];
      if (source.startsWith("/")) await access(`dist${source}`);
    }
  }
  if (route === "/") {
    for (const id of ["home", "experience", "about", "projects", "articles", "contact"]) assert.ok(document.getElementById(id), `Missing static section: ${id}`);
    const sectionIds = [...document.querySelectorAll("main > section")].map(section => section.id);
    assert.equal(sectionIds[sectionIds.indexOf("projects") + 1], "articles", "Articles should immediately follow Projects");
    assert.ok(document.querySelector('#articles a[href="/articles"]'), "Homepage must link to the articles route");
    const graph = JSON.parse(document.getElementById("profile-structured-data").textContent)["@graph"];
    const person = graph.find(node => node["@type"] === "Person");
    assert.equal(person.worksFor.name, "IDSSPL Technologies Pvt. Ltd.");
    assert.equal(graph.find(node => node["@type"] === "ProfilePage").mainEntity["@id"], person["@id"]);
    assert.equal(document.querySelector('link[as="image"]').getAttribute("href"), "/hero/developer-768.webp");
    assert.equal(document.querySelector('img[fetchpriority="high"]').getAttribute("src"), "/hero/developer-768.webp");
    assert.equal(document.querySelector('link[as="image"]').getAttribute("imagesrcset"), document.querySelector('img[fetchpriority="high"]').getAttribute("srcset"), "Hero preload must match responsive image candidates");
    assert.equal(document.querySelectorAll("dialog img").length, 0, "Full letters should load only after opening");
  } else assert.equal(document.querySelector('script[type="application/ld+json"]'), null);
  console.log(`SEO checks passed: ${route}`);
}
const sitemap = new JSDOM(await readFile("dist/sitemap.xml", "utf8"), { contentType: "application/xml" });
assert.deepEqual([...sitemap.window.document.querySelectorAll("loc")].map(node => node.textContent), [origin + "/", origin + "/kunal-resume", origin + "/articles"]);
assert.ok((await readFile("dist/robots.txt", "utf8")).includes(`Sitemap: ${origin}/sitemap.xml`));
assert.match(await readFile("dist/llms.txt", "utf8"), /^# Kunal Jadhav\r?\n/);
const social = await sharp("dist/social/kunal-jadhav.jpg").metadata();
assert.equal(social.width, 1200);
assert.equal(social.height, 630);
for (const image of ["hero/developer-768.webp", "about-portrait-768.webp"]) assert.ok((await stat(`dist/${image}`)).size < 100000, `${image} image budget exceeded`);
assert.ok((await readFile("dist/sw.js", "utf8")).includes("kunal-resume/index.html"), "Offline revisions should include prerendered pages");
console.log("Sitemap, robots, social image, deferred letters and image budgets passed.");
