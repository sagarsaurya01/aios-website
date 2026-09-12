# AI OS — the homepage

Anjali — this holds the site as it is today, and **three versions of a new homepage**.
All three say exactly the same thing and sit in exactly the same layout.
**Colour is the only difference between them.**

## See them without downloading anything

| | Open it |
|---|---|
| **The site as it is today** | https://sagarsaurya01.github.io/aios-website/sites/00-original-live/ |
| **Version 1 — our current colours** | https://sagarsaurya01.github.io/aios-website/sites/version-1-original-colours/ |
| **Version 2 — blush panel** | https://sagarsaurya01.github.io/aios-website/sites/version-2-blush-panel/ |
| **Version 3 — teal** | https://sagarsaurya01.github.io/aios-website/sites/version-3-teal/ |

Or open them all from one page: **https://sagarsaurya01.github.io/aios-website/**

Start with Version 1. It keeps the palette we already use, so it shows the changes
on their own, without colour in the way.

## What changed on the homepage

Everything you asked for is in all three versions.

- **Featured In** — the press logos are links now. *They still need the seven URLs from you.*
- **The client banner** — bigger. The figures and the logos both.
- **The part you didn't like** — gone. The two-stage path from the Lovable site is in
  its place, sitting below the three lenses, as you suggested.
- **Nothing sticks to the screen any more** — the page just scrolls, the way #3 did.
- **The hero** — holds the film of you and Ajay.
- **Colour** — no longer limited to one background colour.

## Two things still open

**The seven Featured In links have no URLs.** Could you send the link each logo should
open — the actual article or page? If one has no link, say so and it stays unclickable.

**The film hasn't been shot.** The hero currently shows your two studio portraits behind
a play button, marked "to be shot". It's a placeholder so you can see the shape of it —
it shouldn't go live as it is.

## One more thing worth deciding

The site carries **47 client logos** and the homepage currently shows **8**.
When you said the client banner should be bigger, did you mean bigger type — which is
what's been done — or *more clients on it*? The other 39 are already here if you want them.

---

<details>
<summary>Technical notes — for Sagar</summary>

    sites/
      00-original-live/              aikigai.ai as it stands today
      version-1-original-colours/    Paper ground, soft Chalk Blush hero wash, Onyx ink
      version-2-blush-panel/         flat Chalk Blush hero panel
      version-3-teal/                Signal Teal hero, apricot lower down
    prototypes/                      every version built along the way, one file each

Each `sites/` folder is a complete site — all eleven pages. Between the three versions
only `index.html` and `theme.css` differ; everything else is byte-identical to the
current deploy.

**To put one live:** upload the *contents* of that folder to the Hostinger web root,
not the folder itself. Only the homepage changes — the other ten pages use
`assets/styles.css` and are untouched by the swap.

**Don't upload anything from `prototypes/`.** Those are single files with smaller images
and no video, built for sending over WhatsApp. Numbers 01–05 also pre-date a fix to the
closing call to action, which was rendering cream on cream and could not be read, so the
last screen looks blank on those five.

A malformed `<link rel="apple-touch-icon">` line in the live `index.html`, left over from
an old find-and-replace, is repaired in all three versions.

</details>
