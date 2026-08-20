import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Clock from "./Clock";

describe("Clock", () => {
  it("starts a pomodoro when the start button is clicked", () => {
    const startWorking = jest.fn();

    render(
      <Clock
        display=""
        onBreak={false}
        pomodoroStarted={false}
        startWorking={startWorking}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    expect(startWorking).toHaveBeenCalledTimes(1);
  });
});
