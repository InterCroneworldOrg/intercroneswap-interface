let swapSound: HTMLAudioElement
export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio('')
  }
  return swapSound
}
