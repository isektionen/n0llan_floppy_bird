# Games folder

Keep each game in its own folder under this directory.

Recommended convention:

- `games/<slug>/index.html` for the entry page
- `games/<slug>/assets/` for images, audio, and other files
- add one entry in `games/catalog.json` so the hub can render it automatically

For a playable game, point `path` at the folder entry and set `status` to `playable`.
For a menu placeholder, keep the folder and mark it `coming-soon`.