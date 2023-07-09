import axios from "axios";

export interface PageData {
  url: string;
  content: string;
}

export const downloadUrl = async (url: URL): Promise<PageData | null> => {
  try {
    const page = await axios.get(url.href);
    return {
      content: page.data,
      url: url.href,
    };
  } catch (error) {
    console.error(`Failed to download page with error: ${error}`);
    return null;
  }
};
