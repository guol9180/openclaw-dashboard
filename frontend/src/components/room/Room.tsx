/**
 * 房间环境组件
 */

export function Room() {
  return (
    <group>
      {/* 地板 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* 网格线（装饰） */}
      <gridHelper
        args={[20, 20, '#2a2a4e', '#2a2a4e']}
        position={[0, 0.01, 0]}
      />

      {/* 墙壁（可选，暂时不渲染） */}
      {/* <Walls /> */}
    </group>
  );
}
