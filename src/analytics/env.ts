export interface AnalyticsEnv {
  apiKey?: string;
  apiHost?: string;
  enabled?: boolean;
}

let runtimeEnv: AnalyticsEnv = {};

export function setAnalyticsEnv(env: AnalyticsEnv): void {
  runtimeEnv = { ...runtimeEnv, ...env };
}

export function getAnalyticsEnv(): AnalyticsEnv {
  return runtimeEnv;
}
