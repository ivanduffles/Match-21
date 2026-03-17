const GRID_SIZE = 7;
const DRAW_PILE_SIZE = 10;
const KING_VALUE = 13;
const SNAP_OVERLAP_THRESHOLD = 0.66;
const DRAG_START_THRESHOLD = 8;
const KING_DOUBLE_TAP_WINDOW_MS = 360;
const INVALID_FEEDBACK_MS = 360;
const DRAW_RANDOM_SALT = 0x9e3779b9;

const SUITS = ["S", "D"];
const SUIT_META = {
  S: { name: "Spades", colorGroup: "black" },
  D: { name: "Diamonds", colorGroup: "red" },
};

const RANK_LABELS = {
  1: "A",
  11: "J",
  12: "Q",
  13: "K",
};

const SUIT_SVGS = {
  S: (color) => `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="${color}" d="M68.4184 78.3851C76.0354 78.0722 83.1066 73.9177 87.0458 67.3777C93.8373 56.104 90.1238 44.824 82.8949 38.1044L53.3699 9.82519C51.705 8.29785 49.1525 8.29785 47.4875 9.82519L17.533 38.1044C10.5051 44.6366 7.50581 55.483 13.3774 66.4407C17.1046 73.3974 24.1945 78.0847 32.0681 78.3883C37.1961 78.585 42.3046 76.8686 45.2744 74.0912C46.0551 73.36 45.9055 74.9277 45.9055 80.2439C45.9055 83.788 43.731 87.0411 39.382 90.003C38.7947 91.0362 39.5383 92.3203 40.7255 92.3203L60.132 92.3203C61.3194 92.3203 62.0644 91.0362 61.4754 90.003C57.0808 86.1139 54.8835 82.8608 54.8835 80.2439C54.8835 76.3185 54.7839 73.3507 55.5368 74.0788C58.4247 76.8748 63.2456 78.5988 68.4184 78.3851Z"/>
    </svg>
  `,
  D: (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="${color}" d="M32 4 52 32 32 60 12 32 32 4Z"/>
    </svg>
  `,
};

const CROWN_SVG = `
  <svg viewBox="0 0 64 48" aria-hidden="true">
    <path fill="#dcb257" d="M7 39h50l4-24-15 10-14-18-14 18L3 15l4 24Z"/>
    <path fill="#f4d98f" d="M10 39h44l2-12-11 7-13-16-13 16-11-7 2 12Z"/>
    <rect x="8" y="39" width="48" height="6" rx="2" fill="#9c6f1f"/>
  </svg>
`;

const boardEl = document.getElementById("board");
const drawButtonEl = document.getElementById("drawButton");
const drawCountEl = document.getElementById("drawCount");
const restartButtonEl = document.getElementById("restartButton");
const endgameOverlayEl = document.getElementById("endgameOverlay");
const endgameEyebrowEl = document.getElementById("endgameEyebrow");
const endgameTitleEl = document.getElementById("endgameTitle");
const endgameBodyEl = document.getElementById("endgameBody");
const endgameActionButtonEl = document.getElementById("endgameActionButton");

const state = {
  currentSeed: 0,
  levelSeed: null,
  drawPlacementRng: null,
  nextCardSerial: 0,
  grid: createEmptyGrid(),
  drawPile: [],
  selectedCell: null,
  invalidTarget: null,
  pointerState: null,
  lastKingTap: null,
  gameState: "playing",
  inputLocked: false,
};

let invalidFeedbackTimerId = 0;

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => null));
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function animateElement(element, keyframes, options = {}) {
  if (!element || typeof element.animate !== "function") {
    return wait(options.duration || 0);
  }
  const animation = element.animate(keyframes, { fill: "forwards", ...options });
  return animation.finished.catch(() => {});
}

function nextFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let value = Math.imul(t ^ (t >>> 15), t | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function deriveSeed(seed, salt) {
  return (seed ^ salt) >>> 0;
}

function createRandomSeed() {
  if (window.crypto?.getRandomValues) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return Math.floor(Math.random() * 4294967295) >>> 0;
}

function createCardIdFactory(seed) {
  let serial = 0;
  return {
    next(prefix = "card") {
      const id = `${prefix}-${seed}-${serial}`;
      serial += 1;
      return id;
    },
    count() {
      return serial;
    },
  };
}

function getRankLabel(rankValue) {
  return RANK_LABELS[rankValue] || String(rankValue);
}

function getRankName(rankValue) {
  if (rankValue === 1) {
    return "Ace";
  }
  if (rankValue === 11) {
    return "Jack";
  }
  if (rankValue === 12) {
    return "Queen";
  }
  if (rankValue === 13) {
    return "King";
  }
  return String(rankValue);
}

function getSuitName(suit) {
  return SUIT_META[suit]?.name || "Unknown";
}

function getSuitColorHex(suit) {
  return SUIT_META[suit]?.colorGroup === "red" ? "#ca2e38" : "#182334";
}

function createCard({ id, rankValue, suit, row = -1, col = -1 }) {
  return {
    id,
    rankValue,
    suit,
    colorGroup: SUIT_META[suit].colorGroup,
    row,
    col,
  };
}

function cloneCard(card) {
  return card ? { ...card } : null;
}

function cloneGrid(grid) {
  return grid.map((row) => row.map((card) => cloneCard(card)));
}

function cloneLevelSeed(levelSeed) {
  return {
    seed: levelSeed.seed,
    board: cloneGrid(levelSeed.board),
    drawPile: levelSeed.drawPile.map((card) => cloneCard(card)),
    nextCardSerial: levelSeed.nextCardSerial,
  };
}

function setCell(row, col, card) {
  if (card) {
    card.row = row;
    card.col = col;
    card.colorGroup = SUIT_META[card.suit].colorGroup;
  }
  state.grid[row][col] = card;
}

function drawRandomRank(prng) {
  return 1 + Math.floor(prng() * 12);
}

function drawRandomSuit(prng) {
  return SUITS[Math.floor(prng() * SUITS.length)];
}

function createLevelSeed(seed) {
  const prng = mulberry32(seed);
  const ids = createCardIdFactory(seed);
  const board = createEmptyGrid();

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      board[row][col] = createCard({
        id: ids.next("board"),
        rankValue: drawRandomRank(prng),
        suit: drawRandomSuit(prng),
        row,
        col,
      });
    }
  }

  const drawPile = Array.from({ length: DRAW_PILE_SIZE }, () =>
    createCard({
      id: ids.next("draw"),
      rankValue: drawRandomRank(prng),
      suit: drawRandomSuit(prng),
    })
  );

  return {
    seed,
    board,
    drawPile,
    nextCardSerial: ids.count(),
  };
}

function nextRuntimeCardId(prefix = "runtime") {
  const id = `${prefix}-${state.currentSeed}-${state.nextCardSerial}`;
  state.nextCardSerial += 1;
  return id;
}

function loadLevelSeed(levelSeed) {
  const snapshot = cloneLevelSeed(levelSeed);
  clearInvalidTarget(false);
  cleanupPointerState();

  state.currentSeed = snapshot.seed;
  state.levelSeed = snapshot;
  state.nextCardSerial = snapshot.nextCardSerial;
  state.drawPlacementRng = mulberry32(deriveSeed(snapshot.seed, DRAW_RANDOM_SALT));
  state.grid = cloneGrid(snapshot.board);
  state.drawPile = snapshot.drawPile.map((card) => cloneCard(card));
  state.selectedCell = null;
  state.invalidTarget = null;
  state.pointerState = null;
  state.lastKingTap = null;
  state.gameState = "playing";
  state.inputLocked = false;

  closeEndgame();
  renderBoard();
  renderHud();
  evaluateGameState();
}

function startGame(seed = createRandomSeed()) {
  loadLevelSeed(createLevelSeed(seed));
}

function restartCurrentLevel() {
  if (state.inputLocked || !state.levelSeed) {
    return;
  }
  loadLevelSeed(state.levelSeed);
}

function startNextGame() {
  if (state.inputLocked) {
    return;
  }
  startGame(createRandomSeed());
}

function getCell(row, col) {
  return state.grid[row]?.[col] || null;
}

function isKing(card) {
  return Boolean(card) && card.rankValue === KING_VALUE;
}

function canCardsMerge(cardA, cardB) {
  if (!cardA || !cardB || cardA.id === cardB.id) {
    return false;
  }
  if (isKing(cardA) || isKing(cardB)) {
    return false;
  }
  return cardA.colorGroup === cardB.colorGroup;
}

function getMergeResultRank(valueA, valueB) {
  return ((valueA + valueB - 1) % KING_VALUE) + 1;
}

function getRankTransitionValues(startValue, endValue) {
  const values = [];
  let current = startValue;
  while (true) {
    current = (current % KING_VALUE) + 1;
    values.push(current);
    if (current === endValue || values.length > KING_VALUE) {
      break;
    }
  }
  return values;
}

function isBoardEmpty() {
  return state.grid.every((row) => row.every((card) => card === null));
}


function getActiveBoardSuits() {
  const suits = new Set();
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const card = state.grid[row][col];
      if (card) {
        suits.add(card.suit);
      }
    }
  }
  return Array.from(suits);
}

function getEmptyCells() {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (!state.grid[row][col]) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

function hasAnyLegalMerge() {
  let redNonKings = 0;
  let blackNonKings = 0;

  state.grid.forEach((row) => {
    row.forEach((card) => {
      if (!card) {
        return;
      }
      if (isKing(card)) {
        return;
      }
      if (card.colorGroup === "red") {
        redNonKings += 1;
      } else {
        blackNonKings += 1;
      }
    });
  });

  return redNonKings >= 2 || blackNonKings >= 2;
}

function formatCard(card) {
  return `${getRankName(card.rankValue)} of ${getSuitName(card.suit)}`;
}

function describeSelectionMessage(card) {
  if (isKing(card)) {
    return `${formatCard(card)} selected. Tap it again quickly to clear it.`;
  }
  return `${formatCard(card)} selected. Pick another ${card.colorGroup} card.`;
}

function isSameCell(position, row, col) {
  return Boolean(position) && position.row === row && position.col === col;
}

async function clearKingAt(row, col) {
  const kingCard = getCell(row, col);
  if (!isKing(kingCard)) {
    return false;
  }

  const kingEl = getBoardCardElement(row, col);
  const kingRect = kingEl?.getBoundingClientRect();

  state.inputLocked = true;
  renderHud();

  try {
    if (kingEl && kingRect) {
      await Promise.all([
        animateElement(
          kingEl,
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(1.08)", opacity: 1 },
            { transform: "scale(0.32)", opacity: 0 },
          ],
          {
            duration: 280,
            easing: "cubic-bezier(.2,.8,.2,1)",
          }
        ),
        playSparkles(kingRect),
      ]);
    }
  } finally {
    setCell(row, col, null);
    state.inputLocked = false;
    renderBoard();
    renderHud();
  }

  setMessage("Royal clear. King removed.");
  evaluateGameState({ preserveMessage: true });
  return true;
}

function buildIdleMessage() {
  return "";
}

function setMessage(_text) {}

function renderHud() {
  drawCountEl.textContent = String(state.drawPile.length);
  drawButtonEl.disabled = state.gameState !== "playing" || state.inputLocked;
  restartButtonEl.disabled = state.inputLocked;
  drawButtonEl.setAttribute("aria-label", `Draw card. ${state.drawPile.length} remaining.`);
}

function createCardFaceMarkup(card) {
  const rankLabel = getRankLabel(card.rankValue);
  const suitColor = getSuitColorHex(card.suit);
  const suitSvg = SUIT_SVGS[card.suit]?.(suitColor) || "";
  const crownMarkup = isKing(card)
    ? `<span class="card-face__crown" aria-hidden="true">${CROWN_SVG}</span>`
    : "";

  return `
    <span class="card-face__corner card-face__corner--top" aria-hidden="true">
      <span class="card-face__rank">${rankLabel}</span>
    </span>
    <span class="card-face__center" aria-hidden="true">
      <span class="card-face__large-suit">${suitSvg}</span>
      ${crownMarkup}
    </span>
    <span class="card-face__corner card-face__corner--bottom" aria-hidden="true">
      <span class="card-face__rank">${rankLabel}</span>
    </span>
  `;
}

function buildCardElement(card, options = {}) {
  const { isFx = false, row = null, col = null } = options;
  const element = document.createElement(isFx ? "div" : "button");
  element.classList.add("playing-card", isFx ? "fx-card" : "board-card");
  element.classList.add(card.colorGroup === "red" ? "playing-card--red" : "playing-card--black");

  if (isKing(card)) {
    element.classList.add("playing-card--king");
  }

  if (!isFx) {
    element.type = "button";
    element.dataset.row = String(row);
    element.dataset.col = String(col);
    element.dataset.cardId = card.id;
    element.setAttribute("aria-label", formatCard(card));
  } else {
    element.setAttribute("aria-hidden", "true");
  }

  element.innerHTML = createCardFaceMarkup(card);
  return element;
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.setAttribute("aria-disabled", state.inputLocked ? "true" : "false");

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const card = state.grid[row][col];
      const cell = document.createElement("div");
      cell.className = "board__cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      if (!card) {
        cell.classList.add("board__cell--empty");
      }

      const slot = document.createElement("div");
      slot.className = "board-slot";
      cell.appendChild(slot);

      if (card) {
        const cardEl = buildCardElement(card, { row, col });
        if (state.selectedCell?.row === row && state.selectedCell?.col === col) {
          cardEl.classList.add("board-card--selected");
        }
        if (state.invalidTarget?.row === row && state.invalidTarget?.col === col) {
          cardEl.classList.add("board-card--invalid");
        }
        cell.appendChild(cardEl);
      }

      boardEl.appendChild(cell);
    }
  }
}

function getBoardCardElement(row, col) {
  return boardEl.querySelector(`.board-card[data-row="${row}"][data-col="${col}"]`);
}

function getBoardCellElement(row, col) {
  return boardEl.querySelector(`.board__cell[data-row="${row}"][data-col="${col}"]`);
}

function clearInvalidTarget(shouldRender = true) {
  if (invalidFeedbackTimerId) {
    window.clearTimeout(invalidFeedbackTimerId);
    invalidFeedbackTimerId = 0;
  }
  if (!state.invalidTarget) {
    return;
  }
  state.invalidTarget = null;
  if (shouldRender) {
    renderBoard();
  }
}

function showInvalidTarget(position, message) {
  clearInvalidTarget(false);
  state.invalidTarget = { ...position };
  setMessage(message);
  renderBoard();

  invalidFeedbackTimerId = window.setTimeout(() => {
    state.invalidTarget = null;
    invalidFeedbackTimerId = 0;
    renderBoard();
  }, INVALID_FEEDBACK_MS);
}

function clearSelection(options = {}) {
  const { preserveMessage = true, shouldRender = true } = options;
  state.selectedCell = null;
  if (shouldRender) {
    renderBoard();
  }
}

function ensureFxLayer() {
  let layer = document.querySelector(".fx-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "fx-layer";
    document.body.appendChild(layer);
  }
  return layer;
}

function positionFloatingCard(element, rect) {
  element.style.left = `${rect.left}px`;
  element.style.top = `${rect.top}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
}

function updateFloatingCardFace(element, card) {
  element.classList.toggle("playing-card--red", card.colorGroup === "red");
  element.classList.toggle("playing-card--black", card.colorGroup === "black");
  element.classList.toggle("playing-card--king", isKing(card));
  element.innerHTML = createCardFaceMarkup(card);
}

function createBurstElement(left, top) {
  const burst = document.createElement("div");
  burst.className = "fx-royal-burst";
  burst.style.left = `${left}px`;
  burst.style.top = `${top}px`;
  return burst;
}

function createSparkleElement(left, top) {
  const sparkle = document.createElement("div");
  sparkle.className = "fx-sparkle";
  sparkle.style.left = `${left}px`;
  sparkle.style.top = `${top}px`;
  return sparkle;
}

async function playSparkles(targetRect) {
  const layer = ensureFxLayer();
  const centerX = targetRect.left + targetRect.width / 2;
  const centerY = targetRect.top + targetRect.height * 0.24;
  const sparkles = [];

  for (let index = 0; index < 5; index += 1) {
    const sparkle = createSparkleElement(centerX, centerY);
    sparkles.push({ element: sparkle, index });
    layer.appendChild(sparkle);
  }

  await Promise.all(
    sparkles.map(({ element, index }) => {
      const angle = ((-65 + index * 32) * Math.PI) / 180;
      const distance = 18 + index * 8;
      return animateElement(
        element,
        [
          { transform: "translate(0px, 0px) scale(0.2)", opacity: 0.15 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
            opacity: 1,
          },
          {
            transform: `translate(${Math.cos(angle) * (distance + 10)}px, ${Math.sin(angle) * (distance + 10) - 4}px) scale(0.1)`,
            opacity: 0,
          },
        ],
        {
          duration: 320,
          easing: "cubic-bezier(.2,.7,.2,1)",
        }
      ).finally(() => element.remove());
    })
  );
}

async function playKingClearAnimation({ sourceFx, targetFx, sourceRect, targetRect }) {
  const layer = ensureFxLayer();
  const centerX = targetRect.left + targetRect.width / 2;
  const centerY = targetRect.top + targetRect.height / 2;
  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const travelX = centerX - sourceCenterX;
  const travelY = centerY - sourceCenterY;
  const burst = createBurstElement(centerX, centerY);

  layer.appendChild(burst);

  await Promise.all([
    animateElement(
      sourceFx,
      [
        { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
        { transform: `translate(${travelX * 0.55}px, ${travelY * 0.55}px) scale(0.35)`, opacity: 0 },
      ],
      {
        duration: 340,
        easing: "cubic-bezier(.2,.8,.2,1)",
      }
    ),
    animateElement(
      targetFx,
      [
        { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
        { transform: "translate(0px, -18px) scale(1.18)", opacity: 0 },
      ],
      {
        duration: 340,
        easing: "cubic-bezier(.2,.8,.2,1)",
      }
    ),
    animateElement(
      burst,
      [
        { transform: "scale(0.4)", opacity: 0.2 },
        { transform: "scale(1.2)", opacity: 1 },
        { transform: "scale(1.7)", opacity: 0 },
      ],
      {
        duration: 420,
        easing: "ease-out",
      }
    ),
    playSparkles(targetRect),
  ]);

  burst.remove();
}

async function playMergeAnimation({ sourcePos, targetPos, sourceCard, targetCard, resultCard, isKingClear }) {
  const sourceEl = getBoardCardElement(sourcePos.row, sourcePos.col);
  const targetEl = getBoardCardElement(targetPos.row, targetPos.col);

  if (!sourceEl || !targetEl) {
    return;
  }

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const layer = ensureFxLayer();
  const sourceFx = buildCardElement(sourceCard, { isFx: true });
  const targetFx = buildCardElement(targetCard, { isFx: true });

  positionFloatingCard(sourceFx, sourceRect);
  positionFloatingCard(targetFx, targetRect);
  layer.append(sourceFx, targetFx);

  sourceEl.classList.add("board-card--ghost");
  targetEl.classList.add("board-card--ghost");

  try {
    if (isKingClear) {
      await playKingClearAnimation({ sourceFx, targetFx, sourceRect, targetRect });
      return;
    }

    const stepValues = getRankTransitionValues(targetCard.rankValue, resultCard.rankValue);
    const travelX = targetRect.left - sourceRect.left;
    const travelY = targetRect.top - sourceRect.top;

    if (resultCard.rankValue === KING_VALUE) {
      targetFx.classList.add("fx-card--kinging");
    }

    await Promise.all([
      animateElement(
        sourceFx,
        [
          { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
          { transform: `translate(${travelX * 0.78}px, ${travelY * 0.78}px) scale(0.35)`, opacity: 0 },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(.2,.8,.2,1)",
        }
      ),
      animateElement(
        targetFx,
        [
          { transform: "translate(0px, 0px) scale(1)" },
          { transform: "translate(0px, -6px) scale(1.02)" },
        ],
        {
          duration: 200,
          easing: "ease-out",
        }
      ),
    ]);

    for (const rankValue of stepValues) {
      updateFloatingCardFace(
        targetFx,
        createCard({
          id: resultCard.id,
          rankValue,
          suit: targetCard.suit,
        })
      );

      await animateElement(
        targetFx,
        [
          { transform: "translate(0px, -6px) scale(1.01)" },
          { transform: "translate(0px, -12px) scale(1.05)" },
          { transform: "translate(0px, -6px) scale(1.01)" },
        ],
        {
          duration: 120,
          easing: "ease-in-out",
        }
      );
    }

    if (resultCard.rankValue === KING_VALUE) {
      await playSparkles(targetRect);
    }

    await animateElement(
      targetFx,
      [
        { transform: "translate(0px, -8px) rotateY(0deg) scale(1.03)" },
        { transform: "translate(0px, -18px) rotateY(180deg) scale(1.08)" },
        { transform: "translate(0px, 0px) rotateY(360deg) scale(1)" },
      ],
      {
        duration: resultCard.rankValue === KING_VALUE ? 520 : 430,
        easing: "cubic-bezier(.22,.75,.28,1)",
      }
    );
  } finally {
    sourceEl.classList.remove("board-card--ghost");
    targetEl.classList.remove("board-card--ghost");
    sourceFx.remove();
    targetFx.remove();
  }
}

async function playDrawAnimation(card, targetPos) {
  const targetCell = getBoardCellElement(targetPos.row, targetPos.col);
  const drawRect = drawButtonEl.getBoundingClientRect();
  const targetRect = targetCell?.getBoundingClientRect();

  if (!targetRect) {
    return;
  }

  const layer = ensureFxLayer();
  const fxCard = buildCardElement(card, { isFx: true });
  const startRect = {
    left: drawRect.left + 10,
    top: drawRect.top + 8,
    width: targetRect.width,
    height: targetRect.height,
  };

  positionFloatingCard(fxCard, startRect);
  layer.appendChild(fxCard);

  try {
    await animateElement(
      fxCard,
      [
        { transform: "translate(0px, 0px) rotate(-9deg) scale(0.78)", opacity: 0.78 },
        {
          transform: `translate(${targetRect.left - startRect.left}px, ${targetRect.top - startRect.top}px) rotate(0deg) scale(1)`,
          opacity: 1,
        },
      ],
      {
        duration: 460,
        easing: "cubic-bezier(.18,.78,.24,1)",
      }
    );
  } finally {
    fxCard.remove();
  }
}

function openEndgame(mode) {
  if (mode === "win") {
    endgameEyebrowEl.textContent = "Victory";
    endgameTitleEl.textContent = "Board Cleared";
    endgameBodyEl.textContent = "You cleared the entire table. Ready for another round?";
    endgameActionButtonEl.textContent = "Play Again";
  } else {
    endgameEyebrowEl.textContent = "Stalemate";
    endgameTitleEl.textContent = "No More Legal Merges";
    endgameBodyEl.textContent = "The draw pile is empty and there are still cards on the board.";
    endgameActionButtonEl.textContent = "Retry";
  }
  endgameOverlayEl.hidden = false;
}

function closeEndgame() {
  endgameOverlayEl.hidden = true;
}

function evaluateGameState(options = {}) {
  const { preserveMessage = false } = options;

  if (isBoardEmpty()) {
    state.gameState = "win";
    openEndgame("win");
    renderHud();
    setMessage("The table is clear. You win.");
    return "win";
  }

  if (state.drawPile.length === 0 && !hasAnyLegalMerge()) {
    state.gameState = "lose";
    openEndgame("lose");
    renderHud();
    setMessage("The draw pile is empty and no legal merges remain.");
    return "lose";
  }

  state.gameState = "playing";
  closeEndgame();
  renderHud();
  return "playing";
}

function cleanupPointerState(pointerState = state.pointerState) {
  if (!pointerState) {
    return;
  }

  pointerState.cardEl?.classList.remove("board-card--dragging");
  if (pointerState.cardEl) {
    pointerState.cardEl.style.transform = "";
  }

  try {
    pointerState.captureEl?.releasePointerCapture(pointerState.pointerId);
  } catch {
    // Ignore release errors once the pointer is already gone.
  }

  if (state.pointerState === pointerState) {
    state.pointerState = null;
  }
}

function getOverlapRatio(rectA, rectB) {
  const left = Math.max(rectA.left, rectB.left);
  const right = Math.min(rectA.right, rectB.right);
  const top = Math.max(rectA.top, rectB.top);
  const bottom = Math.min(rectA.bottom, rectB.bottom);

  if (right <= left || bottom <= top) {
    return 0;
  }

  const intersectionArea = (right - left) * (bottom - top);
  const targetArea = rectB.width * rectB.height;
  return targetArea > 0 ? intersectionArea / targetArea : 0;
}

function getDragTargetFromOverlap(sourceRow, sourceCol, draggedElement) {
  const draggedRect = draggedElement.getBoundingClientRect();
  let bestTarget = null;

  boardEl.querySelectorAll(".board-card").forEach((targetEl) => {
    const row = Number(targetEl.dataset.row);
    const col = Number(targetEl.dataset.col);

    if (row === sourceRow && col === sourceCol) {
      return;
    }

    const overlap = getOverlapRatio(draggedRect, targetEl.getBoundingClientRect());
    if (!bestTarget || overlap > bestTarget.overlap) {
      bestTarget = { row, col, overlap };
    }
  });

  return bestTarget;
}

async function resolveMerge(sourcePos, targetPos) {
  const sourceCard = getCell(sourcePos.row, sourcePos.col);
  const targetCard = getCell(targetPos.row, targetPos.col);

  if (!sourceCard || !targetCard || !canCardsMerge(sourceCard, targetCard)) {
    return false;
  }

  clearInvalidTarget(false);
  state.selectedCell = null;

  const isKingClear = isKing(sourceCard) && isKing(targetCard);
  const resultCard = isKingClear
    ? null
    : createCard({
      id: nextRuntimeCardId("merge"),
      rankValue: getMergeResultRank(sourceCard.rankValue, targetCard.rankValue),
      suit: targetCard.suit,
    });

  state.inputLocked = true;
  renderHud();

  await playMergeAnimation({
    sourcePos,
    targetPos,
    sourceCard,
    targetCard,
    resultCard,
    isKingClear,
  });

  setCell(sourcePos.row, sourcePos.col, null);
  if (isKingClear) {
    setCell(targetPos.row, targetPos.col, null);
  } else {
    setCell(targetPos.row, targetPos.col, resultCard);
  }

  state.inputLocked = false;
  renderBoard();
  renderHud();

  if (isKingClear) {
    setMessage("Royal clear. Both Kings are gone.");
  } else if (resultCard.rankValue === KING_VALUE) {
    setMessage(`A King of ${getSuitName(resultCard.suit)} rises.`);
  } else {
    setMessage(`${formatCard(sourceCard)} merged into ${formatCard(resultCard)}.`);
  }

  evaluateGameState({ preserveMessage: true });
  return true;
}

async function handleDraw() {
  if (state.gameState !== "playing" || state.inputLocked) {
    return;
  }

  if (state.drawPile.length === 0) {
    setMessage("The draw pile is empty.");
    return;
  }

  const emptyCells = getEmptyCells();
  if (emptyCells.length === 0) {
    setMessage("There are no empty slots!");
    return;
  }

  clearInvalidTarget(false);
  state.selectedCell = null;
  renderBoard();
  await nextFrame();

  const activeSuits = getActiveBoardSuits();
  const targetIndex = Math.floor(state.drawPlacementRng() * emptyCells.length);
  const targetPos = emptyCells[targetIndex];
  const card = state.drawPile.shift();

  if (activeSuits.length > 0 && !activeSuits.includes(card.suit)) {
    card.suit = activeSuits[Math.floor(state.drawPlacementRng() * activeSuits.length)];
    card.colorGroup = SUIT_META[card.suit].colorGroup;
  }

  state.inputLocked = true;
  renderHud();

  await playDrawAnimation(card, targetPos);

  setCell(targetPos.row, targetPos.col, card);
  state.inputLocked = false;
  renderBoard();
  renderHud();

  setMessage(`${formatCard(card)} entered the board.`);
  evaluateGameState({ preserveMessage: true });
}

async function handleCardTap(row, col) {
  if (state.gameState !== "playing" || state.inputLocked) {
    return;
  }

  const tappedCard = getCell(row, col);
  const now = performance.now();
  const tappedSameKingTwice =
    isKing(tappedCard) &&
    isSameCell(state.lastKingTap, row, col) &&
    now - state.lastKingTap.time <= KING_DOUBLE_TAP_WINDOW_MS;

  if (tappedSameKingTwice) {
    state.lastKingTap = null;
    clearSelection({ preserveMessage: true, shouldRender: false });
    await clearKingAt(row, col);
    return;
  }

  if (isKing(tappedCard)) {
    state.lastKingTap = { row, col, time: now };
  } else {
    state.lastKingTap = null;
  }

  if (!tappedCard) {
    if (state.selectedCell) {
      clearSelection({ preserveMessage: true, shouldRender: true });
      setMessage("Selection cleared.");
    }
    return;
  }

  clearInvalidTarget(false);

  if (!state.selectedCell) {
    state.selectedCell = { row, col };
    renderBoard();
    setMessage(describeSelectionMessage(tappedCard));
    return;
  }

  if (state.selectedCell.row === row && state.selectedCell.col === col) {
    if (isKing(tappedCard)) {
      setMessage("Tap again quickly to clear this King.");
      return;
    }
    clearSelection({ preserveMessage: true, shouldRender: true });
    setMessage("Selection cleared.");
    return;
  }

  const sourcePos = { ...state.selectedCell };
  const sourceCard = getCell(sourcePos.row, sourcePos.col);

  if (!sourceCard) {
    state.selectedCell = null;
    renderBoard();
    setMessage(buildIdleMessage());
    return;
  }

  if (!canCardsMerge(sourceCard, tappedCard)) {
    state.selectedCell = null;
    showInvalidTarget({ row, col }, "Those cards cannot merge.");
    return;
  }

  await resolveMerge(sourcePos, { row, col });
}

async function handleDragRelease(pointerState, dragTarget) {
  state.selectedCell = null;

  if (!dragTarget || dragTarget.overlap < SNAP_OVERLAP_THRESHOLD) {
    renderBoard();
    setMessage(buildIdleMessage());
    return;
  }

  const sourcePos = { row: pointerState.row, col: pointerState.col };
  const targetPos = { row: dragTarget.row, col: dragTarget.col };
  const sourceCard = getCell(sourcePos.row, sourcePos.col);
  const targetCard = getCell(targetPos.row, targetPos.col);

  if (!sourceCard || !targetCard) {
    renderBoard();
    setMessage(buildIdleMessage());
    return;
  }

  if (!canCardsMerge(sourceCard, targetCard)) {
    showInvalidTarget(targetPos, "Those cards cannot merge.");
    return;
  }

  await resolveMerge(sourcePos, targetPos);
}

function handleBoardPointerDown(event) {
  if (state.gameState !== "playing" || state.inputLocked) {
    return;
  }

  const cellEl = event.target.closest(".board__cell");
  if (!cellEl || !boardEl.contains(cellEl)) {
    return;
  }

  const cardEl = event.target.closest(".board-card");
  if (!cardEl) {
    if (state.selectedCell) {
      clearSelection({ preserveMessage: true, shouldRender: true });
      setMessage("Selection cleared.");
    }
    return;
  }

  const row = Number(cardEl.dataset.row);
  const col = Number(cardEl.dataset.col);
  if (Number.isNaN(row) || Number.isNaN(col)) {
    return;
  }

  clearInvalidTarget(false);
  event.preventDefault();

  state.pointerState = {
    pointerId: event.pointerId,
    row,
    col,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    cardEl,
    captureEl: cardEl,
  };

  try {
    cardEl.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture can fail on some devices; the drag still works.
  }
}

function handleBoardPointerMove(event) {
  if (!state.pointerState || state.pointerState.pointerId !== event.pointerId || state.inputLocked) {
    return;
  }

  const pointerState = state.pointerState;
  const deltaX = event.clientX - pointerState.startX;
  const deltaY = event.clientY - pointerState.startY;
  const distance = Math.hypot(deltaX, deltaY);

  if (!pointerState.dragging && distance < DRAG_START_THRESHOLD) {
    return;
  }

  if (!pointerState.dragging) {
    pointerState.dragging = true;
    pointerState.cardEl.classList.add("board-card--dragging");
  }

  const tilt = Math.max(-7, Math.min(7, deltaX * 0.06));
  pointerState.cardEl.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${tilt}deg) scale(1.05)`;
}

async function handleBoardPointerUp(event) {
  if (!state.pointerState || state.pointerState.pointerId !== event.pointerId) {
    return;
  }

  const pointerState = state.pointerState;
  const dragTarget = pointerState.dragging
    ? getDragTargetFromOverlap(pointerState.row, pointerState.col, pointerState.cardEl)
    : null;

  cleanupPointerState(pointerState);

  if (pointerState.dragging) {
    await handleDragRelease(pointerState, dragTarget);
    return;
  }

  await handleCardTap(pointerState.row, pointerState.col);
}

function handleBoardPointerCancel() {
  cleanupPointerState();
}

function handleDocumentPointerDown(event) {
  if (
    state.gameState !== "playing" ||
    state.inputLocked ||
    !state.selectedCell ||
    state.pointerState ||
    event.target.closest(".board")
  ) {
    return;
  }

  clearSelection({ preserveMessage: true, shouldRender: true });
  setMessage("Selection cleared.");
}

function handleEndgameAction() {
  if (state.gameState === "win") {
    startNextGame();
    return;
  }
  if (state.gameState === "lose") {
    restartCurrentLevel();
  }
}

boardEl.addEventListener("pointerdown", handleBoardPointerDown);
boardEl.addEventListener("pointermove", handleBoardPointerMove);
boardEl.addEventListener("pointerup", handleBoardPointerUp);
boardEl.addEventListener("pointercancel", handleBoardPointerCancel);

document.addEventListener("pointerdown", handleDocumentPointerDown);
drawButtonEl.addEventListener("click", handleDraw);
restartButtonEl.addEventListener("click", restartCurrentLevel);
endgameActionButtonEl.addEventListener("click", handleEndgameAction);

window.addEventListener("blur", handleBoardPointerCancel);
window.addEventListener("resize", handleBoardPointerCancel);

startGame(createRandomSeed());
