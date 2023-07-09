import { getLinks } from "../links";

describe("getLinks", () => {
  it("extracts links from page content", () => {
    const pageData = {
      url: "https://example.com/",
      content:
        '<html><body><a href="https://example.com/about">About</a><a href="https://example.com/contact">Contact</a></body></html>',
    };

    const links = getLinks(pageData);

    expect(links).toEqual([
      "https://example.com/about",
      "https://example.com/contact",
    ]);
  });

  it("resolves relative links based on the page URL", () => {
    const pageData = {
      url: "https://example.com/",
      content:
        '<html><body><a href="/about">About</a><a href="/contact">Contact</a></body></html>',
    };

    const links = getLinks(pageData);

    expect(links).toEqual([
      "https://example.com/about",
      "https://example.com/contact",
    ]);
  });
});
