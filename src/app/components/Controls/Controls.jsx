import React from 'react';
import Octicon, { TriangleRight, Info, Sync, PrimitiveSquare } from '@githubprimer/octicons-react';

const Controls = (props) => {
  const toggle = () => {
    if (!props.pomodoroStarted)
      props.startWorking()
    else
      props.stopWorking()
  }

  const reset = () => {
    if (props.pomodoroStarted)
      props.reset();
  }
  
  return (
    <div className="app-controls">
      <button className="btn btn-round btn-small"
        onClick={reset}
      >
        <Octicon icon={Sync} />
      </button>

      <button className="btn btn-round "
        onClick={toggle}
      >
        <Octicon icon={!props.pomodoroStarted ? TriangleRight : PrimitiveSquare} size="medium" />
      </button>

      <button className="btn btn-round btn-small">
        <Octicon icon={Info} />
      </button>
    </div>
  );
};

export default Controls;