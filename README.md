# Guess Who — Web Card Game

A simple browser game inspired by the physical **Guess Who** game. Two people can play on separate phones or laptops using the **same deployed link**—no server or account required. Each player enters the same twenty names, spins privately to get their secret character, then asks questions and taps names to eliminate them.

## How to play

1. **Enter 20 names** (one per line) and click **Start game**.
2. On **each device**, open the same page and enter the **same 20 names in the same order**.
3. Each player clicks **Spin for my character** and, when alone, taps **Reveal** to see who they are. Use **Hide again** if someone might see the screen.
4. Take turns asking yes/no questions **out loud** (the app does not relay chat).
5. Tap a name card to **eliminate** or **restore** that person (tap again to undo).
6. **Reset game** clears eliminations and your secret character so you can spin again with the same board. **Edit names** returns to the setup screen to change the list.

## Run locally

You can open `index.html` directly in your browser (double-click or **File → Open**).

For a local server (recommended so behavior matches hosting):

```bash
cd "guess who"
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Create the GitHub repository and push

This folder is a standalone Git repository (with an initial commit). Create an empty repo on GitHub, then connect and push:

1. Go to [github.com/new](https://github.com/new) and create a repository (for example `guess-who`). Do **not** add a README, `.gitignore`, or license—this project already includes them.
2. In Terminal, from this project directory:

```bash
cd "/Users/emily/Desktop/guess who"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name. If Git asks for credentials, use a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) as the password, or use [GitHub Desktop](https://desktop.github.com/).

## Deploy on GitHub Pages

1. After the steps above, your code should be on GitHub.
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **main** (or **master**) and folder **/ (root)**, then save.
5. After a minute, your site will be at `https://<username>.github.io/<repository>/`.

Players open that URL on each device. There is no sync between devices: each person keeps their own eliminations and secret character on their own screen, which matches playing with two physical boards.

## Files

| File        | Role                          |
| ----------- | ----------------------------- |
| `index.html` | Page structure and controls  |
| `styles.css` | Layout and theme             |
| `game.js`    | Game logic and local storage |

## Privacy

Names you enter are stored only in **this browser** (`localStorage`) to make setup easier on refresh. Nothing is sent to a server.
