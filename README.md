# AI OS — homepage

The current aikigai.ai site, and three versions of a new homepage.

Open **index.html** (or the GitHub Pages link) for a front page linking all four.

## Layout

    sites/
      00-original-live/     aikigai.ai as it stands today, for comparison
      14-original-colours/  new homepage, the palette the site already uses
      15-blush-panel/       new homepage, flat Chalk Blush hero panel
      16-teal/              new homepage, Signal Teal hero

Each folder is a complete site — all eleven pages. Between 14, 15 and 16 only
`index.html` and `theme.css` differ; everything else is byte-identical to the
current deploy.

## To put one live

Upload the **contents** of one folder to the Hostinger web root, not the folder
itself. Only the homepage changes — the other ten pages use `assets/styles.css`
and are untouched by the swap.

## What changed on the homepage

- Featured In press logos are links
- the client banner is larger — figures at 96px, logos at 60px
- the process section is replaced by the two-stage path, below the three lenses
- nothing pins any more; the page just scrolls
- the hero holds the founders' film
- the palette is no longer limited to one background colour

## Still outstanding

- The seven Featured In logos are links but have no URLs.
- The founders' film has not been shot. The hero holds a placeholder showing the
  two studio portraits behind a play button. Do not put that live as-is.
- The build carries 47 client logos; the page shows 8.
