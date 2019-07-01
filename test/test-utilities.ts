

export const waitForFrames = async (frameCount: number) => {
  while (frameCount-- > 0) {
    await new Promise(r => requestAnimationFrame(r));
  }
};
