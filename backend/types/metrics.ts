/**
 * 系统指标类型定义
 */

// 系统指标
export interface SystemMetrics {
  cpu: number;           // CPU 使用率 (0-100)
  memory: MemoryUsage;
  disk: DiskUsage;
  network: NetworkUsage;
  uptime: number;        // 运行时间（秒）
}

// 内存使用
export interface MemoryUsage {
  used: number;          // 已用（字节）
  total: number;         // 总量（字节）
  percentage: number;    // 百分比 (0-100)
}

// 磁盘使用
export interface DiskUsage {
  used: number;
  total: number;
  percentage: number;
}

// 网络使用
export interface NetworkUsage {
  rx_sec: number;        // 每秒接收（字节）
  tx_sec: number;        // 每秒发送（字节）
}

// AI 指标
export interface AIMetrics {
  requestsPerSecond: number;
  avgLatency: number;    // 平均延迟（毫秒）
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
