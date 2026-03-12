/**
 * 指标收集器 - 收集系统性能指标
 */

import { EventEmitter } from 'events';
import si from 'systeminformation';
import type { SystemMetrics, AIMetrics } from '../types/metrics';

export class MetricsCollector extends EventEmitter {
  private interval?: NodeJS.Timeout;
  private isRunning = false;
  private pollInterval: number;

  // AI 指标缓存
  private requestCount = 0;
  private totalLatency = 0;
  private lastRequestTime = 0;
  private tokensUsed = { input: 0, output: 0, total: 0 };
  private errorCount = 0;

  constructor(pollInterval: number = 1000) {
    super();
    this.pollInterval = pollInterval;
  }

  /**
   * 启动指标收集
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('[MetricsCollector] Starting...');

    // 立即收集一次
    this.collect();

    // 定期收集
    this.interval = setInterval(() => {
      this.collect();
    }, this.pollInterval);
  }

  /**
   * 收集所有指标
   */
  private async collect() {
    try {
      const systemMetrics = await this.getSystemMetrics();
      const aiMetrics = this.getAIMetrics();

      this.emit('metrics', {
        system: systemMetrics,
        ai: aiMetrics,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('[MetricsCollector] Error collecting metrics:', error);
    }
  }

  /**
   * 获取系统指标
   */
  private async getSystemMetrics(): Promise<SystemMetrics> {
    const [cpu, mem, disk, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats()
    ]);

    return {
      cpu: cpu.currentLoad,
      memory: {
        used: mem.used,
        total: mem.total,
        percentage: (mem.used / mem.total) * 100
      },
      disk: disk[0] ? {
        used: disk[0].used,
        total: disk[0].size,
        percentage: disk[0].use
      } : { used: 0, total: 0, percentage: 0 },
      network: network[0] ? {
        rx_sec: network[0].rx_sec,
        tx_sec: network[0].tx_sec
      } : { rx_sec: 0, tx_sec: 0 },
      uptime: process.uptime()
    };
  }

  /**
   * 获取 AI 指标
   */
  private getAIMetrics(): AIMetrics {
    const now = Date.now();
    const timeDiff = (now - this.lastRequestTime) / 1000; // 秒

    // 计算每秒请求数
    const requestsPerSecond = timeDiff > 0 ? this.requestCount / timeDiff : 0;

    // 计算平均延迟
    const avgLatency = this.requestCount > 0 ? this.totalLatency / this.requestCount : 0;

    return {
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
      avgLatency: Math.round(avgLatency),
      activeTasks: 0, // 将由状态管理器提供
      tokensUsed: this.tokensUsed,
      errorCount: this.errorCount
    };
  }

  /**
   * 记录请求（供外部调用）
   */
  recordRequest(latency: number, tokens?: { input: number; output: number }) {
    this.requestCount++;
    this.totalLatency += latency;
    this.lastRequestTime = Date.now();

    if (tokens) {
      this.tokensUsed.input += tokens.input;
      this.tokensUsed.output += tokens.output;
      this.tokensUsed.total += tokens.input + tokens.output;
    }
  }

  /**
   * 记录错误
   */
  recordError() {
    this.errorCount++;
  }

  /**
   * 重置计数器
   */
  resetCounters() {
    this.requestCount = 0;
    this.totalLatency = 0;
    this.tokensUsed = { input: 0, output: 0, total: 0 };
    this.errorCount = 0;
  }

  /**
   * 停止收集
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.isRunning = false;
    console.log('[MetricsCollector] Stopped');
  }
}
