This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview

This is a custom digital dashboard inspired by Dakboard, designed to offer more interactive
features and integration capabilities, particularly with Notion for database connections. As
well as resolve the constant disconnects that occurred with Dakboard.
Dissatisfied with Dakboard's limited interactivity and feature set, I created this project
to provide a highly customizable and interactive platform. It includes interactive widgets,
seamless Notion integration for real-time data display, and extensive customization options
to fit my needs.

## Status

None of these components are fully implemented yet but the POCs are working more or less

- [75%] Time Widget
- [70%] Weather Widget
  - Uses open weather API
  - style
- [50%] News Widget
  - Utilizes Panda RSS feeds
  - style and marguee mode
- [ ] Agenda Widget (calendar)
  - connected to google calendar
- [ ] Todo Widget
  - connected to notion databases
- [ ] Meal Prep widget
  - connected to notion database
- Notes Widget
- [75%!!!] create automatic preview generation (pupetteer hanging)
  - gulp task that runs the server and screenshots the page

- [ ] Final Styling
  - synthwave it up???
- [75%] Integrate react grid on widgets
  - [100%] allow for drag and drop of widgets
  - [80%]allow resizing of widgets
  - [100%] load and save widget layout on change
  - export widget layout to file???
  - handle proper overflow scrolling for widgets
    - autoscroll marquee ability on the scroll area component
- [33%] integrate wiget configuration mode
  - [ ] allow saving and loading widget configuration to local storage
  - currently using levo but tempted to move back to flippable cards...
- [] switch from static backgrounds to dropbox background source

## Preview

> Currently in version 0.0.1

![](docs/preview.png)

## Getting Started

First, run the development server:

```bash
yarn dev
```
