export const secondsToMMSS = (
  seconds: number,
  addColon: boolean
): string => {
  const minutes: number = Math.floor(seconds / 60);
  const remainingSeconds: number = seconds % 60;

  const minutesString: string = String(minutes).padStart(2, '0');
  const secondsString: string = String(remainingSeconds).padStart(2, '0');

  return `${minutesString}${addColon ? ':' : ''}${secondsString}`;
};
