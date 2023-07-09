import { getLinks } from "./links";
import { downloadUrl } from "./page";

const testUrl = new URL("https://wikipedia.com");

(async (url) => {
  try {
    const data = await downloadUrl(url);

    if (!data) {
      console.log("no links found");
      return null;
    }

    const links = getLinks(data);
    console.log(links);
  } catch (error) {
    console.error(`Failed to get links of page with error: ${error}`);
  }
})(testUrl);
