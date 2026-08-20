import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Controls from "../../src/components/Controls/Controls";

describe("Controls", () => {
  it("starts a pomodoro from the toggle control", async () => {
    const startWorking = jest.fn();
    const user = userEvent.setup();

    render(
      <Controls
        startWorking={startWorking}
        stopWorking={jest.fn()}
        pomodoroStarted={false}
        reset={jest.fn()}
      />
    );

    await user.click(screen.getAllByRole("button")[1]);

    expect(startWorking).toHaveBeenCalledTimes(1);
  });
});
