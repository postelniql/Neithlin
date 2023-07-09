import axios from "axios";
import { downloadUrl } from "../page";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("downloadUrl", () => {
  it("should download a URL and return its content", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: "<html><body>Hello, world!</body></html>",
    });

    const url = new URL("https://example.com");
    const pageData = await downloadUrl(url);

    expect(pageData).toEqual({
      content: "<html><body>Hello, world!</body></html>",
      url: "https://example.com/",
    });
    expect(mockedAxios.get).toHaveBeenCalledWith("https://example.com/");
  });

  it("should return null if the request fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Something went wrong"));

    const url = new URL("https://example.com");
    const pageData = await downloadUrl(url);

    expect(pageData).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith("https://example.com/");
  });
});
