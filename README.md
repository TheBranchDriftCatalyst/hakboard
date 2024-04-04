# Innercircle Challenge

[Check it out Here]()

## TL:DR

This is a small dashboard that allows the user to add 'boxes' (widgets) to a draggable grid layout. They can, save, clear, resize, drag boxes (widgets) around the screen.

### About Users and Profiles

The concept of a user right now is tied to that of a unique browser.  So every browser is a unique user.  Adding more robust users that
are not tied to browsers requires

  1. implementing next/auth workflows and prisma DB setup.
  2. implementing user login
  3. refactor FE persistence layer to be hybrid BE/FE

## Auto Deployment

WARNING: Any changes pushed to origin/innercircle will be auto deployed via github actions

## Dev Setup

### Dev Start

```shell
npm install -g yarn
yarn install

yarn dev
```

### Build

```shell
npm install -g yarn
yarn install

yarn build
```

### Tach Stack

- next.js for the server framework
- react for the frontend framework
- tailwind css for the ui css library
- shadcn for the component library
- github actions deployment

Tech for features not yet implemented

- mongo + prisma ORM for database backend persistence
- visual testing framework storybook storyshots
- testing framework Jest

## InnerCircle Task Breakdown

- [100] draggable grid layout (in-progress)
  - TopBar
    - [100%] Add Box +
    - [100%] Clear
    - [100%] resize
    - [100%] drag
    - [100%] save/load profiles (optional)
- [100%] github deployment actions workflow (easy- last thing)
- [95%] localstorage persistence (doneish)
  - [95%] clean this up a bit, change to ephemeral persistence strategy
- [ ] cleanup theme (is a little dark right now)
- Other stuff
  - [ ] ~database persistence (stretch goal)~

# Part 2 Reintegration

> Not part of the innercircle project

- [ ] back integrate innercircle branch refactors and feature additions (innercircle -> master)
