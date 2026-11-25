import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Scene3D } from "./scenes/Scene3D";
import { Captions } from "./components/Captions";

// Layers are stacked bottom -> top: 3D scene, captions, audio (invisible).
export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f1a" }}>
      <Scene3D />
      <Captions src={staticFile("captions.json")} />
      <Audio src={staticFile("audio.mp3")} volume={0.5} />
    </AbsoluteFill>
  );
};
