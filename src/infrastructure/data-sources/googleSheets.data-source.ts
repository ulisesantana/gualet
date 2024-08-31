import {LocalStorageRepository} from "../repositories";


export class GoogleSheetsDataSource {
  private apiKey = process.env.REACT_APP_API_KEY
  private ls = new LocalStorageRepository('settings')

  constructor(private spreadsheetId: string) {
  }

  async getValuesFromRange(range: string): Promise<any[]> {
    const accessToken = this.ls.get('accessToken');
    if (accessToken) {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const result = await response.json();
        return result.values || [];
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    return []
  }

}
