/**
 * AI Room 主场景
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Room } from '../components/room/Room';
import { AICharacter } from '../components/character/AICharacter';
import { Devices } from '../components/devices/Devices';
import { useWebSocket } from '../hooks/useWebSocket';

export function AIRoom() {
  // 连接 WebSocket
  useWebSocket();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        {/* 相机 */}
        <PerspectiveCamera
          makeDefault
          position={[0, 10, 10]}
          fov={60}
        />

        {/* 控制器 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={20}
        />

        {/* 光照 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />

        {/* 房间环境 */}
        <Room />

        {/* 设备 */}
        <Devices />

        {/* AI 角色 */}
        <AICharacter />
      </Canvas>
    </div>
  );
}
