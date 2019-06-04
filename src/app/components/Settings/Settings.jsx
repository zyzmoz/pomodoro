import React, { useState, useEffect } from 'react';
import Octicon, { X } from '@githubprimer/octicons-react';

const Settings = (props) => {
  const [workingTime, setWorkingTime] = useState();
  const [breakTime, setBreakTime] = useState();
  useEffect(()=> {  
    setBreakTime(props.breakTime);
    setWorkingTime(props.workingTime);
  },[]);
  
  return (
    <div className="settings">
      <button className="btn btn-clear btn-dark"
        onClick={props.hideSettings}
      >
        <Octicon icon={X} size="medium" />
      </button>
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-content">
        <div>
          <label>Work</label>
          <input type="range" min="1" max="120" value={workingTime} onChange={e => setWorkingTime(e.target.value)} />
          <span>Working time: {workingTime} {workingTime > 1 ? 'minutes' : 'minute'}</span>
        </div>
        <div>
          <label>Break</label>
          <input type="range" min="1" max="120" value={breakTime} onChange={e => setBreakTime(e.target.value)} />
          <span>Break: {breakTime} {breakTime > 1 ? 'minutes' : 'minute'}</span>
        </div>
      </div>
      <button className="btn btn-success btn-full"
        onClick={() => props.saveSettings({workingTime, breakTime})}      
      >
        Save
      </button>

    </div>
  );
};

export default Settings;