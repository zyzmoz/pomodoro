# Changelog

This file tracks user-visible changes by release. It follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Settings save as each value changes. The Save button is gone.
- Timer and Code Radio sliders now use a filled track, a high-contrast thumb, and a visible keyboard focus ring.
- The settings panel slides in from the right, unless reduced motion is enabled.

## [1.2.2] - 2026-08-20

### Added

- A fixed Code Radio player with play, pause, mute, and volume controls.
- The current Code Radio song title and artist in the player.
- Settings to start Code Radio with a Pomodoro and lower its volume during breaks.
- Jest and React Testing Library coverage for the clock, controls, and Pomodoro state.
- Strict TypeScript checking with `npm run typecheck`.
- A source layout with `components`, `constants`, `helpers`, `public`, `store`, and `types` directories.

### Changed

- The player now remembers its mute and volume choices between visits.
- Migrated from React 18 to React 19 and replaced `ReactDOM.render` with `createRoot`.
- Replaced hand-written Redux setup with Redux Toolkit, Redux 5, and React Redux 9.
- Converted application code, tests, and the service worker from JavaScript to TypeScript.
- Migrated Parcel 1 to Parcel 2 and updated the HTML entry point, asset URLs, and service-worker registration for Parcel 2.
- Replaced `@githubprimer/octicons-react` with `@primer/octicons-react`.
- Updated the Node.js version from 18.16.1 to 24.14.1.
- Reorganized source files to match the current project layout.

### Removed

- Legacy Babel configuration and Parcel 1 tooling.
- Hand-written Redux action constants and reducer helpers.

## [1.2.1] - 2023-09-14

### Changed

- Fixed the README.

## [1.2.0] - 2023-09-14

### Added

- Sound notifications.

### Security

- Updated Node.js to version 18.
- Updated packages to support Node.js 18.
