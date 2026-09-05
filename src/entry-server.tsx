import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
export { SEO_PAGES, SITE_URL, getStructuredData } from "./data/seo";

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    output.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    output.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    output.on("error", reject);
    const timer = setTimeout(() => { stream.abort(); reject(new Error(`Prerender timed out: ${url}`)); }, 30000);
    const stream = renderToPipeableStream(<App url={url} />, {
      onAllReady() { clearTimeout(timer); stream.pipe(output); },
      onShellError(error) { clearTimeout(timer); reject(error); },
      onError(error) { clearTimeout(timer); reject(error); },
    });
  });
}
