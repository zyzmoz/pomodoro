type ClockProps = {
  display: string;
  onBreak: boolean;
  pomodoroStarted: boolean;
  startWorking: () => void;
};

const Clock = ({ display, onBreak, pomodoroStarted, startWorking }: ClockProps) => {

  return (
    <div className="clock" role="timer" aria-live="polite">
      {pomodoroStarted && display ?
        <div>
          <p>{!onBreak ? 'Working' : 'Break'}</p>
          <p>{display} left</p>
        </div> :
        <div className="start">
          <button className="btn btn-clear btn-start" type="button" onClick={startWorking}>Start</button>
        </div>
      }




    </div>

  );
};




export default Clock;
