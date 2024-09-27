import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://your-api-endpoint.com';

class ApiService {
  async get<T>(endpoint: string): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.post(`${BASE_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  private handleError(error: any): void {
    // Handle errors here, logging or showing alerts
    console.error('API call failed:', error);
  }
}

export const apiService = new ApiService();
