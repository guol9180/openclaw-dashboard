/**
 * 前端指标类型定义
 */

// 系统指标
export interface SystemMetrics {
  cpu: number;
  memory: MemoryUsage;
  disk: DiskUsage;
  network: NetworkUsage;
  uptime: number;
}

// 内存使用
export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
}

// 磁盘使用
export interface DiskUsage {
  used: number;
  total: number;
  percentage: number;
}

// 网络使用
export interface NetworkUsage {
  rx_sec: number;
  tx_sec: number;
}

// AI 指标
export interface AIMetrics {
  requestsPerSecond: number;
  avgLatency: number;
  activeTasks: number;
  tokensUsed: TokenUsage;
  errorCount: number;
}

// Token 使用
export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}
