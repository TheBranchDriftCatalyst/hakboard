# Innercircle Branch Divergence Plan

## TODO

I have had an outstanding task to refactor and fix my innercircle-challenge-dashboard project.  This has to deal with saving and editing dashboards as profiles.  This was a perfect oppurtunity for me to take my innercircle-challenge project, simplify it and reimplement a more robust localstorage and
persistence layers.  So I added a fairly heavy focus to this layer.

### Breakdown

- Disconnect widgets and refactor ReactGrid persistence and control layers

- [ ] draggable grid layout (in-progress)
  - TopBar
    - [ ] Add +
    - [ ] Clear
    - [x] resize
    - [x] drag
- [ ] github deployment actions workflow (easy- last thing)
- [x] localstorage persistence (doneish)
  - [ ] clean this up a bit, change to ephemeral persistence strategy
- [ ] cleanup theme (is a little dark right now)
- Other stuff
  - [ ] database persistence (stretch goal)
  - [ ] docker file (stretch)


- [ ] prune divergence of innercircle-challenge crap
  - do this in a SEPARATE COMMIT
