import React, { useState } from 'react';

const Clock = (props) => {

  const { display, onBreak, pomodoroStarted } = props;


  return (
    <div className="clock" >
      {pomodoroStarted ?
        <div>
          <p>{!onBreak ? 'Working' : 'Break'}</p>
          <p>{display} left</p>
        </div> :
        <div className="start">
          <button className="btn btn-clear btn-start" onClick={props.startWorking}>Start</button>
        </div>
      }




    </div>

  );
};




export default Clock;