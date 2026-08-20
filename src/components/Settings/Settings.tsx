import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { XIcon } from "@primer/octicons-react";

type SettingsProps = {
  workingTime: number;
  breakTime: number;
  hideSettings: () => void;
  saveSettings: (settings: { workingTime: number; breakTime: number }) => void;
};

const Settings = ({
  workingTime: initialWorkingTime,
  breakTime: initialBreakTime,
  hideSettings,
  saveSettings,
}: SettingsProps) => {
  const [workingTime, setWorkingTime] = useState(initialWorkingTime);
  const [breakTime, setBreakTime] = useState(initialBreakTime);

  useEffect(() => {
    setWorkingTime(initialWorkingTime);
    setBreakTime(initialBreakTime);
  }, [initialBreakTime, initialWorkingTime]);

  const updateWorkingTime = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setWorkingTime(Number(event.target.value));
  }, []);

  const updateBreakTime = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBreakTime(Number(event.target.value));
  }, []);

  return (
    <div className="settings">
      <button className="btn btn-clear btn-dark"
        onClick={hideSettings}
      >
        <XIcon size={16} />
      </button>
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-content">
        <div>
          <label>Work</label>
          <input type="range" min="1" max="120" value={workingTime} onChange={updateWorkingTime} />
          <span>Working time: {workingTime} {workingTime > 1 ? 'minutes' : 'minute'}</span>
        </div>
        <div>
          <label>Break</label>
          <input type="range" min="1" max="120" value={breakTime} onChange={updateBreakTime} />
          <span>Break: {breakTime} {breakTime > 1 ? 'minutes' : 'minute'}</span>
        </div>
      </div>
      <button className="btn btn-success btn-full"
        onClick={() => saveSettings({workingTime, breakTime})}
      >
        Save
      </button>

    </div>
  );
};

export default Settings;
