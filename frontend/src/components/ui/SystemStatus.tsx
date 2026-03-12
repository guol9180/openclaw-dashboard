/**
 * System Status 面板 - 系统指标监控
 */

import { useAIRoomStore } from '../../stores/useAIRoomStore';

export function SystemStatus() {
  const { systemMetrics, aiMetrics, connected } = useAIRoomStore();

  if (!systemMetrics || !aiMetrics) {
    return (
      <div className="system-status">
        <h3>📊 System Status</h3>
        <p className="loading">Connecting...</p>
      </div>
    );
  }

  return (
    <div className="system-status">
      <div className="status-header">
        <h3>📊 System Status</h3>
        <span className={`connection ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢' : '🔴'}
        </span>
      </div>

      <div className="metrics-grid">
        {/* CPU */}
        <div className="metric-item">
          <div className="metric-label">CPU</div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${systemMetrics.cpu}%`,
                backgroundColor: getMetricColor(systemMetrics.cpu)
              }}
            />
          </div>
          <div className="metric-value">{systemMetrics.cpu.toFixed(1)}%</div>
        </div>

        {/* Memory */}
        <div className="metric-item">
          <div className="metric-label">MEMORY</div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${systemMetrics.memory.percentage}%`,
                backgroundColor: getMetricColor(systemMetrics.memory.percentage)
              }}
            />
          </div>
          <div className="metric-value">
            {formatBytes(systemMetrics.memory.used)} / {formatBytes(systemMetrics.memory.total)}
          </div>
        </div>

        {/* Tokens */}
        <div className="metric-item">
          <div className="metric-label">TOKENS</div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{ width: '71%', backgroundColor: '#8b5cf6' }}
            />
          </div>
          <div className="metric-value">
            {aiMetrics.tokensUsed.total.toLocaleString()}
          </div>
        </div>

        {/* Latency */}
        <div className="metric-item">
          <div className="metric-label">LATENCY</div>
          <div className="metric-value highlight">
            {aiMetrics.avgLatency}ms
          </div>
        </div>

        {/* Requests/sec */}
        <div className="metric-item">
          <div className="metric-label">REQ/SEC</div>
          <div className="metric-value">
            {aiMetrics.requestsPerSecond}
          </div>
        </div>

        {/* Active Tasks */}
        <div className="metric-item">
          <div className="metric-label">TASKS</div>
          <div className="metric-value">
            {aiMetrics.activeTasks}
          </div>
        </div>
      </div>

      <style jsx>{`
        .system-status {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          backdrop-filter: blur(10px);
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        h3 {
          margin: 0;
          font-size: 14px;
          color: #f59e0b;
        }

        .connection {
          font-size: 12px;
        }

        .loading {
          color: #666;
          font-size: 12px;
          text-align: center;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          font-size: 10px;
          color: #888;
          font-weight: bold;
        }

        .metric-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .metric-value {
          font-size: 11px;
          color: #ccc;
        }

        .metric-value.highlight {
          color: #4ade80;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

// 获取指标颜色（根据百分比）
function getMetricColor(percentage: number): string {
  if (percentage < 50) return '#4ade80'; // 绿色
  if (percentage < 80) return '#fbbf24'; // 黄色
  return '#f87171'; // 红色
}

// 格式化字节
function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)}GB`;
}
