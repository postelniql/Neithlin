import { getLinks } from "./links";
import { downloadUrl } from "./page";

const testUrl = new URL("https://example.com");
downloadUrl(testUrl)
  .then((data) => (data ? console.log(getLinks(data)) : console.log("no data")))
  .catch((err) => console.error(err));
