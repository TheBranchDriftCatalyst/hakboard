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

- [ ] Time Widget
- [ ] Weather Widget
  - Uses open weather API
- [ ] News Widget
  - Utilizes Panda RSS feeds
- [ ] Agenda Widget (calendar)
  - connected to google calendar
- [ ] Todo Widget
  - connected to notion databases
- [ ] Meal Prep widget
  - connected to notion database
- Notes Widget
- create automatic preview generation
  - gulp task that runs the server and screenshots the page
  - [can copy this](https://github.com/TheBranchDriftCatalyst/jsonresume-theme-catalyst/blob/af4f5dea9ac9a21f224124a347a1e42d63caa0d7/gulp/pdf.js)

- [ ] Final Styling
  - synthwave it up
- Integrate react grid on widgets
  - allow for drag and drop of widgets
- integrate wiget configuration mode
  - allow saving and loading configuration to local storage
- switch from static backgrounds to dropbox background source

## Preview

> Currently in version 0.0.1

![](docs/preview.png)

## Getting Started

First, run the development server:

```bash
yarn dev
```
