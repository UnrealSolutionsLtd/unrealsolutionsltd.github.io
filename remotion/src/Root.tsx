import React from 'react';
import { Composition } from 'remotion';
import { VeraDemo } from './VeraDemo';

// 15s @ 30fps = 450 frames. 1280x720 keeps render times sane and is plenty for a web hero.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VeraDemo"
      component={VeraDemo}
      durationInFrames={450}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
