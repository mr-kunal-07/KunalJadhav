import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const jobs = [
  ["assets/source/developer.png", "public/hero/developer", [384, 512, 768]],
  ["assets/source/office.webp", "public/hero/office", [384, 512, 768]],
  ["assets/source/coding-desk.webp", "public/hero/bike", [384, 512, 768]],
  ["assets/source/about.jpeg", "public/about-portrait", [384, 768]],
];
await mkdir("public/social", { recursive: true });
for (const [source, prefix, sizes] of jobs) {
  for (const width of sizes) {
    const destination = `${prefix}-${width}.webp`;
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(destination);
    console.log(`${destination}: ${(await stat(destination)).size} bytes`);
  }
}
for (const [source, prefix] of [
  ["assets/source/idsspl-redacted.png", "public/exp/idsspl-redacted"],
  ["assets/source/oohpoint-redacted.png", "public/exp/oohpoint-redacted"],
  ["assets/source/nestcraft-redacted.svg", "public/exp/nestcraft-redacted"],
]) {
  await sharp(source).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 95, effort: 6 }).toFile(`${prefix}.webp`);
  await sharp(source).resize({ width: 240, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(`${prefix}-thumb.webp`);
  await sharp(source).resize({ width: 128, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(`${prefix}-thumb-small.webp`);
}
const portrait = await sharp("assets/source/developer.png").resize(540, 630, { fit: "cover", position: "attention" }).png().toBuffer();
const card = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#101010"/><text x="64" y="185" fill="#b8b8b8" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">DEVELOPER PORTFOLIO</text><text x="60" y="270" fill="#fafafa" font-family="Arial,sans-serif" font-size="64" font-weight="700">Kunal Jadhav</text><text x="64" y="333" fill="#eeeeee" font-family="Arial,sans-serif" font-size="29">Full Stack Developer</text><text x="64" y="385" fill="#b8b8b8" font-family="Arial,sans-serif" font-size="23">React · Next.js · Node.js</text><text x="64" y="520" fill="#b8b8b8" font-family="Arial,sans-serif" font-size="22">Mumbai, India</text><text x="64" y="558" fill="#fafafa" font-family="Arial,sans-serif" font-size="21">kunaltech.vercel.app</text></svg>`);
await sharp(card).composite([{ input: portrait, left: 660, top: 0 }]).jpeg({ quality: 88 }).toFile("public/social/kunal-jadhav.jpg");
