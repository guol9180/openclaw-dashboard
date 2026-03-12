/**
 * 设备组件集合 - 带交互
 */

import { useState } from 'react';
import { Text } from '@react-three/drei';
import { DEVICE_POSITIONS } from '../../types';
import type { DeviceType } from '../../types';

export function Devices() {
  return (
    <group>
      <InteractiveDevice
        position={DEVICE_POSITIONS.memory_shelf}
        color="#8b5cf6"
        label="Memory Shelf"
        deviceType="memory_shelf"
        description="Vector DB & Memories"
      />

      <InteractiveDevice
        position={DEVICE_POSITIONS.search_terminal}
        color="#3b82f6"
        label="Search Terminal"
        deviceType="search_terminal"
        description="Web Search & Browser"
      />

      <InteractiveDevice
        position={DEVICE_POSITIONS.code_console}
        color="#10b981"
        label="Code Console"
        deviceType="code_console"
        description="Python / CLI & Scripts"
      />

      <InteractiveDevice
        position={DEVICE_POSITIONS.network_console}
        color="#f59e0b"
        label="Network Console"
        deviceType="network_console"
        description="MCP Servers & API Calls"
      />

      <InteractiveDevice
        position={DEVICE_POSITIONS.skill_workbench}
        color="#ec4899"
        label="Skill Workbench"
        deviceType="skill_workbench"
        description="Skills Engine & Automation"
      />
    </group>
  );
}

// 交互式设备组件
function InteractiveDevice({
  position,
  color,
  label,
  deviceType,
  description
}: {
  position: { x: number; y: number; z: number };
  color: string;
  label: string;
  deviceType: DeviceType;
  description: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[position.x, position.y, position.z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 设备底座 */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* 设备屏幕（立方体） */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* 屏幕光效（悬停时） */}
      {hovered && (
        <mesh position={[0, 0.75, 0.06]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* 设备名称 */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* 设备描述（悬停时显示） */}
      {hovered && (
        <Text
          position={[0, 1.7, 0]}
          fontSize={0.1}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          {description}
        </Text>
      )}
    </group>
  );
}
