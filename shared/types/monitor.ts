export interface MonitorData {
  time: number;
  status: boolean;
  delay: number;
}

export interface MonitorInfo {
  host: string;
  delay: number;
  fail: number;
  success: number;
  total: number;
  data: MonitorData[];
}
