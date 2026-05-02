(function () {
  "use strict";

  const STORAGE_KEY = "guessWho_names_v1";
  const NOTES_STORAGE_KEY = "guessWho_notes_v1";

  const setupEl = document.getElementById("setup");
  const gameEl = document.getElementById("game");
  const namesInput = document.getElementById("names-input");
  const lineGutter = document.getElementById("line-gutter");
  const setupError = document.getElementById("setup-error");
  const startBtn = document.getElementById("start-btn");
  const boardEl = document.getElementById("board");
  const spinBtn = document.getElementById("spin-btn");
  const revealBtn = document.getElementById("reveal-btn");
  const hideBtn = document.getElementById("hide-btn");
  const resetBtn = document.getElementById("reset-btn");
  const editNamesBtn = document.getElementById("edit-names-btn");
  const secretStatus = document.getElementById("secret-status");
  const secretName = document.getElementById("secret-name");
  const spinnerVisual = document.getElementById("spinner-visual");
  const gameNotes = document.getElementById("game-notes");

  /** @type {string[]} */
  let names = [];
  /** @type {Set<number>} */
  let eliminated = new Set();
  /** @type {string | null} */
  let secretCharacter = null;
  let spinDone = false;
  let revealed = false;

  function parseNames(text) {
    return text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function showSetupError(msg) {
    setupError.textContent = msg;
    setupError.hidden = false;
  }

  function clearSetupError() {
    setupError.textContent = "";
    setupError.hidden = true;
  }

  function saveNamesToStorage(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) {
      /* ignore */
    }
  }

  function loadNamesFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 20 && parsed.every((x) => typeof x === "string")) {
        namesInput.value = parsed.join("\n");
      }
    } catch (_) {
      /* ignore */
    }
  }

  function loadNotesFromStorage() {
    if (!gameNotes) return;
    try {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      if (raw != null) gameNotes.value = raw;
    } catch (_) {
      /* ignore */
    }
  }

  function saveNotesToStorage() {
    if (!gameNotes) return;
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, gameNotes.value);
    } catch (_) {
      /* ignore */
    }
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    names.forEach((name, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card" + (eliminated.has(index) ? " eliminated" : "");
      btn.textContent = name;
      btn.setAttribute("role", "listitem");
      btn.setAttribute("aria-pressed", eliminated.has(index) ? "true" : "false");
      btn.addEventListener("click", () => toggleEliminate(index));
      boardEl.appendChild(btn);
    });
  }

  function toggleEliminate(index) {
    if (eliminated.has(index)) eliminated.delete(index);
    else eliminated.add(index);
    renderBoard();
  }

  function updateSecretUI() {
    if (!spinDone && !secretCharacter) {
      secretStatus.textContent = "Spin to get a random secret character.";
      secretName.classList.add("hidden");
      secretName.textContent = "";
      revealBtn.disabled = true;
      hideBtn.disabled = true;
      return;
    }

    if (revealed) {
      secretStatus.textContent = "Your secret character (only you should see this screen):";
      secretName.textContent = secretCharacter || "";
      secretName.classList.remove("hidden");
      revealBtn.disabled = true;
      hideBtn.disabled = false;
    } else {
      secretStatus.textContent =
        "Your character is chosen and hidden. Tap Reveal when no one else can see your screen.";
      secretName.classList.add("hidden");
      secretName.textContent = "";
      revealBtn.disabled = false;
      hideBtn.disabled = true;
    }
  }

  function startGame() {
    clearSetupError();
    const list = parseNames(namesInput.value);
    if (list.length !== 20) {
      showSetupError(`Please enter exactly 20 names (you have ${list.length}). One name per line.`);
      return;
    }
    const seen = new Set();
    for (const n of list) {
      if (seen.has(n.toLowerCase())) {
        showSetupError("Duplicate names are not allowed (case-insensitive).");
        return;
      }
      seen.add(n.toLowerCase());
    }

    names = list;
    saveNamesToStorage(names);
    eliminated = new Set();
    secretCharacter = null;
    spinDone = false;
    revealed = false;
    spinBtn.disabled = false;

    setupEl.classList.add("hidden");
    gameEl.classList.remove("hidden");
    renderBoard();
    updateSecretUI();
  }

  function runSpin() {
    if (names.length !== 20) return;
    spinBtn.disabled = true;
    revealBtn.disabled = true;
    hideBtn.disabled = true;
    revealed = false;
    secretCharacter = null;
    spinDone = false;
    secretStatus.textContent = "Spinning…";
    secretName.classList.add("hidden");
    secretName.textContent = "";
    spinnerVisual.classList.add("spinning");

    const durationMs = 2200;
    const chosen = names[Math.floor(Math.random() * names.length)];

    window.setTimeout(() => {
      secretCharacter = chosen;
      spinDone = true;
      spinnerVisual.classList.remove("spinning");
      spinBtn.disabled = false;
      updateSecretUI();
    }, durationMs);
  }

  function revealSecret() {
    revealed = true;
    updateSecretUI();
  }

  function hideSecret() {
    revealed = false;
    updateSecretUI();
  }

  function resetGame() {
    eliminated = new Set();
    secretCharacter = null;
    spinDone = false;
    revealed = false;
    renderBoard();
    updateSecretUI();
  }

  function openEditNames() {
    namesInput.value = names.join("\n");
    gameEl.classList.add("hidden");
    setupEl.classList.remove("hidden");
    clearSetupError();
  }

  startBtn.addEventListener("click", startGame);
  spinBtn.addEventListener("click", runSpin);
  revealBtn.addEventListener("click", revealSecret);
  hideBtn.addEventListener("click", hideSecret);
  resetBtn.addEventListener("click", resetGame);
  editNamesBtn.addEventListener("click", openEditNames);

  if (lineGutter) {
    let syncScroll = false;
    namesInput.addEventListener("scroll", () => {
      if (syncScroll) return;
      syncScroll = true;
      lineGutter.scrollTop = namesInput.scrollTop;
      syncScroll = false;
    });
    lineGutter.addEventListener("scroll", () => {
      if (syncScroll) return;
      syncScroll = true;
      namesInput.scrollTop = lineGutter.scrollTop;
      syncScroll = false;
    });
  }

  if (gameNotes) {
    let notesSaveTimer = null;
    gameNotes.addEventListener("input", () => {
      window.clearTimeout(notesSaveTimer);
      notesSaveTimer = window.setTimeout(saveNotesToStorage, 300);
    });
    gameNotes.addEventListener("blur", saveNotesToStorage);
  }

  loadNamesFromStorage();
  loadNotesFromStorage();
})();
