/**
 * 前端事件类型定义（与后端保持一致）
 */

// 事件类型
export type EventType =
  | 'request_received'
  | 'thinking'
  | 'web_search'
  | 'skill_call'
  | 'mcp_call'
  | 'api_call'
  | 'memory_access'
  | 'tool_call'
  | 'response_generated'
  | 'task_complete'
  | 'error';

// 结构化事件
export interface OpenClawEvent {
  id: string;
  timestamp: number;
  type: EventType;
  source: string;
  description: string;
  data?: any;
}

// 设备类型
export type DeviceType =
  | 'memory_shelf'
  | 'search_terminal'
  | 'network_console'
  | 'skill_workbench'
  | 'code_console'
  | 'ai_core';
