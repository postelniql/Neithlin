import { followLinks } from "./links";
import { downloadUrl } from "./page";

const testUrl = new URL("https://example.com");
const TEST_DEPTH = 3;

(async (url) => {
  try {
    const initialLink = url.href;

    const scraper = followLinks(initialLink, TEST_DEPTH);
    for await (let link of scraper) {
      console.log(`Yielding link: ${link.url} at depth ${link.depth}`);
    }
  } catch (error) {
    console.error(`Failed to get links of page with error: ${error}`);
  }
})(testUrl);
