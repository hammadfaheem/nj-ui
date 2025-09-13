// Assistant session responses
export interface StartSessionResponse {
  session_id: string;
  room: string;
  wss: string;
  token: string;
}

export interface EndSessionResponse {
  ok: boolean;
}
// Assistant types
export interface AssistantFile {
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  upload_date?: string;
  base64?: string;
}

export interface AssistantLLM {
  first_message?: string;
  system_prompt?: string;
  file_ids?: string[];
  provider: string;
  model: string;
  temperature?: number;
  max_token?: number;
  closing?: string;
}

export interface AssistantVoice {
  provider: string;
  model: string;
  voice_id: string;
  speed?: number;
}

export interface AssistantTranscriber {
  provider: string;
  language?: string;
  model?: string;
  noise_cancellation?: boolean;
}

export interface AssistantFunction {
  endCall?: boolean;
  currentDatetime?: boolean;
}

export interface AssistantSilenceTimeout {
  followup_time_on?: number;
  call_end_time_on_silence?: number;
}

export interface AssistantAdvanced {
  silence_timeout?: AssistantSilenceTimeout;
  function?: AssistantFunction;
}

export interface Assistant {
  assistant_id?: string;
  name: string;
  llm: AssistantLLM;
  voice: AssistantVoice;
  transcriber?: AssistantTranscriber;
  advanced?: AssistantAdvanced;
  user_id?: string;
}
// Metrics endpoints types
export interface MetricsCostTrend {
  time: string;
  total_cost: number;
  avg_cost_per_call: number;
}

export interface MetricsStatusBreakdown {
  completed: { percent: number; count: number };
  failed: { percent: number; count: number };
  no_answer: { percent: number; count: number };
  total: number;
}
export interface Call {
  sid: string;
  account_sid: string;
  to: string;
  status: "completed" | "failed" | "no-answer" | "busy" | "canceled";
  start_time: string;
  end_time: string;
  duration: number;
  direction: "inbound" | "outbound-dial" | "outbound-api";
  price: number;
  price_unit: string;
  uri: string;
}

export interface CallLog {
  call_id: string;
  created_at: string;
  direction: string;
  to: string;
  from_: string;
  recording: string;
  status: string;
  duration: string;
  price: number;
  agent_price: number;
}

export interface CallLogsResponse {
  total: number;
  data: CallLog[];
}

export interface CallSummary {
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  no_answer_calls: number;
  success_rate: number;
  total_duration_seconds: number;
  total_cost: number;
  average_duration_seconds: number;
  cost_per_call: number;
}

export interface CallsOverTime {
  time: string;
  total: number;
  completed: number;
  failed: number;
  no_answer: number;
}

export interface DurationTrend {
  date: string;
  avg_duration: number;
  min_duration: number;
  max_duration: number;
  median_duration: number;
  call_count: number;
}

export interface SipPerformance {
  sip_domain: string;
  success_rate: number;
  avg_duration: number;
  cost_per_call: number;
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  no_answer_calls: number;
  total_duration: number;
  total_cost: number;
}

export interface CallDirectionAnalysis {
  direction: string;
  success_rate: number;
  avg_duration: number;
  cost_efficiency: number;
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  no_answer_calls: number;
  total_duration: number;
  total_cost: number;
}

export interface CostAnalysis {
  daily_costs: Array<{
    date: string;
    total_cost: number;
    avg_cost_per_call: number;
  }>;
  cost_by_direction: Array<{
    direction: string;
    total_cost: number;
    call_count: number;
  }>;
  cost_by_status: Array<{
    status: string;
    total_cost: number;
    call_count: number;
  }>;
}

export interface DurationDistribution {
  histogram: Array<{
    range: string;
    count: number;
    duration_start: number;
  }>;
  statistics: {
    mean: number;
    median: number;
    std_dev: number;
    min: number;
    max: number;
    total_calls: number;
  };
}

export interface DurationBySip {
  sip_domain: string;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
  count: number;
  raw_data: number[];
}

export interface CorrelationMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

export interface CallFlowSankey {
  source: string;
  target: string;
  final_target: string;
  value: number;
}

export interface PerformanceQuadrant {
  sip_domain: string;
  success_rate: number;
  cost_efficiency: number;
  total_calls: number;
  bubble_size: number;
}

export interface CurrentStatus {
  last_24_hours: {
    total_calls: number;
    completed_calls: number;
    failed_calls: number;
    success_rate: number;
  };
  last_hour: {
    total_calls: number;
    activity_level: string;
  };
  system_health: string;
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

// Phone-related types
export interface PhoneCredentials {
  account_sid: string;
  auth_token: string;
}

export interface PhoneNumberBase {
  provider: string;
  phone_number?: string;
  label?: string;
  credentials: PhoneCredentials;
}

export interface PhoneNumberCreate extends PhoneNumberBase {}

export interface PhoneNumberInDB extends PhoneNumberBase {
  id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface FileMetadata {
  file_id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  upload_date: string;
}

export interface ListFilesResponse {
  files: FileMetadata[];
}
