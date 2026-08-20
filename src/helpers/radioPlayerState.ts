import { RADIO_PLAYER_STORAGE_KEY } from "../constants/pomodoro";
import type { RadioPlayerState } from "../types/pomodoro";

const DEFAULT_RADIO_PLAYER_STATE: RadioPlayerState = {
  isMuted: false,
  previousVolume: 0.5,
  volume: 0.5,
};

const isRadioPlayerState = (value: unknown): value is RadioPlayerState => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const playerState = value as Record<string, unknown>;
  return (
    typeof playerState.isMuted === "boolean" &&
    typeof playerState.volume === "number" &&
    playerState.volume >= 0 &&
    playerState.volume <= 1 &&
    (playerState.previousVolume === undefined ||
      (typeof playerState.previousVolume === "number" &&
        playerState.previousVolume > 0 &&
        playerState.previousVolume <= 1))
  );
};

export const loadRadioPlayerState = (): RadioPlayerState => {
  const savedState = localStorage.getItem(RADIO_PLAYER_STORAGE_KEY);

  if (!savedState) {
    return DEFAULT_RADIO_PLAYER_STATE;
  }

  try {
    const parsedState: unknown = JSON.parse(savedState);
    if (!isRadioPlayerState(parsedState)) {
      return DEFAULT_RADIO_PLAYER_STATE;
    }

    return {
      ...parsedState,
      previousVolume: parsedState.previousVolume ??
        (parsedState.volume > 0 ? parsedState.volume : DEFAULT_RADIO_PLAYER_STATE.previousVolume),
    };
  } catch {
    return DEFAULT_RADIO_PLAYER_STATE;
  }
};

export const saveRadioPlayerState = (playerState: RadioPlayerState): void => {
  localStorage.setItem(RADIO_PLAYER_STORAGE_KEY, JSON.stringify(playerState));
};
