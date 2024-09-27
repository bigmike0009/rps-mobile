import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://42xma8wsoj.execute-api.us-east-1.amazonaws.com';

// Define a custom response type to include both data and status
interface ApiResponse<T> {
  status: number;
  data: T | null;
}

class ApiService {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${BASE_URL}${endpoint}`);
      return {
        status: response.status,
        data: response.status >= 200 && response.status < 300 ? response.data : null,
      };
    } catch (error: any) {
      this.handleError(error);
      return {
        status: error.response?.status || 500,
        data: null,
      };
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axios.post(`${BASE_URL}${endpoint}`, data);
      return {
        status: response.status,
        data: response.status >= 200 && response.status < 300 ? response.data : null,
      };
    } catch (error: any) {
      this.handleError(error);
      return {
        status: error.response?.status || 500,
        data: null,
      };
    }
  }

  private handleError(error: any): void {
    // Handle errors here, logging or showing alerts
    console.error('API call failed:', error);
  }
}

export const apiService = new ApiService();
