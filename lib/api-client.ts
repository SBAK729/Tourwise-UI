import axios, { type AxiosInstance, type AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tourwise-xnrb.onrender.com"

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear auth on unauthorized
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          window.location.href = "/"
        }
        return Promise.reject(error)
      },
    )
  }

  async signup(email: string, password: string) {
    try {
      const response = await this.client.post("/auth/signup", { email, password })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post("/auth/login", { email, password })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getMe() {
    try {
      const response = await this.client.get("/auth/me")
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async generateItinerary(userInput: string, userId: string) {
    try {
      const response = await this.client.post("/auth/generate-itinerary", {
        user_input: userInput,
        user_id: userId,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    if (error.response?.data?.detail) {
      return new Error(error.response.data.detail)
    }
    if (error.message === "Network Error") {
      return new Error("Network error. Please check your connection.")
    }
    return error
  }
}

export const apiClient = new APIClient()
