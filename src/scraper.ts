import { followLinks } from "./links";
import { downloadUrl } from "./page";

const testUrl = new URL("https://example.com");
const TEST_DEPTH = 1;

(async (url) => {
  try {
    const data = await downloadUrl(url);

    if (!data) {
      console.log("no links found");
      return null;
    }

    const initialLink = testUrl.href;
    followLinks(initialLink, TEST_DEPTH);
  } catch (error) {
    console.error(`Failed to get links of page with error: ${error}`);
  }
})(testUrl);
