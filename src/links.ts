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

export const followLinks = async (initialLink: Link, maxDepth: number) => {
  let followedLinks = new Set<Link>();
  let linksToFollow: LinkWithDepth[] = [{ value: initialLink, depth: 0 }];

  while (linksToFollow.length > 0) {
    let currentLink: LinkWithDepth | undefined = linksToFollow.shift();
    if (!currentLink) continue;
    let currentUrl = currentLink.value;
    let currentDepth = currentLink.depth;

    if (currentDepth >= maxDepth) {
      console.log(
        `won't follow link: ${currentUrl} as it has reached max depth of ${currentDepth}`
      );
      continue;
    }

    console.log(`following link: ${currentUrl} at depth ${currentDepth}`);

    if (!followedLinks.has(currentUrl)) {
      followedLinks.add(currentUrl);

      try {
        const urlFromLink = new URL(currentUrl);
        const data = await downloadUrl(urlFromLink);
        if (!data) {
          continue;
        }

        const foundLinks = getLinksFromPage(data);
        console.log("found links: ", foundLinks);
        foundLinks.forEach((link) =>
          linksToFollow.push({ value: link, depth: currentDepth + 1 })
        );
      } catch (error) {
        console.error(`Failed to follow url with error: ${error}`);
      }
    }
  }
};
