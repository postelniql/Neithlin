import { JSDOM } from "jsdom";

import { PageData } from "./page";

type Links = string[];

export const getLinks = (page: PageData): Links => {
  const dom = new JSDOM(page.content, { url: page.url });
  const aTags = dom.window.document.querySelectorAll("a");
  const links = Array.from(aTags).map((a) => a.href);
  return links;
};
