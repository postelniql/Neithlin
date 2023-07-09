import { JSDOM } from "jsdom";

import { downloadUrl, PageData } from "./page";

type Link = string;

interface LinkWithDepth {
  value: Link;
  depth: number;
}

const getLinksFromPage = (page: PageData): Link[] => {
  const dom = new JSDOM(page.content, { url: page.url });
  const aTags = dom.window.document.querySelectorAll("a");
  const links = Array.from(aTags).map((a) => a.href);
  return links;
};

export const followLinks = async function* (
  initialLink: Link,
  maxDepth: number
) {
  let followedLinks = new Set<Link>();
  let linksToFollow: LinkWithDepth[] = [{ value: initialLink, depth: 0 }];

  while (linksToFollow.length > 0) {
    let currentLink: LinkWithDepth | undefined = linksToFollow.shift();
    if (!currentLink) continue;
    let currentUrl = currentLink.value;
    let currentDepth = currentLink.depth;

    if (currentDepth >= maxDepth) {
      continue;
    }

    if (!followedLinks.has(currentUrl)) {
      followedLinks.add(currentUrl);

      try {
        const urlFromLink = new URL(currentUrl);
        const data = await downloadUrl(urlFromLink);
        if (!data) {
          continue;
        }

        const foundLinks = getLinksFromPage(data);
        foundLinks.forEach((link) =>
          linksToFollow.push({ value: link, depth: currentDepth + 1 })
        );

        yield { url: currentUrl, depth: currentDepth };
      } catch (error) {
        console.error(`Failed to follow url with error: ${error}`);
      }
    }
  }
};
