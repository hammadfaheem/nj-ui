import axios from "axios";
import Cookies from "js-cookie";
import type {
  Call,
  CallSummary,
  CallsOverTime,
  DurationTrend,
  SipPerformance,
  CallDirectionAnalysis,
  CostAnalysis,
  DurationDistribution,
  DurationBySip,
  CorrelationMatrix,
  CallFlowSankey,
  PerformanceQuadrant,
  CurrentStatus,
  DateRange,
  CallLogsResponse,
} from "../types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 90000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Metrics endpoints (new backend)
  getMetricsCostTrends: async (params?: {
    start_date?: string;
    end_date?: string;
    granularity?: string;
    label?: string;
  }) => {
    const response = await api.get("/metrics/cost-trends", { params });
    return response.data;
  },

  getMetricsStatusBreakdown: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/metrics/status-breakdown", { params });
    return response.data;
  },

  getMetricsVolumeOverTime: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/metrics/volume_over_time", { params });
    return response.data;
  },

  getMetricsCallDirection: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/metrics/call-direction", { params });
    return response.data;
  },

  getMetricsSuccessEvaluation: async (params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
    label?: string;
  }) => {
    const response = await api.get("/metrics/success-evaluation", { params });
    return response.data;
  },

  getMetricsSuccessDonut: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/metrics/success-donut", { params });
    return response.data;
  },

  // Missing methods for Performance page and new Metrics page
  getMetricsSipPerformance: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/analytics/sip-performance", { params });
    return response.data;
  },

  getMetricsCorrelationMatrix: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/analytics/correlation-matrix", { params });
    return response.data;
  },

  getMetricsPerformanceQuadrant: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }) => {
    const response = await api.get("/analytics/performance-quadrant", {
      params,
    });
    return response.data;
  },
  // Authentication
  login: async (payload: {
    email: string;
    password: string;
    recaptcha_token?: string;
    keep_logged_in?: boolean;
  }) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  signup: async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    terms_agreed: boolean;
    recaptcha_token?: string;
  }) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  forgotPassword: async (payload: { email: string }) => {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  },

  resetPassword: async (payload: { token: string; new_password: string }) => {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  },

  // Core call data
  getCalls: async (
    params?: Partial<DateRange & { status?: string; limit?: number }>
  ): Promise<Call[]> => {
    const response = await api.get("/calls", { params });
    return response.data;
  },

  // Updated: Use metrics status breakdown for summary
  getCallSummary: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }): Promise<any> => {
    const response = await api.get("/metrics/status-breakdown", { params });
    return response.data;
  },

  // New call logs endpoint
  // Updated: Use /call_logs/fetch-call-logs for detailed logs
  getCallLogs: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
    limit?: number;
    status?: string;
  }): Promise<any> => {
    const response = await api.get("/call_logs/fetch-call-logs", { params });
    return response.data;
  },

  // Analytics endpoints
  getCallsOverTime: async (
    params?: Partial<DateRange & { granularity?: string }>
  ): Promise<CallsOverTime[]> => {
    const response = await api.get("/analytics/calls-over-time", { params });
    return response.data;
  },

  getDurationTrends: async (
    params?: Partial<DateRange>
  ): Promise<DurationTrend[]> => {
    const response = await api.get("/analytics/duration-trends", { params });
    return response.data;
  },

  getSipPerformance: async (): Promise<SipPerformance[]> => {
    const response = await api.get("/analytics/sip-performance");
    return response.data;
  },

  getCallDirectionAnalysis: async (): Promise<CallDirectionAnalysis[]> => {
    const response = await api.get("/analytics/call-direction-analysis");
    return response.data;
  },

  getCostAnalysis: async (): Promise<CostAnalysis> => {
    const response = await api.get("/analytics/cost-analysis");
    return response.data;
  },

  getDurationDistribution: async (): Promise<DurationDistribution> => {
    const response = await api.get("/analytics/duration-distribution");
    return response.data;
  },

  getDurationBySip: async (): Promise<DurationBySip[]> => {
    const response = await api.get("/analytics/duration-by-sip");
    return response.data;
  },

  getCorrelationMatrix: async (): Promise<CorrelationMatrix> => {
    const response = await api.get("/analytics/correlation-matrix");
    return response.data;
  },

  getCallFlowSankey: async (): Promise<CallFlowSankey[]> => {
    const response = await api.get("/analytics/call-flow-sankey");
    return response.data;
  },

  getPerformanceQuadrant: async (): Promise<PerformanceQuadrant[]> => {
    const response = await api.get("/analytics/performance-quadrant");
    return response.data;
  },

  getCurrentStatus: async (): Promise<CurrentStatus> => {
    const response = await api.get("/analytics/current-status");
    return response.data;
  },

  exportRawData: async (params?: Partial<DateRange & { format?: string }>) => {
    const response = await api.get("/export/raw-data", { params });
    return response.data;
  },
  // Overview endpoints for dashboard
  getOverviewSummary: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
    plan_name?: string;
  }): Promise<{
    total_calls: number;
    avg_duration: number;
    total_cost: number;
    avg_cost: number;
    call_success_rate: number;
  }> => {
    const response = await api.get("/overview/summary", { params });
    return response.data;
  },

  getOverviewSuccessOverTime: async (params?: {
    start_date?: string;
    end_date?: string;
    label?: string;
  }): Promise<{
    daily_success: Array<{
      time: string;
      success_rate: number;
      successful_calls: number;
      total_calls: number;
    }>;
    percent_change: number | null;
  }> => {
    const response = await api.get("/overview/success-over-time", { params });
    return response.data;
  },
  // Assistant endpoints
  getAssistants: async (): Promise<import("../types/api").Assistant[]> => {
    const response = await api.get("/assistants/");
    return response.data;
  },

  getAssistant: async (
    assistant_id: string
  ): Promise<import("../types/api").Assistant> => {
    const response = await api.get(`/assistants/${assistant_id}/`);
    return response.data;
  },

  createAssistant: async (
    payload: import("../types/api").Assistant
  ): Promise<string> => {
    const response = await api.post("/assistants/", payload);
    return response.data;
  },

  updateAssistant: async (
    assistant_id: string,
    payload: import("../types/api").Assistant
  ): Promise<boolean> => {
    const response = await api.put(
      `/assistants/?assistant_id=${assistant_id}`,
      payload
    );
    return response.data;
  },

  deleteAssistant: async (assistant_id: string): Promise<boolean> => {
    const response = await api.delete(`/assistants/${assistant_id}/`);
    return response.data;
  },

  // Session endpoints
  startSession: async (
    assistant_id: string
  ): Promise<{
    session_id: string;
    room: string;
    wss: string;
    token: string;
  }> => {
    const response = await api.post(
      `/assistants/${assistant_id}/sessions/start`
    );
    return response.data;
  },

  endSession: async (session_id: string): Promise<{ ok: boolean }> => {
    const response = await api.post(`/assistants/sessions/${session_id}/end`);
    return response.data;
  },

  // Phone number endpoints
  createPhoneNumber: async (
    phoneData: import("../types/api").PhoneNumberCreate
  ) => {
    const response = await api.post("/phone/create", phoneData);
    // Map _id to id for frontend compatibility, handle both cases
    const phone = response.data;
    return {
      ...phone,
      id: phone._id || phone.id,
      _id: undefined,
    };
  },

  getPhoneNumbers: async () => {
    const response = await api.get("/phone/list");
    // Map _id to id for frontend compatibility, handle both cases
    const phones = response.data.map((phone: any) => ({
      ...phone,
      id: phone._id || phone.id,
      _id: undefined,
    }));
    return phones;
  },

  getPhoneNumberById: async (phoneId: string) => {
    const response = await api.get(`/phone/get/${phoneId}`);
    // Map _id to id for frontend compatibility, handle both cases
    const phone = response.data;
    return {
      ...phone,
      id: phone._id || phone.id,
      _id: undefined,
    };
  },

  updatePhoneNumber: async (
    phoneId: string,
    phoneData: import("../types/api").PhoneNumberCreate
  ) => {
    const response = await api.put(`/phone/update/${phoneId}`, phoneData);
    // Map _id to id for frontend compatibility, handle both cases
    const phone = response.data;
    return {
      ...phone,
      id: phone._id || phone.id,
      _id: undefined,
    };
  },

  deletePhoneNumber: async (phoneId: string) => {
    const response = await api.delete(`/phone/delete/${phoneId}`);
    return response.data;
  },

  // File endpoints
  listUserFiles: async (): Promise<{ files: any[] }> => {
    const response = await api.get("/files/");
    return response.data;
  },

  uploadFile: async (fileData: {
    filename: string;
    base64: string;
  }): Promise<any> => {
    const response = await api.post("/files/upload/", fileData);
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<any> => {
    const response = await api.delete(`/files/${fileId}/`);
    return response.data;
  },

  // LOV endpoints
  getLLMProviders(): Promise<string[]> {
    // Return available LLM providers
    return Promise.resolve(["openai"]);
  },
  getLLMModels(provider: string): Promise<string[]> {
    return api
      .get("/lov/llm/models", { params: { provider } })
      .then((response) => response.data.models?.map((m: any) => m.id) || []);
  },
  getSTTProviders(): Promise<string[]> {
    // Return available STT providers
    return Promise.resolve(["deepgram", "openai"]);
  },
  getSTTModels(provider: string): Promise<string[]> {
    return api
      .get("/lov/stt/models", { params: { provider } })
      .then((response) => response.data.models?.map((m: any) => m.id) || []);
  },
  getTTSProviders(): Promise<string[]> {
    // Return available TTS providers
    return Promise.resolve(["cartesia", "openai"]);
  },
  getTTSModels(provider: string): Promise<string[]> {
    return api
      .get("/lov/tts/models", { params: { provider } })
      .then((response) => response.data.models?.map((m: any) => m.id) || []);
  },
  getTTSVoices(provider: string): Promise<string[]> {
    if (provider === "cartesia") {
      return api
        .get("/lov/cartesia/voices")
        .then((response) => {
          console.log("Cartesia voices response:", response.data);
          return response.data.voices?.map((v: any) => v.id) || [];
        })
        .catch((error) => {
          console.error("Error fetching Cartesia voices:", error);
          // Fallback to OpenAI voices if Cartesia fails
          return api
            .get("/lov/openai/voices")
            .then(
              (response) => response.data.voices?.map((v: any) => v.id) || []
            );
        });
    } else if (provider === "openai") {
      return api
        .get("/lov/openai/voices")
        .then((response) => {
          console.log("OpenAI voices response:", response.data);
          return response.data.voices?.map((v: any) => v.id) || [];
        })
        .catch((error) => {
          console.error("Error fetching OpenAI voices:", error);
          return [];
        });
    }
    return Promise.resolve([]);
  },

  // Image generation endpoints
  generateImage: async (payload: {
    prompt: string;
    model?: string;
    size?: string;
    quality?: string;
    style?: string;
    n?: number;
  }): Promise<any> => {
    const response = await api.post("/images/generate", payload, {
      timeout: 60000, // 60 seconds for image generation
    });
    return response.data;
  },

  getImageModels: async (): Promise<any> => {
    const response = await api.get("/images/models");
    return response.data;
  },

  getImagePricing: async (): Promise<any> => {
    const response = await api.get("/images/pricing");
    return response.data;
  },

  calculateImagePrice: async (params: {
    model?: string;
    size?: string;
    quality?: string;
    n?: number;
  }): Promise<any> => {
    const response = await api.get("/images/pricing/calculate", { params });
    return response.data;
  },

  getImageHistory: async (): Promise<any> => {
    const response = await api.get("/images/history");
    return response.data;
  },

  downloadImage: async (imageUrl: string): Promise<any> => {
    const response = await api.get("/images/download", {
      params: { image_url: imageUrl },
      responseType: "blob",
    });
    return response.data;
  },

  getImageHealth: async (): Promise<any> => {
    const response = await api.get("/images/health");
    return response.data;
  },

  getUserImageSpending: async (userId?: string): Promise<any> => {
    if (userId) {
      const response = await api.get(`/images/user-spending/${userId}`);
      return response.data;
    } else {
      const response = await api.get("/images/user-spending");
      return response.data;
    }
  },

  // User profile endpoint
  getUserProfile: async (): Promise<{
    email: string;
    first_name: string;
    last_name: string;
  }> => {
    const response = await api.get("/user/profile");
    return response.data;
  },
};
