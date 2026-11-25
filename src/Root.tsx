import { Composition } from "remotion";
import { Main } from "./Main";

export const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={FPS * 8}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
