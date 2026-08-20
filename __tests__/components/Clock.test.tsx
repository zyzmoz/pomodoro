import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Clock from "../../src/components/Clock/Clock";

describe("Clock", () => {
  it("starts a pomodoro when the start button is clicked", async () => {
    const startWorking = jest.fn();
    const user = userEvent.setup();

    render(
      <Clock
        display=""
        onBreak={false}
        pomodoroStarted={false}
        startWorking={startWorking}
      />
    );

    await user.click(screen.getByRole("button", { name: "Start" }));

    expect(startWorking).toHaveBeenCalledTimes(1);
  });
});
