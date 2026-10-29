# Going back to GitHub — the safe way

You asked for one thing above all: **the current setup in the repo stays exactly as it is, as standby, and nothing is deleted.** These steps do that. They never touch `main`, they never force-push, and everything can be undone with one command.

---

## 0 · The rule

`main` = **what is live today. Standby. Untouched.**
`ivory-v2` = **the fresh build.** A new branch. It cannot harm `main`.

Branches in git are free. Keep `main` frozen forever if you like; if the new build ever disappoints, `git checkout main` and the house is exactly as it was this morning.

---

## 1 · In the repo, on GitHub, do this first (2 minutes)

1. **Tag the standby** so it can never be lost:
   - Repo → *Releases* → *Draft a new release* → tag `standby-2026-10-30` → target `main` → publish.
   - This is a permanent, named photograph of today's live site.
2. Optionally protect `main`: *Settings → Branches → Add branch protection rule* → `main` → tick *Lock branch* or just *Require a pull request*. Then nobody (including me) can push over it by accident.

Nothing else is needed. The old site keeps serving.

---

## 2 · Bring in the new build (on your machine)

```bash
git clone git@github.com:<your-org>/<twin-repo>.git
cd <twin-repo>
git fetch --all
git checkout -b ivory-v2 origin/main     # new branch, from today's main
```

Copy the release package in. Keep the old files where they are if the repo's structure must be preserved, or put the new house in its own folder:

```bash
mkdir -p v2
unzip -o /path/to/IVORY-house.zip -d v2
mv v2/IVORY_WEB_V2.html v2/index.html
mv v2/IVORY_STUDIO.html v2/studio.html
```

Commit and push the branch — it is visible in the repo but **not live**:

```bash
git add v2
git commit -m "IVORY v2 — the daylight house: member build + studio, Gilded Hours rite, golden heart film"
git push -u origin ivory-v2
```

---

## 3 · Look at it before anyone else does

GitHub Pages can publish a branch on its own URL:

*Settings → Pages → Source: Deploy from a branch → Branch: `ivory-v2` / `root` → Save.*

You get `https://<org>.github.io/<twin-repo>/` serving the branch, **while `main` still serves the live site.** When you are happy:

*Settings → Pages → Branch: `main`* (or merge `ivory-v2` → `main` through a pull request) — and the new house is live. If it ever needs to go back:

```bash
git checkout main && git push origin main --force-with-lease   # only if main was merged
# or simply: re-point Pages back to main, and re-deploy the standby tag
```

---

## 4 · Before you merge — three things only a human can confirm

1. **The real clock.** The rite of the wheel only opens 9:07–11:07, 14:07–16:07 and Sunday 7:07–9:07. Open the site at 09:10 and confirm the film plays and the crest falls.
2. **A phone, not a laptop.** Safari on an iPhone and Chrome on a mid-range Android. The film is `muted playsinline` so it autoplays; iOS sometimes needs one extra beat — tell me if it shows a still frame and I will switch to a poster-first path.
3. **Her eyes.** The build is one file; you can hand her the file itself before any of this.

---

## 5 · What is *not* in the repo yet, on purpose

- No build system, no bundler, no framework. One HTML file per house, exactly as she approved.
- No package.json, no `node_modules`, no CI. Nothing to install, nothing to break.
- Payments, mail and the jury are still staged in the file (`DEMO` markers). The production swap is a backend job, and it should be done on `ivory-v2` after the visual sign-off — not before.
