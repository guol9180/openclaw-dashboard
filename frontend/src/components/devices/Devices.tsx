/**
 * 设备组件集合
 */

import { DEVICE_POSITIONS } from '../../types';

export function Devices() {
  return (
    <group>
      {/* Memory Shelf */}
      <DeviceMesh
        position={DEVICE_POSITIONS.memory_shelf}
        color="#8b5cf6"
        label="Memory"
      />

      {/* Search Terminal */}
      <DeviceMesh
        position={DEVICE_POSITIONS.search_terminal}
        color="#3b82f6"
        label="Search"
      />

      {/* Code Console */}
      <DeviceMesh
        position={DEVICE_POSITIONS.code_console}
        color="#10b981"
        label="Code"
      />

      {/* Network Console */}
      <DeviceMesh
        position={DEVICE_POSITIONS.network_console}
        color="#f59e0b"
        label="Network"
      />

      {/* Skill Workbench */}
      <DeviceMesh
        position={DEVICE_POSITIONS.skill_workbench}
        color="#ec4899"
        label="Skill"
      />
    </group>
  );
}

// 设备网格组件
function DeviceMesh({
  position,
  color,
  label
}: {
  position: { x: number; y: number; z: number };
  color: string;
  label: string;
}) {
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 设备底座 */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 设备屏幕（立方体） */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
