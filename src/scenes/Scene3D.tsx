import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// IMPORTANT: inside a ThreeCanvas, drive ALL motion from useCurrentFrame().
// Do not use useFrame() from @react-three/fiber or clocks/Date.now(): Remotion renders
// frames out of order and in parallel, so animation must be a pure function of the frame.
export const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12 } });
  const rotation = frame * 0.03;
  const cameraZ = interpolate(frame, [0, durationInFrames], [6, 4.5]);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 50, position: [0, 0, cameraZ] }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-4, -2, 3]} color="#ff4d6d" intensity={20} />

      <mesh rotation={[rotation * 0.6, rotation, 0]} scale={entrance}>
        <torusKnotGeometry args={[1, 0.32, 200, 32]} />
        <meshStandardMaterial color="#4cc9f0" metalness={0.6} roughness={0.25} />
      </mesh>

      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </ThreeCanvas>
  );
};
