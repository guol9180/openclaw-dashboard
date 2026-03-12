/**
 * WebSocket Hook - 连接后端实时数据
 */

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAIRoomStore } from '../stores/useAIRoomStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);

  const {
    updateAIState,
    updateTask,
    addEvent,
    updateMetrics,
    setConnected
  } = useAIRoomStore();

  useEffect(() => {
    // 连接 WebSocket
    const socket = io(WS_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // 连接成功
    socket.on('connect', () => {
      console.log('[WebSocket] Connected');
      setConnected(true);
    });

    // 连接失败
    socket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
      setConnected(false);
    });

    // 接收初始化数据
    socket.on('init', (message: any) => {
      console.log('[WebSocket] Init data received', message);

      const { aiState, currentTask, recentLogs, systemMetrics, aiMetrics } = message.data || message;

      if (aiState) updateAIState(aiState);
      if (currentTask) updateTask(currentTask);
      if (systemMetrics && aiMetrics) updateMetrics(systemMetrics, aiMetrics);

      // 添加历史日志
      if (recentLogs && Array.isArray(recentLogs)) {
        recentLogs.forEach((log) => addEvent(log));
      }
    });

    // 接收状态更新
    socket.on('state-update', (message: any) => {
      const { aiState } = message.data || message;
      if (aiState) updateAIState(aiState);
    });

    // 接收事件
    socket.on('event', (message: any) => {
      const event = message.data || message;
      addEvent(event);
    });

    // 接收任务更新
    socket.on('task-update', (message: any) => {
      const task = message.data || message;
      updateTask(task);
    });

    // 接收指标更新
    socket.on('metrics', (message: any) => {
      const { system, ai } = message.data || message;
      if (system && ai) updateMetrics(system, ai);
    });

    // 清理
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // 返回 socket 实例（用于手动发送消息）
  return socketRef.current;
}
