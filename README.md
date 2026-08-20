# Pomodoro Clock

A browser-based Pomodoro timer for focused work and break sessions. It stores preferences in the browser, so there is no account or server to set up.

![Pomodoro Clock screenshot](./screenshot.png)

## What it does

- Starts, stops, and resets work sessions.
- Alternates between work and break periods.
- Saves timer durations, colors, and Code Radio preferences in local storage.
- Plays a bell and shows a browser notification when a period ends.
- Includes an installable PWA and service worker.

## Code Radio player

The bottom player streams the official Code Radio MP3 feed. It shows the current song title and artist, and has play, pause, mute, and volume controls.

The player does not start when the page opens. In Settings, you can choose to start it when a Pomodoro begins and lower its volume during breaks. Settings save as you change them, so there is no Save button. Your mute and volume choices remain after you return.

## Settings

The Timer tab opens first and contains work and break durations. Appearance holds the color controls, and Code Radio holds the player preferences. The panel slides in from the right. If your device asks for reduced motion, it opens without the animation.

## Stack

- React 19
- Redux Toolkit and React Redux
- TypeScript
- Parcel 2
- Primer Octicons
- Jest and React Testing Library

## Requirements

Use Node.js 24.14.1. The version is pinned in `.nvmrc`.

## Commands

Start the development server on port 8080:

```bash
npm start
```

Run the test suite:

```bash
npm test
```

Check TypeScript types:

```bash
npm run typecheck
```

Create a production build in `dist`:

```bash
npm run build
```

## Project layout

```text
src/
├── assets/       Styles, icons, and sounds
├── components/   Clock, controls, settings, and Code Radio UI
├── constants/    Shared values such as default durations
├── helpers/      Color, local storage, notification, and radio code
├── public/       HTML entry point, manifest, and service worker
├── store/        Redux Toolkit store and Pomodoro slice
├── types/        Shared TypeScript types
├── App.tsx
└── index.tsx
```

## Roadmap

- [ ] Profiles

## License

MIT
