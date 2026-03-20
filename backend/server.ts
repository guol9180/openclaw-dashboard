/**
 * OpenClaw AI Room - Backend Server
 * 整合所有收集器、状态管理器和 WebSocket
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { LogCollector, StatusCollector, MetricsCollector } from './collectors/index.js';
import { AIStateManager, TaskManager } from './state/index.js';
import { WebSocketHandler } from './websocket/handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建 Fastify 服务器
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  }
});

// 创建 HTTP 服务器（用于 WebSocket）
const httpServer = createServer(fastify.server);

// 初始化组件
const logCollector = new LogCollector();
const statusCollector = new StatusCollector();
const metricsCollector = new MetricsCollector();
const aiStateManager = new AIStateManager();
const taskManager = new TaskManager();
const wsHandler = new WebSocketHandler(httpServer);

// 日志缓存（最近 100 条）
const recentLogs: any[] = [];
const MAX_LOGS = 100;

// ========== 设置路由 ==========

// CORS
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// 静态文件服务
const staticRoot = process.env.NODE_ENV === 'production'
  ? join(__dirname, 'public')
  : join(__dirname, '../frontend/dist');

await fastify.register(staticPlugin, {
  root: staticRoot,
  prefix: '/'
});

// API: 获取当前状态
fastify.get('/api/status', async (request, reply) => {
  return {
    ai: aiStateManager.getState(),
    task: taskManager.getCurrentTask(),
    timestamp: Date.now()
  };
});

// API: 获取系统指标
fastify.get('/api/metrics', async (request, reply) => {
  // 这里将由 metrics collector 提供
  return {
    message: 'Metrics available via WebSocket',
    timestamp: Date.now()
  };
});

// API: 获取最近日志
fastify.get('/api/logs', async (request, reply) => {
  return {
    logs: recentLogs.slice(-50),
    timestamp: Date.now()
  };
});

// API: 健康检查
fastify.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    clients: wsHandler.getClientCount(),
    uptime: process.uptime(),
    timestamp: Date.now()
  };
});

// ========== 设置事件监听 ==========

// 日志收集器事件
logCollector.on('event', (event) => {
  // 添加到缓存
  recentLogs.push(event);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.shift();
  }

  // 更新 AI 状态
  aiStateManager.handleEvent(event);

  // 更新任务
  taskManager.handleEvent(event);

  // 广播事件
  wsHandler.broadcastEvent(event);
});

// 状态收集器事件
statusCollector.on('status', (status) => {
  // 可以在这里处理 OpenClaw 运行状态
  fastify.log.info('OpenClaw status:', status);
});

// 指标收集器事件
metricsCollector.on('metrics', ({ system, ai, timestamp }) => {
  // 广播指标
  wsHandler.broadcastMetrics(system, ai);
});

// AI 状态更新
aiStateManager.on('state-update', (state) => {
  wsHandler.broadcastStateUpdate(state);
});

// 任务更新
taskManager.on('task-update', (task) => {
  wsHandler.broadcastTaskUpdate(task);
});

// WebSocket 连接处理
// (已在 WebSocketHandler 中处理)

// ========== 启动服务器 ==========

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    // 启动收集器
    logCollector.start();
    statusCollector.start();
    metricsCollector.start();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

    // 启动 Fastify
    await fastify.ready();

    // 启动 HTTP 服务器（包含 WebSocket）
    httpServer.listen(port, host, () => {
      fastify.log.info(`🚀 OpenClaw AI Room Server running on http://${host}:${port}`);
      fastify.log.info(`📡 WebSocket enabled`);
    });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  fastify.log.info('SIGTERM received, shutting down...');

  logCollector.stop();
  statusCollector.stop();
  metricsCollector.stop();
  wsHandler.close();

  httpServer.close(() => {
    fastify.log.info('Server closed');
    process.exit(0);
  });
});

start();
