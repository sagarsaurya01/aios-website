# AI OS — homepage versions

Working versions of the aikigai.ai homepage.

Open **index.html** (or the GitHub Pages link) for a front page linking all of them.

## Layout

    sites/                three complete sites, all eleven pages, uploadable
      14-original-colours/    the palette the site already uses
      15-blush-panel/         flat Chalk Blush hero panel
      16-teal/                Signal Teal hero
    versions/             single-file previews, 6-16
    versions/archive/     previews 1-5, superseded

Between the three sites, only `index.html` and `theme.css` differ. Everything
else is byte-identical to the current deploy.

## To put one live

Upload the **contents** of one `sites/` folder to the Hostinger web root, not
the folder itself. Only the homepage changes — the other ten pages use
`assets/styles.css` and are untouched.

Do not upload anything from `versions/`. Those are single files with smaller
images and no video, made for sending over WhatsApp.

## Still outstanding

- The seven Featured In logos are links but have no URLs.
- The founders' film has not been shot. The hero holds a placeholder showing
  the two studio portraits behind a play button.
- The build carries 47 client logos; the page shows 8.
