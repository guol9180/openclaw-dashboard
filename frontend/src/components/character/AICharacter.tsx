/**
 * AI 角色组件 - 完整版
 */

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Mesh, Group, Vector3 } from 'three';
import { Text } from '@react-three/drei';
import { useAIRoomStore } from '../../stores/useAIRoomStore';

export function AICharacter() {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const { aiState } = useAIRoomStore();

  // 目标位置
  const targetPos = useMemo(() => {
    if (aiState.targetPosition) {
      return new Vector3(
        aiState.targetPosition.x,
        aiState.targetPosition.y + 0.5,
        aiState.targetPosition.z
      );
    }
    return null;
  }, [aiState.targetPosition]);

  // 动画更新
  useFrame((state, delta) => {
    if (!groupRef.current || !bodyRef.current || !headRef.current) return;

    // 移动动画
    if (targetPos) {
      const currentPos = groupRef.current.position;
      const direction = targetPos.clone().sub(currentPos);
      const distance = direction.length();

      if (distance > 0.1) {
        // 移动
        const speed = 2; // 单位/秒
        direction.normalize();
        currentPos.add(direction.multiplyScalar(speed * delta));

        // 朝向
        groupRef.current.lookAt(targetPos.x, currentPos.y, targetPos.z);
      } else {
        // 到达目标
        currentPos.copy(targetPos);
      }
    } else {
      // 同步位置
      groupRef.current.position.set(
        aiState.position.x,
        aiState.position.y + 0.5,
        aiState.position.z
      );
    }

    // 呼吸动画
    const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    bodyRef.current.scale.y = 1 + breathe * 0.5;

    // 思考动画（头部轻微摇晃）
    if (aiState.status === 'thinking' || aiState.status === 'generating') {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    } else {
      headRef.current.rotation.y = 0;
    }

    // 打字动画（上下跳动）
    if (aiState.animation === 'typing') {
      bodyRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.1;
    } else {
      bodyRef.current.position.y = 0;
    }
  });

  const color = getStatusColor(aiState.status);
  const statusLabel = getStatusLabel(aiState.status);

  return (
    <group ref={groupRef} position={[aiState.position.x, 0.5, aiState.position.z]}>
      {/* 身体 */}
      <mesh ref={bodyRef} castShadow>
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* 头部 */}
      <mesh ref={headRef} position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* 眼睛（发光） */}
      <mesh position={[0.1, 0.65, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.1, 0.65, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* 状态标签 */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {statusLabel}
      </Text>

      {/* 当前设备标签 */}
      {aiState.currentDevice && aiState.currentDevice !== 'ai_core' && (
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.1}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          → {getDeviceLabel(aiState.currentDevice)}
        </Text>
      )}
    </group>
  );
}

// 根据状态返回颜色
function getStatusColor(status: string): string {
  switch (status) {
    case 'idle':
      return '#4ade80'; // 绿色
    case 'thinking':
      return '#fbbf24'; // 黄色
    case 'searching':
      return '#60a5fa'; // 蓝色
    case 'using_tool':
      return '#f472b6'; // 粉色
    case 'generating':
      return '#a78bfa'; // 紫色
    default:
      return '#4ade80';
  }
}

// 状态标签
function getStatusLabel(status: string): string {
  switch (status) {
    case 'idle':
      return '😊 Idle';
    case 'thinking':
      return '🤔 Thinking...';
    case 'searching':
      return '🔍 Searching...';
    case 'using_tool':
      return '🛠️ Using Tool...';
    case 'generating':
      return '✨ Generating...';
    default:
      return '😊 Idle';
  }
}

// 设备标签
function getDeviceLabel(device: string): string {
  switch (device) {
    case 'memory_shelf':
      return '📚 Memory Shelf';
    case 'search_terminal':
      return '🔍 Search Terminal';
    case 'network_console':
      return '🌐 Network Console';
    case 'skill_workbench':
      return '⚙️ Skill Workbench';
    case 'code_console':
      return '💻 Code Console';
    default:
      return device;
  }
}
