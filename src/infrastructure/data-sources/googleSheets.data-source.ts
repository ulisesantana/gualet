import { LocalStorageRepository } from "../repositories";
import { http } from "./http";

interface ValueRange {
  range?: string;
  majorDimension?: string;
  values: any[][];
}

export class GoogleSheetsDataSource {
  private apiKey = process.env.REACT_APP_API_KEY;
  private ls = new LocalStorageRepository("settings");

  constructor(private spreadsheetId: string) {}

  async getValuesFromRange(range: string): Promise<any[]> {
    const accessToken = this.ls.get("accessToken");
    if (accessToken) {
      try {
        const result = await http.get<{ values: string[][] }>(
          `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`,
          accessToken,
        );
        return result.data.values || [];
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    return [];
  }

  async append(range: string, data: ValueRange): Promise<void> {
    const accessToken = this.ls.get("accessToken");
    if (accessToken) {
      try {
        await http.post<{ values: string[][] }>(
          `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}:append?valueInputOption=RAW&key=${this.apiKey}`,
          data,
          accessToken,
        );
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  }
}
