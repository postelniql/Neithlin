import { followLinks } from "../src/links";
import * as page from "../src/page";

jest.mock("../src/page", () => ({
  ...jest.requireActual("../src/page"),
  downloadUrl: jest.fn(),
}));

describe("followLinks", () => {
  const mockDownloadUrl = page.downloadUrl as jest.MockedFunction<
    typeof page.downloadUrl
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call downloadUrl once for maxDepth of 1", async () => {
    mockDownloadUrl.mockResolvedValueOnce({
      url: "https://test.com",
      content:
        '<a href="https://test.com/link1">Link 1</a><a href="https://test.com/link2">Link 2</a>',
    });

    const linkGenerator = followLinks("https://test.com", 1);
    for await (const _ of linkGenerator) {
    }

    expect(mockDownloadUrl).toHaveBeenCalledTimes(1);
  });
  it("should call downloadUrl thrice for maxDepth of 2 and 2 nested links", async () => {
    mockDownloadUrl
      .mockResolvedValueOnce({
        url: "https://test.com",
        content:
          '<a href="https://test.com/link1">Link 1</a><a href="https://test.com/link2">Link 2</a>',
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link1",
        content: "",
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link2",
        content: "",
      });

    const linkGenerator = followLinks("https://test.com", 2);
    for await (const _ of linkGenerator) {
    }

    expect(mockDownloadUrl).toHaveBeenCalledTimes(3);
  });
  it("should call downloadUrl four times for maxDepth of 2 and 3 nested links", async () => {
    mockDownloadUrl
      .mockResolvedValueOnce({
        url: "https://test.com",
        content:
          '<a href="https://test.com/link1">Link 1</a><a href="https://test.com/link2">Link 2</a><a href="https://test.com/link3">Link 3</a>',
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link1",
        content: "",
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link2",
        content: "",
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link3",
        content: "",
      });

    const linkGenerator = followLinks("https://test.com", 2);
    for await (const _ of linkGenerator) {
    }

    expect(mockDownloadUrl).toHaveBeenCalledTimes(4);
  });
  it("should call downloadUrl seven times for maxDepth of 3 and 2 top-level nested links with each having 2 nested links respectively", async () => {
    mockDownloadUrl
      .mockResolvedValueOnce({
        url: "https://test.com",
        content:
          '<a href="https://test.com/link1">Link 1</a><a href="https://test.com/link2">Link 2</a>',
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link1",
        content:
          '<a href="https://test.com/link1_1">Link 1_1</a><a href="https://test.com/link1_2">Link 1_2</a>',
      })
      .mockResolvedValueOnce({
        url: "https://test.com/link2",
        content:
          '<a href="https://test.com/link2_1">Link 2_1</a><a href="https://test.com/link2_2">Link 2_2</a>',
      })
      .mockResolvedValueOnce({ url: "https://test.com/link1_1", content: "" })
      .mockResolvedValueOnce({ url: "https://test.com/link1_2", content: "" })
      .mockResolvedValueOnce({ url: "https://test.com/link2_1", content: "" })
      .mockResolvedValueOnce({ url: "https://test.com/link2_2", content: "" });

    const linkGenerator = followLinks("https://test.com", 3);
    for await (const _ of linkGenerator) {
    }

    expect(mockDownloadUrl).toHaveBeenCalledTimes(7);
  });
});
