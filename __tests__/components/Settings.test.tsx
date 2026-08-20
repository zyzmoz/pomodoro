import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_THEME_COLORS } from "../../src/helpers/colors";
import Settings from "../../src/components/Settings/Settings";

describe("Settings", () => {
  it("saves a customized color palette", async () => {
    const saveSettings = jest.fn();
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        hideSettings={jest.fn()}
        saveSettings={saveSettings}
      />
    );

    fireEvent.change(screen.getByLabelText("Primary color"), {
      target: { value: "#123456" },
    });
    fireEvent.change(screen.getByLabelText("Secondary color"), {
      target: { value: "#FFFFFF" },
    });
    fireEvent.change(screen.getByLabelText("Tertiary color"), {
      target: { value: "#FFFFFF" },
    });
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(saveSettings).toHaveBeenCalledWith({
      workingTime: 15,
      breakTime: 5,
      primaryColor: "#123456",
      secondaryColor: "#FFFFFF",
      tertiaryColor: "#FFFFFF",
    });
  });

  it("resets the primary color to the default before saving", async () => {
    const saveSettings = jest.fn();
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#123456"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        hideSettings={jest.fn()}
        saveSettings={saveSettings}
      />
    );

    await user.click(screen.getByRole("button", { name: "Reset colors" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(saveSettings).toHaveBeenCalledWith({
      workingTime: 15,
      breakTime: 5,
      primaryColor: DEFAULT_THEME_COLORS.primary,
      secondaryColor: DEFAULT_THEME_COLORS.secondary,
      tertiaryColor: DEFAULT_THEME_COLORS.tertiary,
    });
  });

  it("gives every settings control an accessible label", () => {
    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#412226"
        tertiaryColor="#000000"
        hideSettings={jest.fn()}
        saveSettings={jest.fn()}
      />
    );

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getByLabelText("Close settings")).toBeTruthy();
    expect(screen.getByLabelText("Work duration")).toBeTruthy();
    expect(screen.getByLabelText("Break duration")).toBeTruthy();
    expect(screen.getByLabelText("Primary color")).toBeTruthy();
    expect(screen.getByLabelText("Secondary color")).toBeTruthy();
    expect(screen.getByLabelText("Tertiary color")).toBeTruthy();
  });
});
