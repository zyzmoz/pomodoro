import { useCallback } from "react";
import {
  InfoIcon,
  SquareIcon,
  SyncIcon,
  TriangleRightIcon,
} from "@primer/octicons-react";

type ControlsProps = {
  startWorking: () => void;
  stopWorking: () => void;
  pomodoroStarted: boolean;
  reset: () => void;
};

const Controls = ({ startWorking, stopWorking, pomodoroStarted, reset: resetPomodoro }: ControlsProps) => {
  const toggle = useCallback(() => {
    if (!pomodoroStarted) {
      startWorking();
      return;
    }

    stopWorking();
  }, [pomodoroStarted, startWorking, stopWorking]);

  const reset = useCallback(() => {
    if (pomodoroStarted) {
      resetPomodoro();
    }
  }, [pomodoroStarted, resetPomodoro]);

  return (
    <div className="app-controls">
      <button className="btn btn-round btn-small"
        onClick={reset}
      >
        <SyncIcon />
      </button>

      <button className="btn btn-round "
        onClick={toggle}
      >
        {!pomodoroStarted ? <TriangleRightIcon size={16} /> : <SquareIcon size={16} />}
      </button>

      <button className="btn btn-round btn-small">
        <InfoIcon />
      </button>
    </div>
  );
};

export default Controls;
