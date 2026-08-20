import { fireEvent, render, screen } from "@testing-library/react";
import Controls from "./Controls";

describe("Controls", () => {
  it("starts a pomodoro from the toggle control", () => {
    const startWorking = jest.fn();

    render(
      <Controls
        startWorking={startWorking}
        stopWorking={jest.fn()}
        pomodoroStarted={false}
        reset={jest.fn()}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(startWorking).toHaveBeenCalledTimes(1);
  });
});
