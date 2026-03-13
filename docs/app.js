const GRID_SIZE = 7;
const INITIAL_ROWS = 3;
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const ASSET_MODE = "text";

const SUIT_SVGS = {
  "♠": (color) => `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="${color}" d="M68.4184 78.3851C76.0354 78.0722 83.1066 73.9177 87.0458 67.3777C93.8373 56.104 90.1238 44.824 82.8949 38.1044L53.3699 9.82519C51.705 8.29785 49.1525 8.29785 47.4875 9.82519L17.533 38.1044C10.5051 44.6366 7.50581 55.483 13.3774 66.4407C17.1046 73.3974 24.1945 78.0847 32.0681 78.3883C37.1961 78.585 42.3046 76.8686 45.2744 74.0912C46.0551 73.36 45.9055 74.9277 45.9055 80.2439C45.9055 83.788 43.731 87.0411 39.382 90.003C38.7947 91.0362 39.5383 92.3203 40.7255 92.3203L60.132 92.3203C61.3194 92.3203 62.0644 91.0362 61.4754 90.003C57.0808 86.1139 54.8835 82.8608 54.8835 80.2439C54.8835 76.3185 54.7839 73.3507 55.5368 74.0788C58.4247 76.8748 63.2456 78.5988 68.4184 78.3851Z"/>
    </svg>
  `,
  "♥": (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="${color}" d="M32 58C16 44 6 34 6 22 6 14 12 8 20 8c6 0 10 3 12 7 2-4 6-7 12-7 8 0 14 6 14 14 0 12-10 22-26 36z"/>
    </svg>
  `,
  "♦": (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="${color}" d="M32 4l20 28-20 28L12 32 32 4z"/>
    </svg>
  `,
  "♣": (color) => `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="${color}" d="M76.6132 41.2938C72.3168 39.2675 68.3043 39.219 64.6552 40.1174C67.628 36.5443 69.3396 31.8551 69.0717 26.7525C68.5619 17.0285 60.5948 9.06609 51.013 8.694C40.2801 8.27787 31.4498 16.9887 31.4498 27.795C31.4498 32.493 33.1253 36.7882 35.8939 40.1172C32.2448 39.2188 28.2323 39.2673 23.9359 41.2936C17.3226 44.4139 12.7207 51.0176 12.6266 58.4213C12.492 69.0953 20.9703 77.7899 31.4498 77.7899C36.5137 77.7899 41.0996 75.7504 44.4823 72.4479V78.0797C44.4823 80.7809 43.7886 83.435 42.468 85.7803L39.9281 90.2946C39.3765 91.2753 40.0744 92.4944 41.1851 92.4944H59.364C60.4762 92.4944 61.1726 91.2755 60.6209 90.2946L58.0811 85.7803C56.7619 83.435 56.0668 80.7809 56.0668 78.0797V72.4479C59.4509 75.7505 64.0368 77.7899 69.0992 77.7899C79.5788 77.7899 88.0585 69.0953 87.9225 58.4213C87.8283 51.0176 83.2263 44.4139 76.6132 41.2938Z"/>
    </svg>
  `,
};

const SWAP_ICON_SVG = `
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M78.9102 44.3131L79.0127 44.5778C81.6134 45.3518 83.5008 47.751 83.501 50.6139V50.6149L83.498 60.4059C83.4976 69.298 76.2148 76.5807 67.3223 76.5807H37.7891L42.418 81.1676L42.4482 81.1979L42.4775 81.2291C44.7815 83.6748 44.8691 87.6638 42.3438 90.11L42.3447 90.111C42.3381 90.1177 42.3309 90.1238 42.3242 90.1305C42.3133 90.141 42.303 90.1523 42.292 90.1627L42.291 90.1617C41.0083 91.4193 39.3497 91.944 37.873 91.944C36.2583 91.9439 34.6757 91.3853 33.4053 90.1149L33.3984 90.1071L33.3916 90.1002L18.2793 74.736C15.7238 72.2477 15.9646 68.2264 18.2939 65.8971L33.4053 50.7848L33.4072 50.7828C35.8254 48.3698 39.604 48.2919 42.1064 50.5582L42.3447 50.7848L42.3467 50.7867C44.8372 53.2828 44.8398 57.2279 42.3447 59.7233L38.084 63.983L67.3223 63.986C69.3193 63.9858 70.9002 62.4034 70.9004 60.4078V50.6129C70.9005 47.1186 73.713 44.3131 77.2012 44.3131H78.9102ZM29.0537 49.2614C29.0536 52.7557 26.2411 55.5612 22.7529 55.5612C19.2587 55.561 16.4532 52.7494 16.4531 49.2614V39.5524C16.4531 30.6603 23.7325 23.3766 32.6289 23.3766H62.1172L57.6045 18.8639C55.1137 16.3678 55.1111 12.4228 57.6064 9.92737L57.6084 9.92542C60.0266 7.51241 63.8042 7.43451 66.3066 9.70081L66.5449 9.92737L81.7393 25.1246L81.96 25.3571C84.1713 27.806 84.0371 31.5504 81.7871 33.9283L81.7539 33.9635L66.6416 49.3278L66.6357 49.3326L66.6309 49.3385C65.36 50.6147 63.7707 51.1715 62.1592 51.1715C60.5444 51.1715 58.9619 50.6128 57.6914 49.3424C55.2032 46.8543 55.2008 42.9445 57.5586 40.4528L57.5977 40.4117L61.9932 35.9733H32.6289C30.6316 35.9733 29.0498 37.5565 29.0498 39.5524L29.0537 49.2604V49.2614Z" fill="currentColor" stroke="white" stroke-width="5"/>
  </svg>
`;

const BOMB_ICON_SVG = `
  <svg width="78" height="100" viewBox="0 0 78 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M58.4882 4.23208C63.1097 3.04684 67.7419 5.16911 68.9708 9.97139C69.6602 12.9823 70.4096 16.6422 70.1817 20.5531C70.0781 22.3296 69.3528 26.3952 68.8496 28.1109C72.7527 31.99 75.2756 34.6353 75.2756 40.5747C74.4903 43.0359 71.8451 45.3773 70.1817 46.7495C72.2783 51.7522 73.9259 57.8486 73.7116 63.2159C73.7107 63.2362 73.7105 63.2565 73.7095 63.2768C73.302 71.4014 70.1145 79.0189 64.9448 85.0938C64.9311 85.11 64.917 85.1267 64.9031 85.1427C59.3835 91.4912 51.8762 95.5603 43.7723 97.0314C43.7495 97.0355 43.7267 97.0399 43.7039 97.0438C35.4159 98.4486 27.0205 96.8373 19.8225 92.8245C19.8037 92.814 19.7853 92.803 19.7667 92.7924C12.4707 88.6214 7.00053 82.0521 3.98209 74.3823L3.9588 74.3224C0.985163 66.5226 0.808445 57.9333 3.45728 50.0182C6.10651 42.1029 11.4191 35.3498 18.489 30.9113C23.1165 28.0531 28.6461 27.7958 33.8922 27.0387C35.031 24.6106 36.293 22.1688 38.1774 20.2266C41.8248 16.4675 47.3508 16.3513 52.2102 17.2939C51.1312 11.8343 52.2885 5.98715 58.4882 4.23208Z" fill="white"/>
    <circle cx="37.3086" cy="62.6914" r="25.043" fill="#6D7883"/>
    <path d="M66.4901 40.4203C63.6602 45.3218 55.176 47.9633 49.0459 44.424C42.9157 40.8848 40.3254 40.7008 43.4289 29.8862C44.2532 23.5453 47.7366 22.0421 58.4902 28.2507C64.6203 31.7899 69.3199 35.5188 66.4901 40.4203Z" fill="#FFB751"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M57.2013 13.9587C56.7701 12.0747 57.9472 10.1972 59.8312 9.76567C61.7153 9.33431 63.5932 10.5123 64.0247 12.3963C64.7032 15.3595 65.2692 18.2976 65.0949 21.289C64.9499 23.7766 64.303 26.1721 63.0127 28.6435C66.2804 31.011 69.4386 34.2307 70.6634 37.803C71.2868 39.6212 65.0949 43.6627 63.0127 46.3417C67.6709 52.1291 67.9346 57.4205 67.7127 62.9763C67.3747 69.7138 64.7289 76.0847 60.3711 81.2056C55.7953 86.4686 49.5336 89.8869 42.6967 91.1279C35.8244 92.2928 28.8075 90.966 22.7401 87.5835C16.6893 84.1244 12.1052 78.6488 9.56141 72.1851C7.08231 65.6826 6.93514 58.5217 9.14366 51.9224C11.3524 45.3229 15.7808 39.6927 21.6749 35.9924C26.1363 33.1915 35.1329 31.4049 40.3904 32.6372C42.2894 28.0048 42.3227 23.1614 44.3643 22.8474C48.4073 22.2257 52.3644 23.0102 56.9434 25.1428C57.7097 23.5984 58.0284 22.2346 58.1073 20.8815C58.2189 18.9659 57.8685 16.8725 57.2013 13.9587ZM33.5026 38.7677C30.6461 39.292 27.8923 40.3541 25.3965 41.9209C20.8742 44.7602 17.4758 49.0798 15.7811 54.1435C14.0864 59.2072 14.2008 64.702 16.1031 69.6915C18.0055 74.6808 21.5784 78.8569 26.2142 81.507C30.8501 84.1572 36.2624 85.1178 41.5273 84.2254C46.7919 83.3329 51.584 80.6425 55.0876 76.6129C58.5912 72.583 60.5886 67.4625 60.7404 62.1247C60.8242 59.1792 60.1396 55.6595 59.4299 53.4693C58.7202 51.2791 58.1073 50.2357 57.2013 48.8882C55.2762 49.7178 51.0452 48.4428 47.0821 46.3417C43.119 44.2405 40.48 40.5202 39.8993 38.7677C36.716 37.6476 33.5176 38.7642 33.5026 38.7677ZM43.376 35.7795C44.3385 38.3021 46.5002 41.6212 48.7458 42.9267C51.1031 44.2972 54.1545 45.0523 58.1073 45.4589L64.0247 40.69C60.7135 40.69 55.9818 39.9524 52.3273 37.803C48.6729 35.6536 46.5226 31.9875 44.9597 29.1946L43.376 35.7795ZM47.6654 26.4027C48.3722 27.9406 49.477 31.8787 54.4093 34.7796C59.3416 37.6806 63.0127 37.0778 65.6611 37.0778C63.6972 33.3975 62.4719 32.8584 61.4917 32.1232C60.608 33.0993 58.9034 33.8147 56.9434 33.103C54.5349 32.2285 53.8059 29.9125 54.4093 28.6435C52.8659 27.6633 52.0858 26.5894 47.6654 26.4027Z" fill="#2F3F4C"/>
    <path d="M27.2092 50.2681C23.7059 52.6729 21.911 57.6001 23.1328 62.6916" stroke="white" stroke-width="6" stroke-linecap="round"/>
    <path d="M27.2109 71.5435C27.623 72.0719 28.4791 73.2475 29.0956 73.7022" stroke="white" stroke-width="6" stroke-linecap="round"/>
  </svg>
`;

const JOKER_HAT_SVG = `
  <svg viewBox="0 0 110 110" aria-hidden="true">
    <circle cx="89.3281" cy="60.0117" r="6" fill="white" stroke="black"/>
    <path d="M25.8302 71.5115C26.2302 69.1115 27.3302 67.8448 27.8302 67.5115C61.8323 57.5115 84.2308 72.3095 78.8281 77.5115C70 86.0116 59.8281 87.5115 46.3281 86.0115C35.5281 84.8115 28.1629 79.8448 25.8302 77.5115C25.6636 76.5115 25.4302 73.9115 25.8302 71.5115Z" fill="#FAFAFA" stroke="black"/>
    <path d="M43.3263 20.5118C49.1596 14.0118 62.4263 0.911832 68.8263 0.511832C76.8263 0.0118318 92.8262 15.5118 96.3262 18.0118C99.8262 20.5118 92.8262 30.5117 91.8262 38.5117C91.0262 44.9117 90.8262 50.5117 90.8262 52.5117L87.3262 54.0117C87.1596 48.0117 86.1262 35.6117 83.3262 34.0117C83.3165 34.0061 83.3068 34.0006 83.2972 33.9949C81.4103 43.5268 79.4023 61.1801 78.824 71.0117C78.5002 76.5169 62.119 83.2777 56 79.5117C43.2235 71.6483 36.5646 41.135 43.3263 20.5118Z" fill="#333333"/>
    <path d="M43.3263 20.5118C49.1596 14.0118 62.4263 0.911832 68.8263 0.511832C76.8263 0.0118318 92.8262 15.5118 96.3262 18.0118C99.8262 20.5118 92.8262 30.5117 91.8262 38.5117C91.0262 44.9117 90.8262 50.5117 90.8262 52.5117L87.3262 54.0117C87.1596 48.0117 86.1262 35.6117 83.3262 34.0117C80.5262 32.4117 83.4929 29.0117 85.3262 27.5117C83.1596 28.8451 79.624 57.4117 78.824 71.0117C78.5002 76.5169 62.119 83.2777 56 79.5117C43.2235 71.6483 36.5646 41.135 43.3263 20.5118Z" stroke="black"/>
    <path d="M0.825625 43.5118C4.02562 49.1118 11.4923 71.1785 14.8256 81.5118L16 86.0117C17.3333 86.3451 22.623 81.2118 19.823 72.0118C16.323 60.5118 14.8256 49.5118 23.323 49.0118C30.121 48.6118 28.8222 64.1785 27.323 72.0118C31.323 75.5118 35.8256 80.0118 41.323 80.0118C55.823 81.5118 60.5 43.5118 55.823 39.0118C52.4049 35.723 45.8281 11.0117 36.3275 9.51181C30.8948 8.65413 -3.17438 36.5118 0.825625 43.5118Z" fill="#808080" stroke="black"/>
    <path d="M56.3281 39.5118C43.1281 43.1118 42.1719 68.5117 39.5 80.5117C53.4997 83.7118 65.321 81.3451 68.5677 79.5117V69.0117C71.2971 70.9129 73.7339 72.7603 74.8285 74.5117C77.3285 78.5117 69.8285 96.5117 69.8285 100.012C69.8285 103.512 68.5677 103.012 69.8285 104.512C74.7335 101.288 77.088 94.5117 83 90.5117C88.912 86.5117 91.8285 71.0789 91.8285 64.5117C91.8285 55.7117 82.8285 43.1784 78.3285 38.0118C76.4951 37.0118 69.5281 35.9118 56.3281 39.5118Z" fill="#B3B3B3"/>
    <path d="M51.3285 59.0117C52.4952 58.3451 55.6285 57.9117 58.8285 61.5117C61.0771 64.0413 65.0636 66.5709 68.5677 69.0117M68.5677 69.0117C71.2971 70.9129 73.7339 72.7603 74.8285 74.5117C77.3285 78.5117 69.8285 96.5117 69.8285 100.012C69.8285 103.512 68.5677 103.012 69.8285 104.512C74.7335 101.288 77.088 94.5117 83 90.5117C88.912 86.5117 91.8285 71.0789 91.8285 64.5117C91.8285 55.7117 82.8285 43.1784 78.3285 38.0118C76.4951 37.0118 69.5281 35.9118 56.3281 39.5118C43.1281 43.1118 42.1719 68.5117 39.5 80.5117C53.4997 83.7118 65.321 81.3451 68.5677 79.5117V69.0117Z" stroke="black"/>
    <circle cx="16.3281" cy="88.0117" r="6" fill="white" stroke="black"/>
    <circle cx="68" cy="107.012" r="6" fill="white" stroke="black"/>
  </svg>
`;

const INITIAL_STATE = {
  grid: [],
  deck: [],
  freeSwapCount: 3,
  freeBombCount: 3,
  score: 0,
  baseFactor: 10,
  chainMultiplier: 1,
  activeSelection: null,
  sequenceSelection: [],
  sequenceValid: false,
  sequenceDirection: null,
  swapMode: false,
  bombMode: false,
  bombTarget: null,
  pendingSwap: null,
  swapperActive: false,
  swapperSource: null,
  gameOver: false,
  dragState: null,
  lastTap: null,
  doubleTapState: null,
  dragSelecting: false,
  longPressTimer: null,
  dragStartCard: null,
  animateMoves: false,
};

const state = {
  ...INITIAL_STATE,
  grid: [],
  deck: [],
  sequenceSelection: [],
};

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("scoreValue");
const swapCountEl = document.getElementById("freeSwapCount");
const bombCountEl = document.getElementById("freeBombCount");
const statusEl = document.getElementById("statusMessage");
const clearSequenceButton = document.getElementById("clearSequenceButton");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const freeSwapButton = document.getElementById("freeSwapButton");
const freeBombButton = document.getElementById("freeBombButton");
const freeSwapButtonIconEl = freeSwapButton?.querySelector(".hud__icon");
const freeBombButtonIconEl = freeBombButton?.querySelector(".hud__icon");
const menuBtn = document.getElementById("menuBtn");
const gameMenuModal = document.getElementById("gameMenuModal");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const gameOverOverlayEl = document.getElementById("gameOverOverlay");
const playAgainButtonEl = document.getElementById("playAgainButton");

function isInputLocked() {
  return state.gameOver || !gameOverOverlayEl?.hidden;
}

function isDebugGameOverEnabled() {
  return typeof window !== "undefined" && window.__DEBUG_GAMEOVER;
}

function debugGameOverLog(message, payload = {}) {
  if (!isDebugGameOverEnabled()) {
    return;
  }
  console.log(`[gameover-debug] ${message}`, payload);
}

function isDebugUndoEnabled() {
  return typeof window !== "undefined" && window.__DEBUG_UNDO;
}

function debugUndoLog(message, payload = {}) {
  if (!isDebugUndoEnabled()) {
    return;
  }
  console.log(`[undo-debug] ${message}`, payload);
}

function debugScoreAnimLog(message, payload = {}) {
  if (!DEBUG_SCORE_ANIM) {
    return;
  }
  console.log(`[SCORE_ANIM] ${message}`, payload);
}

function triggerScoreAnimation(source, payload) {
  debugScoreAnimLog(`called from ${source}`, { stack: new Error().stack });
  return playScoreAnimation(payload);
}

let scoreAnimationActive = false;
let scoreAnimInFlight = false;
let scoreAnimRunId = 0;
let bombExplosionActive = false;
const DEBUG_NEW_CARD_ENTER = false;
const DEBUG_SCORE_ANIM = true;
const MAX_HISTORY = 50;
const undoStack = [];
const redoStack = [];
let isApplyingHistorySnapshot = false;
let previousRenderCardIds = new Set();
let hasRenderedBoard = false;
const SWIPE_THRESHOLD_RATIO = 0.35;
const LONG_PRESS_MS = 210;
const LONG_PRESS_MOVE_TOLERANCE_TOUCH = 10;
const LONG_PRESS_MOVE_TOLERANCE_MOUSE = 4;


// Snapshot-based undo/redo (Memento): each action stores a full game-state checkpoint.
function cloneSnapshot(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function buildSerializableStateSnapshot() {
  return {
    ...state,
    // Runtime-only values can contain non-serializable DOM references during drag operations.
    dragState: null,
    longPressTimer: null,
    dragStartCard: null,
  };
}

function getCardIdsFromGrid(grid) {
  const ids = new Set();
  grid.forEach((row) => {
    row.forEach((card) => {
      if (card?.id) {
        ids.add(card.id);
      }
    });
  });
  return ids;
}

function getCardElementMap() {
  const map = new Map();
  boardEl.querySelectorAll(".card[data-card-id]").forEach((cardEl) => {
    map.set(cardEl.dataset.cardId, cardEl);
  });
  return map;
}

function animateUndoRemovedCards({ cardSnapshots = [], reason = "" }) {
  if (!cardSnapshots.length) {
    return Promise.resolve();
  }
  const layer = document.createElement("div");
  layer.className = "fx-layer";
  layer.style.pointerEvents = "none";
  document.body.appendChild(layer);
  const isBombUndo = reason.includes("bomb");

  const animations = cardSnapshots.map((snapshot) => {
    const { rect, clone } = snapshot;
    const ghost = clone;
    ghost.style.position = "fixed";
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.margin = "0";
    ghost.style.zIndex = "1700";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "1";
    ghost.style.transform = "translate(0px, 0px) scale(1)";
    ghost.style.filter = "none";
    ghost.style.transition = "none";
    layer.appendChild(ghost);

    const keyframes = isBombUndo
      ? [
        { opacity: 1, transform: "translate(0px, 0px) scale(1)", filter: "brightness(1)" },
        { opacity: 0, transform: "translate(0px, -18px) scale(1.3)", filter: "brightness(2.1) blur(1.5px)" },
      ]
      : [
        { opacity: 1, transform: "translate(0px, 0px)", filter: "none" },
        { opacity: 0, transform: `translate(0px, ${-Math.max(34, rect.height * 0.9)}px)`, filter: "none" },
      ];

    return animateElement(ghost, keyframes, {
      duration: isBombUndo ? 360 : 320,
      easing: isBombUndo ? "cubic-bezier(.2,.7,.3,1)" : "ease-in",
      fill: "forwards",
    }).finally(() => {
      ghost.remove();
    });
  });

  return Promise.all(animations).finally(() => {
    layer.remove();
  });
}

function animateHistoryCardEntry(newCardEls = [], historyTransition = null, reason = "") {
  if (!newCardEls.length) {
    return Promise.resolve();
  }
  const isUndo = historyTransition === "undo";
  const isBombUndo = isUndo && reason.includes("bomb");
  const keyframes = isBombUndo
    ? [
      { opacity: 0, transform: "scale(0.18)", filter: "brightness(1.9) blur(1.5px)" },
      { opacity: 1, transform: "scale(1)", filter: "brightness(1) blur(0px)" },
    ]
    : [
      { opacity: 0, transform: isUndo ? "scale(0.84)" : "scale(0.92)" },
      { opacity: 1, transform: "scale(1)" },
    ];

  const animations = newCardEls.map((cardEl) => {
    cardEl.classList.remove("card--pre-enter");
    cardEl.style.opacity = "0";
    return animateElement(cardEl, keyframes, {
      duration: isBombUndo ? 420 : 260,
      easing: isBombUndo ? "cubic-bezier(.2,.9,.22,1)" : "ease-out",
      fill: "forwards",
    }).finally(() => {
      cardEl.style.removeProperty("opacity");
      cardEl.style.removeProperty("transform");
      cardEl.style.removeProperty("filter");
    });
  });

  return Promise.all(animations);
}

function animateUndoCardsEnterReverseFall(newCardEls = []) {
  if (!newCardEls.length) {
    return Promise.resolve();
  }

  newCardEls.forEach((cardEl) => {
    const nextRect = cardEl.getBoundingClientRect();
    const travel = Math.max(nextRect.height + 24, 40);
    cardEl.classList.remove("card--pre-enter");
    cardEl.style.opacity = "0";
    cardEl.style.transform = `translate(0px, ${travel}px)`;
  });

  return new Promise((resolveAll) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const animations = newCardEls.map((cardEl) => new Promise((resolve) => {
          cardEl.classList.add("card--entering");
          cardEl.style.transform = "";
          cardEl.style.opacity = "1";
          let settled = false;
          const cleanup = () => {
            if (settled) {
              return;
            }
            settled = true;
            cardEl.classList.remove("card--entering");
            cardEl.classList.remove("card--pre-enter");
            cardEl.style.removeProperty("transform");
            cardEl.style.removeProperty("opacity");
            resolve();
          };
          cardEl.addEventListener("transitionend", cleanup, { once: true });
          window.setTimeout(cleanup, 620);
        }));
        Promise.all(animations).then(resolveAll);
      });
    });
  });
}

function exportSnapshot() {
  return {
    state: cloneSnapshot(buildSerializableStateSnapshot()),
    statusMessage: statusEl?.textContent || "",
    gameOverOverlayHidden: gameOverOverlayEl?.hidden ?? true,
    menuOpen: !(gameMenuModal?.hidden ?? true),
  };
}

function importSnapshot(snapshot, options = {}) {
  if (!snapshot || !snapshot.state) {
    return Promise.resolve();
  }
  const { historyTransition = null, historyReason = "" } = options;
  const previousScore = state.score;
  const previousRects = historyTransition ? getCardRects() : null;
  const previousCardElsById = historyTransition ? getCardElementMap() : null;
  const targetCardIds = historyTransition ? getCardIdsFromGrid(snapshot.state.grid || []) : null;

  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, cloneSnapshot(snapshot.state));
  clearLongPressTimer();
  state.longPressTimer = null;
  state.dragSelecting = false;
  state.dragState = null;
  boardEl.classList.remove("board--drag-selecting");
  boardEl.style.touchAction = "";
  statusEl.textContent = snapshot.statusMessage || "Tap adjacent cards to swap. Tap again to deselect.";
  setMenuOpen(Boolean(snapshot.menuOpen));
  if (gameOverOverlayEl) {
    gameOverOverlayEl.hidden = snapshot.gameOverOverlayHidden ?? !state.gameOver;
  }
  if (!state.gameOver) {
    hideGameOverOverlay();
  }
  updateHud();

  const removedCardEls = historyTransition && previousCardElsById && targetCardIds
    ? [...previousCardElsById.entries()]
      .filter(([cardId]) => !targetCardIds.has(cardId))
      .map(([, el]) => el)
    : [];

  const removedCardSnapshots = removedCardEls.map((cardEl) => {
    const rect = cardEl.getBoundingClientRect();
    const clone = cardEl.cloneNode(true);
    clone.classList.remove("card--animating", "card--entering", "card--pre-enter");
    return { rect, clone };
  });

  const redoBombExplosionRect =
    historyTransition === "redo" && historyReason.includes("bomb") && removedCardSnapshots.length
      ? removedCardSnapshots[0].rect
      : null;

  const renderHistoryBoard = () => renderBoard({
    prevRectsOverride: previousRects,
    historyTransition,
    historyReason,
  });

  const redoBombPrelude = redoBombExplosionRect
    ? playBombExplosion({
      centerRect: redoBombExplosionRect,
      affectedCardEls: removedCardEls,
    })
    : Promise.resolve();

  return Promise.resolve(redoBombPrelude)
    .then(() => {
      const renderPromise = renderHistoryBoard();
      if (historyTransition === "undo") {
        return Promise.all([
          renderPromise,
          animateUndoRemovedCards({ cardSnapshots: removedCardSnapshots, reason: historyReason }),
        ]);
      }
      return renderPromise;
    })
    .then(() => {
      if (
        historyTransition === "redo" &&
        historyReason === "sequence-clear" &&
        state.score > previousScore
      ) {
        return animateScoreCountUp(previousScore, state.score, scoreEl);
      }
      return undefined;
    });
}

function updateHistoryButtons() {
  if (undoButton) {
    undoButton.disabled = undoStack.length === 0;
  }
  if (redoButton) {
    redoButton.disabled = redoStack.length === 0;
  }
}

function pushUndoCheckpoint(reason = "action") {
  if (isApplyingHistorySnapshot) {
    return;
  }
  undoStack.push({ snapshot: cloneSnapshot(exportSnapshot()), reason });
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }
  redoStack.length = 0;
  debugUndoLog("checkpoint pushed", { reason, undo: undoStack.length, redo: redoStack.length });
  updateHistoryButtons();
}

function cancelAnimationsAndUnlockInput() {
  clearLongPressTimer();
  state.dragState = null;
  state.dragSelecting = false;
  state.doubleTapState = null;
  state.animateMoves = false;
  scoreAnimInFlight = false;
  scoreAnimationActive = false;
  bombExplosionActive = false;
  boardEl.classList.remove("board--drag-selecting");
  boardEl.style.touchAction = "";
  document.querySelectorAll(".fx-layer, .fx-particles, .score-overlay").forEach((node) => node.remove());
  if (typeof document.getAnimations === "function") {
    document.getAnimations().forEach((animation) => animation.cancel());
  }
}

async function undo() {
  if (!undoStack.length) {
    return;
  }
  cancelAnimationsAndUnlockInput();
  const entry = undoStack.pop();
  redoStack.push({ snapshot: cloneSnapshot(exportSnapshot()), reason: entry.reason });
  isApplyingHistorySnapshot = true;
  await importSnapshot(entry.snapshot, {
    historyTransition: "undo",
    historyReason: entry.reason || "",
  });
  isApplyingHistorySnapshot = false;
  debugUndoLog("undo", { undo: undoStack.length, redo: redoStack.length });
  updateHistoryButtons();
}

async function redo() {
  if (!redoStack.length) {
    return;
  }
  cancelAnimationsAndUnlockInput();
  const entry = redoStack.pop();
  undoStack.push({ snapshot: cloneSnapshot(exportSnapshot()), reason: entry.reason });
  isApplyingHistorySnapshot = true;
  await importSnapshot(entry.snapshot, {
    historyTransition: "redo",
    historyReason: entry.reason || "",
  });
  isApplyingHistorySnapshot = false;
  debugUndoLog("redo", { undo: undoStack.length, redo: redoStack.length });
  updateHistoryButtons();
}

function animateElement(element, keyframes, options) {
  if (element.animate) {
    const animation = element.animate(keyframes, options);
    return animation.finished.catch(() => undefined);
  }
  return new Promise((resolve) => {
    const duration = Number(options?.duration ?? 0);
    const easing = options?.easing ?? "ease";
    const fill = options?.fill ?? "forwards";
    const delay = Number(options?.delay ?? 0);
    const finalFrame = keyframes[keyframes.length - 1] || {};
    element.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        Object.entries(finalFrame).forEach(([prop, value]) => {
          element.style[prop] = value;
        });
      }, Math.max(0, delay));
    });
    window.setTimeout(() => {
      if (fill !== "forwards") {
        element.style.transition = "";
      }
      resolve();
    }, duration + Math.max(0, delay));
  });
}


function createParticleCanvasExplosion(x, y) {
  const canvas = document.createElement("canvas");
  canvas.className = "fx-particles";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    return { canvas, done: Promise.resolve() };
  }

  const particleCount = 28;
  const particles = Array.from({ length: particleCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1 + Math.random() * 2.5,
      life: 250 + Math.random() * 250,
    };
  });

  let rafId = null;
  let settled = false;
  const resolveDone = [];
  const done = new Promise((resolve) => resolveDone.push(resolve));

  const start = performance.now();
  function step(now) {
    const delta = now - start;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach((particle) => {
      const progress = Math.max(0, 1 - delta / particle.life);
      if (progress <= 0) {
        return;
      }
      activeCount += 1;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98;
      particle.vy = particle.vy * 0.98 + 0.04;
      context.fillStyle = `rgba(255, 245, 210, ${progress})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * progress + 0.4, 0, Math.PI * 2);
      context.fill();
    });

    if (activeCount > 0) {
      rafId = window.requestAnimationFrame(step);
      return;
    }

    if (!settled) {
      settled = true;
      resolveDone.forEach((resolve) => resolve());
    }
  }

  rafId = window.requestAnimationFrame(step);

  return {
    canvas,
    done,
    cleanup: () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (!settled) {
        settled = true;
        resolveDone.forEach((resolve) => resolve());
      }
    },
  };
}

async function playBombExplosion({ centerRect, affectedCardEls = [] }) {
  if (!centerRect) {
    return;
  }

  const centerX = centerRect.left + centerRect.width / 2;
  const centerY = centerRect.top + centerRect.height / 2;

  const layer = document.createElement("div");
  layer.className = "fx-layer";

  const flash = document.createElement("div");
  flash.className = "bomb-flash";

  const ringPrimary = document.createElement("div");
  ringPrimary.className = "bomb-ring";
  ringPrimary.style.left = `${centerX}px`;
  ringPrimary.style.top = `${centerY}px`;

  const ringSecondary = document.createElement("div");
  ringSecondary.className = "bomb-ring bomb-ring--secondary";
  ringSecondary.style.left = `${centerX}px`;
  ringSecondary.style.top = `${centerY}px`;

  const impact = document.createElement("div");
  impact.className = "bomb-impact";
  impact.style.left = `${centerX}px`;
  impact.style.top = `${centerY}px`;

  const particleFx = createParticleCanvasExplosion(centerX, centerY);
  layer.append(flash, impact, ringPrimary, ringSecondary, particleFx.canvas);
  document.body.append(layer);

  const animations = [
    animateElement(
      flash,
      [
        { opacity: 0 },
        { opacity: 0.1, offset: 0.35 },
        { opacity: 0 },
      ],
      { duration: 120, easing: "ease-out", fill: "forwards" }
    ),
    animateElement(
      impact,
      [
        { transform: "translate(-50%, -50%) scale(0.25)", opacity: 0.72 },
        { transform: "translate(-50%, -50%) scale(2.6)", opacity: 0 },
      ],
      { duration: 300, easing: "ease-out", fill: "forwards" }
    ),
    animateElement(
      ringPrimary,
      [
        { transform: "translate(-50%, -50%) scale(0.2)", opacity: 0.62 },
        { transform: "translate(-50%, -50%) scale(2.2)", opacity: 0 },
      ],
      { duration: 380, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "forwards" }
    ),
    animateElement(
      ringSecondary,
      [
        { transform: "translate(-50%, -50%) scale(0.3)", opacity: 0.48 },
        { transform: "translate(-50%, -50%) scale(1.95)", opacity: 0 },
      ],
      { duration: 320, easing: "ease-out", fill: "forwards", delay: 50 }
    ),
  ];

  affectedCardEls.filter(Boolean).forEach((cardEl, index) => {
    animations.push(
      animateElement(
        cardEl,
        [
          { transform: "scale(1) rotate(0deg)", opacity: 1 },
          { transform: `scale(1.08) rotate(${index % 2 === 0 ? "-6" : "6"}deg)`, opacity: 0.9, offset: 0.45 },
          { transform: `scale(0.9) rotate(${index % 2 === 0 ? "5" : "-5"}deg)`, opacity: 0 },
        ],
        { duration: 280, easing: "ease-in", fill: "forwards" }
      )
    );
    animations.push(
      animateElement(
        cardEl,
        [
          { backgroundColor: "#ffffff", boxShadow: "0 0 0 rgba(255, 32, 32, 0)", offset: 0 },
          { backgroundColor: "#ff4646", boxShadow: "0 0 24px rgba(255, 32, 32, 0.95)", offset: 0.25 },
          { backgroundColor: "#fff2f2", boxShadow: "0 0 10px rgba(255, 90, 90, 0.7)", offset: 0.52 },
          { backgroundColor: "#ff2323", boxShadow: "0 0 28px rgba(255, 20, 20, 1)", offset: 0.74 },
          { backgroundColor: "#ffe3e3", boxShadow: "0 0 0 rgba(255, 32, 32, 0)", offset: 1 },
        ],
        { duration: 280, easing: "ease-out", fill: "forwards" }
      )
    );
  });

  await Promise.all([...animations, particleFx.done]);

  particleFx.cleanup?.();
  layer.remove();
}

function detectDoubleTap({ row, col }, now = performance.now()) {
  const thresholdMs = 250;
  const key = `${row}:${col}`;
  const previous = state.doubleTapState;
  if (previous && previous.key === key && now - previous.time <= thresholdMs) {
    state.doubleTapState = null;
    return true;
  }
  state.doubleTapState = { key, time: now };
  return false;
}

function getSequenceCardSnapshots(selection) {
  return selection
    .map(({ row, col }) =>
      boardEl.querySelector(`.card[data-row="${row}"][data-col="${col}"]`)
    )
    .filter(Boolean)
    .map((cardEl) => ({
      rect: cardEl.getBoundingClientRect(),
      clone: cardEl.cloneNode(true),
    }));
}

async function playScoreAnimation({
  cards,
  basePerCard,
  sequenceCount,
  comboMultiplier,
  chainMultiplier,
  rawPoints,
  finalPoints,
}) {
  if (!cards?.length) {
    return;
  }

  if (scoreAnimInFlight) {
    debugScoreAnimLog("already running; ignoring trigger", { stack: new Error().stack });
    return;
  }

  const id = ++scoreAnimRunId;
  debugScoreAnimLog(`start id=${id}`, { stack: new Error().stack });

  const snapshots = cards
    .map((entry) => {
      if (entry?.rect && entry?.clone) {
        return entry;
      }
      if (entry instanceof Element) {
        return { rect: entry.getBoundingClientRect(), clone: entry.cloneNode(true) };
      }
      return null;
    })
    .filter(Boolean);

  if (!snapshots.length) {
    return;
  }

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const chainForDisplay = Math.max(1, Number(chainMultiplier ?? comboMultiplier ?? 1));

  const overlay = document.createElement("div");
  overlay.className = "score-overlay";

  const stage = document.createElement("div");
  stage.className = "score-stage";

  const stageContent = document.createElement("div");
  stageContent.className = "score-stage__content";

  const textStack = document.createElement("div");
  textStack.className = "score-text-stack";

  const cardsRow = document.createElement("div");
  cardsRow.className = "score-cards-row";

  stageContent.append(textStack, cardsRow);
  stage.append(stageContent);

  const textLines = [];
  if (chainForDisplay > 1) {
    textLines.push({ className: "score-line score-points-label__combo", text: `${chainForDisplay}x COMBO` });
    textLines.push({ className: "score-line score-points-label__raw", text: `+${rawPoints} points` });
  }
  textLines.push({ className: "score-line score-points-label__final", text: `+${finalPoints} points!` });

  textLines.forEach(({ className, text }) => {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    line.style.opacity = "0";
    line.style.transform = "translateY(8px)";
    textStack.append(line);
  });

  const cardRects = snapshots.map((entry) => entry.rect);
  const targetWidth = Math.max(...cardRects.map((rect) => rect.width));
  const targetHeight = Math.max(...cardRects.map((rect) => rect.height));

  const slots = snapshots.map(() => {
    const slot = document.createElement("div");
    slot.className = "score-card-slot";
    slot.style.width = `${targetWidth}px`;
    slot.style.height = `${targetHeight}px`;
    cardsRow.append(slot);
    return slot;
  });

  const clones = snapshots.map((entry) => {
    const clone = entry.clone;
    clone.classList.remove(
      "card--selected",
      "card--pending",
      "card--swapper",
      "card--dragging",
      "card--animating"
    );
    clone.classList.add("score-card-clone");
    clone.style.left = `${entry.rect.left}px`;
    clone.style.top = `${entry.rect.top}px`;
    clone.style.width = `${entry.rect.width}px`;
    clone.style.height = `${entry.rect.height}px`;
    clone.style.transform = "none";
    stage.append(clone);
    return {
      clone,
      startLeft: entry.rect.left,
      startTop: entry.rect.top,
      targetLeft: entry.rect.left,
      targetTop: entry.rect.top,
    };
  });

  // Timeline: 300ms cards to stage -> 150ms pause -> text line enters (180ms, 90ms stagger)
  // -> 300ms hold -> 300ms group exit + 600ms overlay fade.
  scoreAnimInFlight = true;
  scoreAnimationActive = true;
  document.body.append(overlay, stage);

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));

    slots.forEach((slot, i) => {
      const targetRect = slot.getBoundingClientRect();
      const cloneWidth = Number.parseFloat(clones[i].clone.style.width) || targetRect.width;
      const cloneHeight = Number.parseFloat(clones[i].clone.style.height) || targetRect.height;
      clones[i].targetLeft = targetRect.left + (targetRect.width - cloneWidth) / 2;
      clones[i].targetTop = targetRect.top + (targetRect.height - cloneHeight) / 2;
    });

    await Promise.all([
      animateElement(overlay, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 120,
        easing: "ease-out",
        fill: "forwards",
      }),
      ...clones.map(({ clone, startLeft, startTop, targetLeft, targetTop }) =>
        animateElement(
          clone,
          [
            { left: `${startLeft}px`, top: `${startTop}px`, opacity: 1 },
            { left: `${targetLeft}px`, top: `${targetTop}px`, opacity: 1 },
          ],
          { duration: 300, easing: "ease-out", fill: "forwards" }
        )
      ),
    ]);

    await wait(150);

    const lineEls = Array.from(textStack.children);
    const lineAnimations = lineEls.map((lineEl, index) =>
      new Promise((resolve) => {
        window.setTimeout(() => {
          animateElement(
            lineEl,
            [
              { opacity: 0, transform: "translateY(8px)" },
              { opacity: 1, transform: "translateY(0px)" },
            ],
            { duration: 180, easing: "ease-out", fill: "forwards" }
          ).then(resolve);
        }, index * 90);
      })
    );

    await Promise.all(lineAnimations);
    await wait(300);

    await Promise.all([
      ...clones.map(({ clone }) =>
        animateElement(
          clone,
          [
            { transform: "translateY(0px)", opacity: 1 },
            { transform: "translateY(-80px)", opacity: 0 },
          ],
          { duration: 300, easing: "ease-in", fill: "forwards" }
        )
      ),
      animateElement(
        textStack,
        [
          { transform: "translateY(0px)", opacity: 1 },
          { transform: "translateY(-80px)", opacity: 0 },
        ],
        { duration: 300, easing: "ease-in", fill: "forwards" }
      ),
      animateElement(overlay, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 600,
        easing: "ease-out",
        fill: "forwards",
      }),
    ]);
  } finally {
    debugScoreAnimLog(`end id=${id}`);
    stage.remove();
    overlay.remove();
    scoreAnimInFlight = false;
    scoreAnimationActive = false;
  }
}

function animateScoreCountUp(oldValue, newValue, el) {
  if (!el) {
    return Promise.resolve();
  }
  const start = Number(oldValue) || 0;
  const end = Number(newValue) || 0;
  const duration = 560;
  const delta = end - start;
  const startTime = performance.now();
  el.classList.add("score-blink");

  return new Promise((resolve) => {
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(start + delta * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(() => {
        el.classList.remove("score-blink");
      }, 500);
      resolve();
    }
    requestAnimationFrame(tick);
  });
}

function buildDeck() {
  const deck = [];
  for (let d = 0; d < 2; d += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          id: `${rank}${suit}-${d}-${Math.random().toString(36).slice(2, 8)}`,
          rank,
          suit,
          isBomb: false,
          isSwapper: false,
        });
      }
    }
    deck.push({
      id: `Joker-${d}-A-${Math.random().toString(36).slice(2, 8)}`,
      rank: "Joker",
      suit: "🃏",
      isBomb: false,
      isSwapper: false,
    });
    deck.push({
      id: `Joker-${d}-B-${Math.random().toString(36).slice(2, 8)}`,
      rank: "Joker",
      suit: "🃏",
      isBomb: false,
      isSwapper: false,
    });
  }
  const shuffled = shuffle(deck);
  tagSpecials(shuffled);
  return shuffled;
}

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function tagSpecials(deck) {
  const indices = shuffle(Array.from({ length: deck.length }, (_, i) => i));
  const bombIndices = indices.slice(0, 10);
  const swapperIndices = indices.slice(10, 20);
  bombIndices.forEach((index) => {
    deck[index].isBomb = true;
  });
  swapperIndices.forEach((index) => {
    deck[index].isSwapper = true;
  });
}

function initGrid() {
  state.grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
  for (let row = GRID_SIZE - 1; row >= GRID_SIZE - INITIAL_ROWS; row -= 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (!canSpawnNewCard()) {
        triggerGameOver("initial-deal-no-slot");
        return;
      }
      state.grid[row][col] = drawCard();
    }
  }
}

function drawCard() {
  if (state.deck.length === 0) {
    state.deck = buildDeck();
  }
  return state.deck.pop();
}

function getCardAssetKey(card) {
  if (card.rank === "Joker") {
    return "joker";
  }
  const suitMap = {
    "♠": "spades",
    "♥": "hearts",
    "♦": "diamonds",
    "♣": "clubs",
  };
  const suitName = suitMap[card.suit];
  if (!suitName) {
    return null;
  }
  return `${card.rank.toLowerCase()}_of_${suitName}`;
}

function getSuitColor(suit) {
  if (suit === "♥" || suit === "♦") {
    return { className: "card--red", color: "#f70909" };
  }
  return { className: "card--black", color: "#010e1e" };
}

function buildStandardCardContent(card) {
  const wrapper = document.createElement("div");
  wrapper.className = "card__content";

  const rankEl = document.createElement("div");
  rankEl.className = "card__rank";
  rankEl.textContent = card.rank;

  const suitEl = document.createElement("div");
  suitEl.className = "card__suit";
  const suitSvg = SUIT_SVGS[card.suit];
  const { color } = getSuitColor(card.suit);
  if (suitSvg) {
    suitEl.innerHTML = suitSvg(color);
  } else {
    suitEl.textContent = card.suit;
  }

  wrapper.append(rankEl, suitEl);
  return wrapper;
}

function buildJokerCardContent() {
  const wrapper = document.createElement("div");
  wrapper.className = "card__content card__content--joker";

  const jokerText = document.createElement("div");
  jokerText.className = "card__joker-text";
  jokerText.textContent = "JOKER";

  const jokerIcon = document.createElement("div");
  jokerIcon.className = "card__joker-icon";
  jokerIcon.innerHTML = JOKER_HAT_SVG;

  wrapper.append(jokerText, jokerIcon);
  return wrapper;
}

function renderBoard(options = {}) {
  const {
    prevRectsOverride = null,
    awaitScorePromise = null,
    historyTransition = null,
    historyReason = "",
  } = options;
  const prevRects = prevRectsOverride || (state.animateMoves ? getCardRects() : null);
  const currentCardIds = new Set();
  const newCardEls = [];
  boardEl.innerHTML = "";
  const selectedSet = new Set(
    state.sequenceSelection.map(({ row, col }) => `${row}-${col}`)
  );
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const card = state.grid[row][col];
      const cell = document.createElement("div");
      cell.className = "card";
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (!card) {
        cell.classList.add("card--empty");
        cell.textContent = "·";
      } else {
        cell.dataset.cardId = card.id;
        currentCardIds.add(card.id);
        if (hasRenderedBoard && !previousRenderCardIds.has(card.id)) {
          cell.classList.add("card--pre-enter");
          newCardEls.push(cell);
        }
        if (ASSET_MODE === "sprite") {
          const assetKey = getCardAssetKey(card);
          if (assetKey) {
            cell.classList.add("card--sprite");
            cell.style.backgroundImage = `url(assets/cards/${assetKey}.png)`;
          }
        }
        if (card.rank === "Joker") {
          cell.classList.add("card--joker");
          cell.appendChild(buildJokerCardContent());
        } else {
          const { className } = getSuitColor(card.suit);
          cell.classList.add(className);
          cell.appendChild(buildStandardCardContent(card));
        }
        if (card.isBomb) {
          cell.insertAdjacentHTML(
            "beforeend",
            `<span class="badge badge--bomb" aria-hidden="true">${BOMB_ICON_SVG}</span>`
          );
        }
        if (card.isSwapper) {
          cell.insertAdjacentHTML(
            "beforeend",
            `<span class="badge badge--swapper" aria-hidden="true">${SWAP_ICON_SVG}</span>`
          );
        }
      }

      if (
        state.activeSelection &&
        state.activeSelection.row === row &&
        state.activeSelection.col === col
      ) {
        cell.classList.add("card--selected");
      }
      if (
        state.bombMode &&
        state.bombTarget &&
        state.bombTarget.row === row &&
        state.bombTarget.col === col
      ) {
        cell.classList.add("card--bomb-selected");
      }
      if (selectedSet.has(`${row}-${col}`)) {
        cell.classList.add("card--selected");
      }
      if (state.pendingSwap && state.pendingSwap.row === row && state.pendingSwap.col === col) {
        cell.classList.add("card--pending");
      }
      if (
        state.swapperActive &&
        state.swapperSource &&
        state.swapperSource.row === row &&
        state.swapperSource.col === col
      ) {
        cell.classList.add("card--swapper");
      }

      cell.addEventListener("pointerdown", handlePointerDown);
      cell.addEventListener("pointerenter", handlePointerEnter);
      cell.addEventListener("pointerup", handlePointerUp);
      boardEl.appendChild(cell);
    }
  }
  if (DEBUG_NEW_CARD_ENTER) {
    console.log(`[new-card-enter] newCards detected: ${newCardEls.length}`);
  }

  const boardMovePromise = prevRects
    ? new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve(animateCardMoves(prevRects));
      });
    })
    : Promise.resolve();
  const scoreWaitPromise = awaitScorePromise || Promise.resolve();
  const animationSequencePromise = Promise.resolve(scoreWaitPromise)
    .then(() => boardMovePromise)
    .then(() => {
      if (historyTransition === "redo") {
        return animateNewCardsEnter(newCardEls);
      }
      if (historyTransition === "undo") {
        return animateUndoCardsEnterReverseFall(newCardEls);
      }
      if (historyTransition) {
        return animateHistoryCardEntry(newCardEls, historyTransition, historyReason);
      }
      return animateNewCardsEnter(newCardEls);
    });

  previousRenderCardIds = currentCardIds;
  hasRenderedBoard = true;
  updateClearButtonVisibility();
  state.animateMoves = false;
  return animationSequencePromise;
}

function handlePointerDown(event) {
  if (scoreAnimationActive || isInputLocked()) {
    return;
  }
  event.preventDefault();
  // Drag swaps only apply in normal mode with a real card.
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  const card = state.grid[row][col];
  const isSwapperSourceDrag =
    state.swapperActive &&
    state.swapperSource &&
    state.swapperSource.row === row &&
    state.swapperSource.col === col;
  const dragDisabled =
    state.bombMode || state.swapMode || state.pendingSwap || (state.swapperActive && !isSwapperSourceDrag);
  if (!card && !dragDisabled) {
    return;
  }
  state.dragState = {
    start: { row, col },
    current: { row, col },
    startX: event.clientX,
    startY: event.clientY,
    pointerId: event.pointerId,
    cardEl: dragDisabled ? null : event.currentTarget,
    moved: false,
    swiped: false,
    longPressCancelled: false,
  };
  state.dragSelecting = false;
  state.dragStartCard = { row, col };
  clearLongPressTimer();
  const canLongPressSelect =
    !!card &&
    !(state.bombMode || state.swapMode || state.swapperActive || state.pendingSwap);
  if (canLongPressSelect) {
    state.longPressTimer = window.setTimeout(() => {
      if (!state.dragState || state.dragState.longPressCancelled || scoreAnimationActive || isInputLocked()) {
        return;
      }
      startDragSelection();
    }, LONG_PRESS_MS);
  }
  event.currentTarget.setPointerCapture(event.pointerId);
  if (!dragDisabled) {
    event.currentTarget.classList.add("card--dragging");
  }
}

function handlePointerEnter(event) {
  if (scoreAnimationActive || bombExplosionActive || !state.dragState || isInputLocked()) {
    return;
  }
  if (state.swapMode || state.bombMode || state.pendingSwap) {
    return;
  }
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  if (row === state.dragState.current.row && col === state.dragState.current.col) {
    return;
  }
  state.dragState.current = { row, col };
  state.dragState.moved = true;
}

function handlePointerMove(event) {
  if (scoreAnimationActive || bombExplosionActive || !state.dragState || isInputLocked()) {
    return;
  }
  if (state.swapMode || state.bombMode || state.pendingSwap) {
    return;
  }
  const { startX, startY, cardEl } = state.dragState;
  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  if (!state.dragSelecting && !state.dragState.longPressCancelled) {
    const movedDistance = Math.hypot(deltaX, deltaY);
    const longPressMoveTolerance =
      event.pointerType === "mouse" ? LONG_PRESS_MOVE_TOLERANCE_MOUSE : LONG_PRESS_MOVE_TOLERANCE_TOUCH;
    if (movedDistance > longPressMoveTolerance) {
      state.dragState.longPressCancelled = true;
      clearLongPressTimer();
    }
  }

  if (state.dragSelecting) {
    const hoveredCard = getCardFromPoint(event.clientX, event.clientY);
    if (hoveredCard) {
      extendDragSelection(hoveredCard.row, hoveredCard.col);
    }
    return;
  }

  if (!cardEl) {
    return;
  }
  if (state.dragState.swiped) {
    return;
  }
  const threshold = getSwipeThreshold(cardEl, deltaX, deltaY);
  if (Math.abs(threshold.distance) < threshold.minimum) {
    return;
  }
  state.dragState.moved = true;
  state.dragState.swiped = true;
  const swipeTarget = getSwipeTarget(state.dragState.start, deltaX, deltaY);
  if (!swipeTarget) {
    clearDragVisual();
    state.dragState = null;
    return;
  }
  handleDragSwap(swipeTarget.row, swipeTarget.col);
  clearDragVisual();
  state.dragState = null;
  renderBoard();
}

function clearDragVisual() {
  if (!state.dragState || !state.dragState.cardEl) {
    return;
  }
  const { cardEl } = state.dragState;
  cardEl.style.transform = "";
  cardEl.classList.remove("card--dragging");
}

function handlePointerCancel() {
  if (!state.dragState) {
    return;
  }
  clearLongPressTimer();
  endDragSelection(false);
  clearDragVisual();
  state.dragState = null;
}

async function handlePointerUp(event) {
  if (scoreAnimationActive || bombExplosionActive || !state.dragState || isInputLocked()) {
    return;
  }
  const { moved } = state.dragState;
  const dropTarget = getDropTarget(event);
  const row = dropTarget.row;
  const col = dropTarget.col;
  const card = state.grid[row][col];
  const now = performance.now();

  clearLongPressTimer();
  if (state.dragSelecting) {
    endDragSelection(true);
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (moved) {
    handleDragSwap(row, col);
    clearDragVisual();
    state.dragState = null;
    renderBoard();
    return;
  }

  if (state.swapMode) {
    handleSwapModeTap(row, col);
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (state.swapperActive) {
    handleSwapperTap(row, col);
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (state.bombMode) {
    if (!card) {
      state.doubleTapState = null;
      state.bombTarget = null;
      renderBoard();
      state.dragState = null;
      return;
    }
    if (detectDoubleTap({ row, col }, now)) {
      clearDragVisual();
      state.dragState = null;
      state.bombTarget = null;
      await clearSingleCard(row, col, true);
      return;
    }
    state.bombTarget = { row, col };
    statusEl.textContent = "Bomb ready: double tap to clear.";
    renderBoard();
    clearDragVisual();
    state.dragState = null;
    return;
  }

  const isInSequence = state.sequenceSelection.some(
    (cell) => cell.row === row && cell.col === col
  );
  if (state.sequenceValid && state.sequenceSelection.length >= 3 && isInSequence) {
    if (detectDoubleTap({ row, col }, now)) {
      clearDragVisual();
      state.dragState = null;
      clearSelectedSequence();
      return;
    }
    statusEl.textContent = "Sequence selected. Double tap to clear or tap Clear.";
    renderBoard();
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (card && card.isBomb) {
    const now = performance.now();
    if (
      state.lastBombTap &&
      state.lastBombTap.row === row &&
      state.lastBombTap.col === col &&
      now - state.lastBombTap.time < 400
    ) {
      state.lastBombTap = null;
      clearDragVisual();
      state.dragState = null;
      clearSequenceSelection();
      await clearSingleCard(row, col, false);
      return;
    }
    state.lastBombTap = { row, col, time: now };
  } else {
    state.lastBombTap = null;
  }

  if (!state.sequenceSelection.length && card && card.isSwapper) {
    // Tap starts a normal sequence; swapper special swap is only tap-to-non-adjacent
    // while adjacent swaps require an explicit drag gesture.
    resetSequenceToStart(
      row,
      col,
      "Swapper selected. Tap adjacent to build a sequence, or tap a non-adjacent card to swap."
    );
    state.swapperActive = true;
    state.swapperSource = { row, col };
    renderBoard();
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (!card) {
    statusEl.textContent = "Tap a card to start a sequence.";
    clearDragVisual();
    state.dragState = null;
    return;
  }

  handleSequenceTap(row, col);
  clearDragVisual();
  state.dragState = null;
  renderBoard();
}

function getDropTarget(event) {
  const hoverTarget = document.elementFromPoint(event.clientX, event.clientY);
  const cardTarget = hoverTarget?.closest?.(".card");
  if (cardTarget) {
    const row = Number(cardTarget.dataset.row);
    const col = Number(cardTarget.dataset.col);
    if (!Number.isNaN(row) && !Number.isNaN(col)) {
      return { row, col };
    }
  }
  if (state.dragState) {
    return state.dragState.current;
  }
  return { row: 0, col: 0 };
}

function clearLongPressTimer() {
  if (state.longPressTimer) {
    window.clearTimeout(state.longPressTimer);
    state.longPressTimer = null;
  }
}

function getCardFromPoint(x, y) {
  const cardTarget = document.elementFromPoint(x, y)?.closest?.(".card");
  if (!cardTarget || cardTarget.classList.contains("card--empty")) {
    return null;
  }
  const row = Number(cardTarget.dataset.row);
  const col = Number(cardTarget.dataset.col);
  if (Number.isNaN(row) || Number.isNaN(col) || !state.grid[row]?.[col]) {
    return null;
  }
  return { row, col };
}

function areOrthogonallyAdjacent(cardA, cardB) {
  return Math.abs(cardA.row - cardB.row) + Math.abs(cardA.col - cardB.col) === 1;
}

function updateSelectionUI() {
  renderBoard();
}

function startDragSelection() {
  // Long press needs a short hold before drag selection becomes active,
  // so quick taps still route through normal tap/double-tap handling.
  const { row, col } = state.dragStartCard || {};
  const card = Number.isInteger(row) && Number.isInteger(col) ? state.grid[row][col] : null;
  if (!card) {
    return;
  }
  state.dragSelecting = true;
  boardEl.classList.add("board--drag-selecting");
  boardEl.style.touchAction = "none";
  state.sequenceSelection = [{ row, col }];
  state.sequenceDirection = null;
  state.sequenceValid = false;
  statusEl.textContent = "Drag to select orthogonally adjacent cards.";
  updateSelectionUI();
}

function canExtendSelection(currentSelection, nextCard) {
  if (!currentSelection.length) {
    return false;
  }
  const lastCard = currentSelection[currentSelection.length - 1];
  if (!areOrthogonallyAdjacent(lastCard, nextCard)) {
    return false;
  }
  const candidateSelection = [...currentSelection, nextCard];
  if (candidateSelection.length === 2) {
    return validateSequencePair(candidateSelection).valid;
  }
  return validateSequence(candidateSelection).valid;
}

function extendDragSelection(row, col) {
  if (!state.dragSelecting || !state.sequenceSelection.length) {
    return;
  }
  const selection = state.sequenceSelection;
  const lastCell = selection[selection.length - 1];
  if (lastCell.row === row && lastCell.col === col) {
    return;
  }

  // Backtrack when the pointer moves to the previous cell in the path.
  if (selection.length >= 2) {
    const prevCell = selection[selection.length - 2];
    if (prevCell.row === row && prevCell.col === col) {
      selection.pop();
      applyDragSelectionValidation();
      updateSelectionUI();
      return;
    }
  }

  const existingIndex = selection.findIndex((cell) => cell.row === row && cell.col === col);
  if (existingIndex !== -1) {
    return;
  }

  const nextCard = { row, col };
  if (!canExtendSelection(selection, nextCard)) {
    statusEl.textContent = "Invalid sequence path.";
    return;
  }

  selection.push(nextCard);
  applyDragSelectionValidation();
  updateSelectionUI();
}

function applyDragSelectionValidation() {
  const selection = state.sequenceSelection;
  state.sequenceDirection = null;
  if (selection.length < 2) {
    state.sequenceValid = false;
    statusEl.textContent = "Drag to select orthogonally adjacent cards.";
    return;
  }
  const pairValidation = validateSequencePair(selection.slice(0, 2));
  if (!pairValidation.valid) {
    state.sequenceValid = false;
    statusEl.textContent = "Invalid sequence path.";
    return;
  }
  if (selection.length < 3) {
    state.sequenceValid = false;
    statusEl.textContent = "Sequence in progress.";
    return;
  }
  const validation = validateSequence(selection);
  state.sequenceValid = validation.valid;
  statusEl.textContent = validation.valid
    ? "Sequence selected. Double tap to clear or tap Clear."
    : "Invalid sequence path.";
}

function endDragSelection(commitSelection) {
  if (!state.dragSelecting) {
    return;
  }
  state.dragSelecting = false;
  boardEl.classList.remove("board--drag-selecting");
  boardEl.style.touchAction = "";
  if (!commitSelection) {
    return;
  }
  applyDragSelectionValidation();
  updateSelectionUI();
}

function handleDragSwap(targetRow, targetCol) {
  if (!state.dragState) {
    return;
  }
  const { row: startRow, col: startCol } = state.dragState.start;
  if (startRow === targetRow && startCol === targetCol) {
    return;
  }
  const movingCard = state.grid[startRow][startCol];
  if (!movingCard) {
    return;
  }
  const isAdjacent =
    Math.abs(startRow - targetRow) + Math.abs(startCol - targetCol) === 1;
  if (!isAdjacent) {
    statusEl.textContent = "Cards must be orthogonally adjacent.";
    return;
  }
  pushUndoCheckpoint("drag-swap");
  state.animateMoves = true;
  clearSequenceSelection();
  if (!state.grid[targetRow][targetCol]) {
    moveCardToEmpty(startRow, startCol, targetRow, targetCol);
    return;
  }
  swapCards(startRow, startCol, targetRow, targetCol);
  state.chainMultiplier = 1;
  if (spawnCardOrGameOver("drag-swap")) {
    statusEl.textContent = "Swap complete. Card dropped.";
  }
}

function getSwipeTarget(start, deltaX, deltaY) {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  if (absX === 0 && absY === 0) {
    return null;
  }
  const useHorizontal = absX >= absY;
  const row = start.row + (useHorizontal ? 0 : deltaY > 0 ? 1 : -1);
  const col = start.col + (useHorizontal ? (deltaX > 0 ? 1 : -1) : 0);
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    statusEl.textContent = "Swipe within the board bounds.";
    return null;
  }
  return { row, col };
}

function moveCardToEmpty(startRow, startCol, targetRow, targetCol) {
  const movingCard = state.grid[startRow][startCol];
  if (!movingCard) {
    return;
  }
  state.grid[targetRow][targetCol] = movingCard;
  state.grid[startRow][startCol] = null;
  shiftColumnDown(startCol, startRow);
  state.chainMultiplier = 1;
  if (spawnCardOrGameOver("move-to-empty")) {
    statusEl.textContent = "Move complete. Card dropped.";
  }
}

function handleSequenceTap(row, col) {
  state.lastTap = null;
  const selection = state.sequenceSelection;
  const tappedIndex = selection.findIndex(
    (cell) => cell.row === row && cell.col === col
  );
  if (tappedIndex !== -1) {
    selection.splice(tappedIndex, 1);
    if (selection.length >= 2) {
      const [first, second] = selection;
      if (first.row === second.row) {
        state.sequenceDirection = "row";
      } else if (first.col === second.col) {
        state.sequenceDirection = "col";
      } else {
        state.sequenceDirection = null;
      }
    } else {
      state.sequenceDirection = null;
    }
    if (selection.length >= 3) {
      const validation = validateSequence(selection);
      state.sequenceValid = validation.valid;
      statusEl.textContent = validation.valid
        ? "Sequence selected. Double tap to clear."
        : "Sequence in progress.";
    } else if (selection.length === 0) {
      state.sequenceValid = false;
      state.sequenceDirection = null;
      statusEl.textContent = "Selection cleared.";
    } else {
      state.sequenceValid = false;
      statusEl.textContent = "Card deselected.";
    }
    return;
  }
  if (selection.length === 0) {
    resetSequenceToStart(row, col, "Sequence started. Tap adjacent cards.");
    return;
  }
  const lastCell = selection[selection.length - 1];
  const isAdjacent =
    Math.abs(lastCell.row - row) + Math.abs(lastCell.col - col) === 1;
  if (!isAdjacent) {
    clearSequenceSelection();
    statusEl.textContent = "Illegal sequence. Selection cleared.";
    return;
  }
  if (!state.sequenceDirection) {
    if (row === lastCell.row) {
      state.sequenceDirection = "row";
    } else if (col === lastCell.col) {
      state.sequenceDirection = "col";
    } else {
      clearSequenceSelection();
      statusEl.textContent = "Illegal sequence. Selection cleared.";
      return;
    }
  } else if (
    (state.sequenceDirection === "row" && row !== lastCell.row) ||
    (state.sequenceDirection === "col" && col !== lastCell.col)
  ) {
    clearSequenceSelection();
    statusEl.textContent = "Illegal sequence. Selection cleared.";
    return;
  }

  selection.push({ row, col });
  if (selection.length === 2) {
    const pairValidation = validateSequencePair(selection);
    if (!pairValidation.valid) {
      clearSequenceSelection();
      statusEl.textContent = "Illegal sequence. Selection cleared.";
      return;
    }
  }
  if (selection.length >= 3) {
    const validation = validateSequence(selection);
    state.sequenceValid = validation.valid;
    if (validation.valid) {
      statusEl.textContent = "Sequence selected. Double tap to clear.";
    } else {
      clearSequenceSelection();
      statusEl.textContent = "Illegal sequence. Selection cleared.";
    }
    return;
  }
  state.sequenceValid = false;
  statusEl.textContent = "Sequence in progress.";
}

function resetSequenceToStart(row, col, message) {
  state.sequenceSelection = [{ row, col }];
  state.sequenceValid = false;
  state.sequenceDirection = null;
  statusEl.textContent = message;
}

function shiftColumnDown(col, startRow) {
  for (let row = startRow - 1; row >= 0; row -= 1) {
    if (state.grid[row][col]) {
      state.grid[row + 1][col] = state.grid[row][col];
      state.grid[row][col] = null;
    }
  }
}

function handleSwapperTap(row, col) {
  if (!state.swapperSource) {
    state.swapperActive = false;
    return;
  }
  const { row: sourceRow, col: sourceCol } = state.swapperSource;
  if (sourceRow === row && sourceCol === col) {
    state.swapperActive = false;
    state.swapperSource = null;
    clearSequenceSelection();
    statusEl.textContent = "Swapper selection cleared.";
    renderBoard();
    return;
  }
  if (!state.grid[row][col]) {
    statusEl.textContent = "Select a card to swap.";
    return;
  }

  const isAdjacent =
    Math.abs(sourceRow - row) + Math.abs(sourceCol - col) === 1;
  // Tap-on-adjacent is reserved for sequence selection. Adjacent swaps happen via drag only.
  if (isAdjacent) {
    state.swapperActive = false;
    state.swapperSource = null;
    handleSequenceTap(row, col);
    return;
  }

  const swapperCard = state.grid[sourceRow][sourceCol];
  pushUndoCheckpoint("swapper-swap");
  state.animateMoves = true;
  clearSequenceSelection();
  swapCards(sourceRow, sourceCol, row, col);
  if (swapperCard) {
    swapperCard.isSwapper = false;
  }
  state.swapperActive = false;
  state.swapperSource = null;
  state.chainMultiplier = 1;
  if (spawnCardOrGameOver("swapper")) {
    statusEl.textContent = "Swapper used. Card dropped.";
  }
  renderBoard();
}

function handleSwapModeTap(row, col) {
  if (!state.grid[row][col]) {
    statusEl.textContent = "Select a card to swap.";
    return;
  }
  if (!state.pendingSwap) {
    state.pendingSwap = { row, col };
    statusEl.textContent = "Select the second card to swap.";
    renderBoard();
    return;
  }
  const { row: firstRow, col: firstCol } = state.pendingSwap;
  if (firstRow === row && firstCol === col) {
    state.pendingSwap = null;
    statusEl.textContent = "Swap selection cleared.";
    renderBoard();
    return;
  }
  pushUndoCheckpoint("free-swap");
  state.animateMoves = true;
  swapCards(firstRow, firstCol, row, col);
  state.pendingSwap = null;
  state.swapMode = false;
  state.chainMultiplier = 1;
  state.freeSwapCount = Math.max(0, state.freeSwapCount - 1);
  const spawned = spawnCardOrGameOver("free-swap");
  updateHud();
  if (spawned) {
    statusEl.textContent = "Swap used. Card dropped.";
  }
  renderBoard();
}

function getSwipeThreshold(cardEl, deltaX, deltaY) {
  const rect = cardEl.getBoundingClientRect();
  const useHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
  const baseLength = useHorizontal ? rect.width : rect.height;
  return {
    distance: useHorizontal ? deltaX : deltaY,
    minimum: baseLength * SWIPE_THRESHOLD_RATIO,
  };
}

function getCardRects() {
  const rects = {};
  const cards = boardEl.querySelectorAll(".card[data-card-id]");
  cards.forEach((cardEl) => {
    rects[cardEl.dataset.cardId] = cardEl.getBoundingClientRect();
  });
  return rects;
}

function animateCardMoves(prevRects) {
  const animations = [];
  const cards = boardEl.querySelectorAll(".card[data-card-id]");
  cards.forEach((cardEl) => {
    const cardId = cardEl.dataset.cardId;
    const prevRect = prevRects[cardId];
    if (!prevRect) {
      return;
    }
    const nextRect = cardEl.getBoundingClientRect();
    const deltaX = prevRect.left - nextRect.left;
    const deltaY = prevRect.top - nextRect.top;
    if (deltaX === 0 && deltaY === 0) {
      return;
    }
    cardEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    animations.push(
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          cardEl.classList.add("card--animating");
          cardEl.style.transform = "";
          let done = false;
          const cleanup = () => {
            if (done) {
              return;
            }
            done = true;
            cardEl.classList.remove("card--animating");
            resolve();
          };
          cardEl.addEventListener("transitionend", cleanup, { once: true });
          window.setTimeout(cleanup, 280);
        });
      })
    );
  });
  return Promise.all(animations).then(() => {
    cards.forEach((cardEl) => {
      cardEl.classList.remove("card--animating");
    });
  });
}

function animateNewCardsEnter(newCardEls = []) {
  if (!newCardEls.length) {
    return Promise.resolve();
  }
  if (DEBUG_NEW_CARD_ENTER) {
    console.log(`[new-card-enter] enter animation start (${newCardEls.length})`);
  }

  newCardEls.forEach((cardEl) => {
    const nextRect = cardEl.getBoundingClientRect();
    const startY = -nextRect.height - 24;
    const deltaY = startY - nextRect.top;
    if (DEBUG_NEW_CARD_ENTER) {
      console.log(
        `[new-card-enter] entering new card ${cardEl.dataset.cardId} col=${cardEl.dataset.col} deltaY=${Math.round(deltaY)}`
      );
    }
    cardEl.style.opacity = "0";
    cardEl.style.transform = `translate(0px, ${deltaY}px)`;
  });

  return new Promise((resolveAll) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const animations = newCardEls.map(
        (cardEl) => new Promise((resolve) => {
          cardEl.classList.add("card--entering");
          cardEl.classList.remove("card--pre-enter");
          cardEl.style.transform = "";
          cardEl.style.opacity = "1";
          let settled = false;
          const cleanup = () => {
            if (settled) {
              return;
            }
            settled = true;
            cardEl.classList.remove("card--entering");
            cardEl.classList.remove("card--pre-enter");
            cardEl.style.removeProperty("transform");
            cardEl.style.removeProperty("opacity");
            resolve();
          };
          cardEl.addEventListener("transitionend", cleanup, { once: true });
          window.setTimeout(cleanup, 620);
        })
      );

        Promise.all(animations).then(() => {
          if (DEBUG_NEW_CARD_ENTER) {
            console.log("[new-card-enter] enter animation end");
          }
          resolveAll();
        });
      });
    });
  });
}

function swapCards(rowA, colA, rowB, colB) {
  const temp = state.grid[rowA][colA];
  state.grid[rowA][colA] = state.grid[rowB][colB];
  state.grid[rowB][colB] = temp;
}

const WILDCARD_LIMIT_PER_SEQUENCE = 1;

function validateSequence(selection) {
  if (selection.length < 3) {
    return { valid: false, usesWildcard: false };
  }
  if (!isContiguousLineSelection(selection)) {
    return { valid: false, usesWildcard: false };
  }
  const cards = selection.map(({ row, col }) => state.grid[row][col]);
  if (cards.some((card) => card === null)) {
    return { valid: false, usesWildcard: false };
  }
  const nonWildcards = cards.filter((card) => !isWildcardCard(card));
  // Bug fix: we only need one non-wild anchor card to evaluate expected ranks.
  // Requiring two rejects valid runs such as 2♣, 2♠, A♠ where one 2 is consumed
  // as wildcard and the other 2 + Ace provide concrete rank matches.
  if (nonWildcards.length < 1) {
    return { valid: false, usesWildcard: false };
  }
  const baseSuit = nonWildcards[0].suit;
  if (!nonWildcards.every((card) => card.suit === baseSuit)) {
    return { valid: false, usesWildcard: false };
  }

  const attempts = [
    { direction: 1, aceValue: 1 },
    { direction: 1, aceValue: 14 },
    { direction: -1, aceValue: 1 },
    { direction: -1, aceValue: 14 },
  ];

  for (const attempt of attempts) {
    const result = attemptSequence(cards, attempt.direction, attempt.aceValue);
    if (result.valid) {
      return result;
    }
  }

  return { valid: false, usesWildcard: false };
}

function isContiguousLineSelection(selection) {
  if (selection.length < 2) {
    return true;
  }
  for (let i = 1; i < selection.length; i += 1) {
    const prev = selection[i - 1];
    const current = selection[i];
    const distance = Math.abs(prev.row - current.row) + Math.abs(prev.col - current.col);
    if (distance !== 1) {
      return false;
    }
  }
  return true;
}

function validateSequencePair(selection) {
  if (selection.length !== 2) {
    return { valid: true };
  }
  const cards = selection.map(({ row, col }) => state.grid[row][col]);
  if (cards.some((card) => card === null)) {
    return { valid: false };
  }
  // Pair validation only enforces suit for non-wild cards.
  // If either card is wild, we defer strict rank validation to 3+ cards.
  const nonWildcards = cards.filter((card) => !isWildcardCard(card));
  if (nonWildcards.length < 2) {
    return { valid: true };
  }
  const [first, second] = nonWildcards;
  return { valid: first.suit === second.suit };
}

/*
 * Sequence wildcard policy (single source of truth):
 * - Wild cards are Joker and rank "2".
 * - Wildcards may substitute rank only (suit is enforced separately by non-wild suit checks).
 * - At most one wildcard substitution can be consumed per sequence.
 * - Current gameplay rule: rank "2" cannot substitute when the expected rank is literal 2.
 *   (Changing this behavior later should be a one-line edit in canWildcardRepresentExpected.)
 */
function attemptSequence(cards, direction, aceValue) {
  const wildcardState = {
    used: false,
    usedCount: 0,
    usedBy: null,
    usedAtIndex: null,
  };
  const baseIndex = cards.findIndex((card) => !isWildcardCard(card));
  if (baseIndex === -1) {
    return { valid: false, usesWildcard: false };
  }
  const baseValue = getRankValue(cards[baseIndex], aceValue);
  if (baseValue === null) {
    return { valid: false, usesWildcard: false };
  }
  for (let i = 0; i < cards.length; i += 1) {
    const expectedRank = baseValue + direction * (i - baseIndex);
    if (expectedRank < 1 || expectedRank > 14) {
      return { valid: false, usesWildcard: false };
    }
    const matchResult = matchOrConsumeWildcard({
      card: cards[i],
      expectedRank,
      aceValue,
      wildcardState,
      sequenceIndex: i,
    });
    if (!matchResult.ok) {
      return { valid: false, usesWildcard: false };
    }
  }
  return {
    valid: true,
    usesWildcard: wildcardState.used,
    wildcardConsumption: wildcardState.used
      ? { by: wildcardState.usedBy, index: wildcardState.usedAtIndex }
      : null,
  };
}

function matchOrConsumeWildcard({ card, expectedRank, aceValue, wildcardState, sequenceIndex }) {
  const value = getRankValue(card, aceValue);
  if (value === expectedRank) {
    return { ok: true, usedWildcardNow: false };
  }
  if (!isWildcardCard(card)) {
    return { ok: false, usedWildcardNow: false };
  }
  if (
    wildcardState.usedCount >= WILDCARD_LIMIT_PER_SEQUENCE ||
    !canWildcardRepresentExpected(card, expectedRank)
  ) {
    return { ok: false, usedWildcardNow: false };
  }

  wildcardState.used = true;
  wildcardState.usedCount += 1;
  wildcardState.usedBy = card.rank;
  wildcardState.usedAtIndex = sequenceIndex;
  return { ok: true, usedWildcardNow: true };
}

function getRankValue(card, aceValue) {
  if (card.rank === "A") {
    return aceValue;
  }
  if (card.rank === "Joker") {
    return null;
  }
  if (card.rank === "J") {
    return 11;
  }
  if (card.rank === "Q") {
    return 12;
  }
  if (card.rank === "K") {
    return 13;
  }
  return Number(card.rank);
}

function isWildcardCard(card) {
  return card.rank === "Joker" || card.rank === "2";
}

function canWildcardRepresentExpected(card, expectedRank) {
  if (!isWildcardCard(card)) {
    return false;
  }
  // Keep current gameplay behavior: rank "2" cannot substitute as literal rank 2.
  return !(card.rank === "2" && expectedRank === 2);
}

function runSequenceValidationDebugChecks() {
  if (typeof window === "undefined" || !window.__DEBUG_SEQUENCE_VALIDATION) {
    return;
  }

  const card = (rank, suit = "♠") => ({ rank, suit });
  const inspectAttempts = (name, cards) => {
    const attempts = [
      { direction: 1, aceValue: 1, label: "asc/A-low" },
      { direction: 1, aceValue: 14, label: "asc/A-high" },
      { direction: -1, aceValue: 1, label: "desc/A-low" },
      { direction: -1, aceValue: 14, label: "desc/A-high" },
    ];
    const results = attempts.map((attempt) => ({
      ...attempt,
      result: attemptSequence(cards, attempt.direction, attempt.aceValue),
    }));
    const passing = results.find((entry) => entry.result.valid);
    console.log(`[sequence-debug] ${name}`, {
      cards,
      passingAttempt: passing ? passing.label : null,
      wildcardConsumption: passing ? passing.result.wildcardConsumption : null,
      results,
    });
  };

  inspectAttempts("one wildcard consumed", [card("5"), card("Joker"), card("7")]);
  inspectAttempts("wildcard present but not consumed", [card("A"), card("2"), card("3")]);
  inspectAttempts("two cannot represent literal two", [card("A"), card("2"), card("4")]);
  inspectAttempts("ace low/high comparison", [card("Q"), card("K"), card("A")]);
  inspectAttempts("reported valid case", [card("2", "♣"), card("2", "♠"), card("A", "♠")]);
}

function getEligibleSpawnSlots() {
  const availableRows = [];
  for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
    const hasEmpty = state.grid[row].some((cell) => cell === null);
    if (hasEmpty) {
      availableRows.push(row);
    }
  }
  if (availableRows.length === 0) {
    return [];
  }

  const targetRow = availableRows[0];
  return state.grid[targetRow]
    .map((cell, col) => (cell === null ? { row: targetRow, col } : null))
    .filter(Boolean);
}

function canSpawnNewCard() {
  return getEligibleSpawnSlots().length > 0;
}

function showGameOverOverlay() {
  if (!gameOverOverlayEl) {
    return;
  }
  gameOverOverlayEl.hidden = false;
  playAgainButtonEl?.focus();
}

function hideGameOverOverlay() {
  if (!gameOverOverlayEl) {
    return;
  }
  gameOverOverlayEl.hidden = true;
}

function triggerGameOver(reason = "spawn-blocked") {
  if (state.gameOver) {
    return;
  }
  state.gameOver = true;
  clearLongPressTimer();
  state.dragState = null;
  state.dragSelecting = false;
  statusEl.textContent = "No space for a new card. Game over.";
  setMenuOpen(false);
  debugGameOverLog("game over triggered", { reason });
  showGameOverOverlay();
}

function spawnCardOrGameOver(context = "drop") {
  debugGameOverLog("spawn attempt", { context });
  const canSpawn = canSpawnNewCard();
  debugGameOverLog("canSpawnNewCard() result", { context, canSpawn });
  if (!canSpawn) {
    triggerGameOver(`no-slot:${context}`);
    return false;
  }

  const slots = getEligibleSpawnSlots();
  const target = slots[Math.floor(Math.random() * slots.length)];
  state.grid[target.row][target.col] = drawCard();
  return true;
}

function clearSequenceSelection() {
  state.sequenceSelection = [];
  state.sequenceValid = false;
  state.lastTap = null;
  state.doubleTapState = null;
  state.sequenceDirection = null;
}

async function clearSingleCard(row, col, consumesFreeBomb) {
  if (!state.grid[row][col] || bombExplosionActive) {
    return;
  }

  pushUndoCheckpoint(consumesFreeBomb ? "free-bomb" : "bomb-card");
  state.bombTarget = null;

  const bombCardEl = boardEl.querySelector(`.card[data-row="${row}"][data-col="${col}"]`);
  const centerRect = bombCardEl?.getBoundingClientRect();
  const affectedCardEls = bombCardEl ? [bombCardEl] : [];

  bombExplosionActive = true;
  try {
    if (centerRect) {
      await playBombExplosion({ centerRect, affectedCardEls });
    }
  } finally {
    bombExplosionActive = false;
  }

  state.grid[row][col] = null;
  collapseColumns();
  state.chainMultiplier = 1;
  if (consumesFreeBomb) {
    state.freeBombCount = Math.max(0, state.freeBombCount - 1);
    state.bombMode = false;
    state.bombTarget = null;
  }
  const spawned = spawnCardOrGameOver("bomb-clear");
  updateHud();
  if (spawned) {
    statusEl.textContent = "Bomb used. Card cleared.";
  }
  renderBoard();
}

async function clearSelectedSequence() {
  if (scoreAnimationActive) {
    return;
  }
  if (!state.sequenceValid || state.sequenceSelection.length < 3) {
    statusEl.textContent = "No valid sequence selected.";
    return;
  }
  const validation = validateSequence(state.sequenceSelection);
  if (!validation.valid) {
    statusEl.textContent = "Sequence no longer valid.";
    clearSequenceSelection();
    renderBoard();
    return;
  }

  pushUndoCheckpoint("sequence-clear");

  const selectedCells = [...state.sequenceSelection];
  const animationCards = getSequenceCardSnapshots(selectedCells);
  const prevRects = getCardRects();
  const oldScore = state.score;
  const scoreBreakdown = applyScore(selectedCells.length, validation.usesWildcard);
  const newScore = state.score;

  selectedCells.forEach(({ row, col }) => {
    state.grid[row][col] = null;
  });
  collapseColumns();
  const spawned = spawnCardOrGameOver("sequence-clear");
  clearSequenceSelection();
  updateHud({ preserveScore: true });
  if (spawned) {
    statusEl.textContent = "Sequence cleared!";
  }
  if (!spawned) {
    await renderBoard({ prevRectsOverride: prevRects });
    return;
  }

  const scoreAnimationPromise = (async () => {
    await triggerScoreAnimation("clearSelectedSequence:after-clear-pipeline", {
      cards: animationCards,
      ...scoreBreakdown,
    });
    await animateScoreCountUp(oldScore, newScore, scoreEl);
  })();
  await renderBoard({
    prevRectsOverride: prevRects,
    awaitScorePromise: scoreAnimationPromise,
  });
  renderBoard();
}

function collapseColumns() {
  for (let col = 0; col < GRID_SIZE; col += 1) {
    const columnCards = [];
    for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
      if (state.grid[row][col]) {
        columnCards.push(state.grid[row][col]);
      }
    }
    for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
      state.grid[row][col] = columnCards[GRID_SIZE - 1 - row] || null;
    }
  }
}

function applyScore(length, usesWildcard) {
  const canastraBonus = length === 7 && !usesWildcard ? 2 : 1;
  const basePerCard = state.baseFactor;
  const comboMultiplier = state.chainMultiplier;
  const rawPoints = length * basePerCard;
  const finalPoints = rawPoints * comboMultiplier * canastraBonus;
  state.score += finalPoints;
  state.baseFactor += 1;
  state.chainMultiplier += 1;
  return {
    basePerCard,
    sequenceCount: length,
    comboMultiplier,
    chainMultiplier: comboMultiplier,
    rawPoints,
    finalPoints,
  };
}

function resetRuntimeState() {
  Object.assign(state, {
    ...INITIAL_STATE,
    grid: [],
    deck: [],
    sequenceSelection: [],
  });
  clearLongPressTimer();
  scoreAnimInFlight = false;
  scoreAnimationActive = false;
  bombExplosionActive = false;
}

function init() {
  resetRuntimeState();
  state.deck = buildDeck();
  initGrid();
  hideGameOverOverlay();
  updateHud();
  statusEl.textContent = "Tap adjacent cards to swap. Tap again to deselect.";
  renderBoard();
  undoStack.length = 0;
  redoStack.length = 0;
  updateHistoryButtons();
}

function restartGame() {
  debugGameOverLog("restart requested");
  init();
}

function debugFillSpawnSlotsAndTriggerGameOver() {
  // Dev helper to reproduce the lose condition deterministically.
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (!state.grid[row][col]) {
        state.grid[row][col] = drawCard();
      }
    }
  }
  renderBoard();
  spawnCardOrGameOver("debug-fill-all-slots");
}

function renderPowerupButtonIcons() {
  if (freeSwapButtonIconEl) {
    freeSwapButtonIconEl.innerHTML = SWAP_ICON_SVG;
  }
  if (freeBombButtonIconEl) {
    freeBombButtonIconEl.innerHTML = BOMB_ICON_SVG;
  }
}

function updateClearButtonVisibility() {
  if (!clearSequenceButton) {
    return;
  }
  clearSequenceButton.hidden = !(state.sequenceValid && state.sequenceSelection.length >= 3);
}

function updateHud(options = {}) {
  if (!options.preserveScore) {
    scoreEl.textContent = state.score;
  }
  swapCountEl.textContent = state.freeSwapCount;
  bombCountEl.textContent = state.freeBombCount;
  freeSwapButton.setAttribute("aria-pressed", state.swapMode ? "true" : "false");
  freeBombButton.setAttribute("aria-pressed", state.bombMode ? "true" : "false");
  updateHistoryButtons();
}

function setMenuOpen(isOpen) {
  if (!gameMenuModal) {
    return;
  }
  gameMenuModal.hidden = !isOpen;
}

function handleGlobalKeydown(event) {
  const isUndoShortcut = (event.key === "z" || event.key === "Z") && (event.ctrlKey || event.metaKey) && !event.shiftKey;
  const isRedoShortcut =
    ((event.key === "z" || event.key === "Z") && (event.ctrlKey || event.metaKey) && event.shiftKey) ||
    (event.key === "y" || event.key === "Y") && event.ctrlKey;
  if (isUndoShortcut) {
    event.preventDefault();
    undo();
    return;
  }
  if (isRedoShortcut) {
    event.preventDefault();
    redo();
    return;
  }
  if (event.key !== "Escape") {
    return;
  }
  if (!gameOverOverlayEl?.hidden) {
    restartGame();
    return;
  }
  if (gameMenuModal?.hidden) {
    return;
  }
  setMenuOpen(false);
  menuBtn?.focus();
}

undoButton?.addEventListener("click", undo);
redoButton?.addEventListener("click", redo);

freeSwapButton.addEventListener("click", () => {
  if (scoreAnimationActive || bombExplosionActive || isInputLocked() || state.freeSwapCount <= 0) {
    return;
  }
  state.swapMode = !state.swapMode;
  state.bombMode = false;
  state.bombTarget = null;
  state.pendingSwap = null;
  state.swapperActive = false;
  state.swapperSource = null;
  clearSequenceSelection();
  statusEl.textContent = state.swapMode
    ? "Swap mode: select two cards."
    : "Swap mode off.";
  updateHud();
  renderBoard();
});

clearSequenceButton?.addEventListener("click", () => {
  if (scoreAnimationActive || bombExplosionActive || isInputLocked() || !state.sequenceValid || state.sequenceSelection.length < 3) {
    return;
  }
  state.lastTap = null;
  clearSelectedSequence();
});

freeBombButton.addEventListener("click", () => {
  if (scoreAnimationActive || bombExplosionActive || isInputLocked() || state.freeBombCount <= 0) {
    return;
  }
  state.bombMode = !state.bombMode;
  if (!state.bombMode) {
    state.bombTarget = null;
  }
  state.swapMode = false;
  state.pendingSwap = null;
  state.swapperActive = false;
  state.swapperSource = null;
  clearSequenceSelection();
  statusEl.textContent = state.bombMode
    ? "Bomb mode: double tap a card."
    : "Bomb mode off.";
  updateHud();
  renderBoard();
});

boardEl.addEventListener("pointermove", handlePointerMove);
boardEl.addEventListener("pointercancel", handlePointerCancel);
boardEl.addEventListener("pointerleave", handlePointerCancel);

renderPowerupButtonIcons();
if (window.__DEBUG_SEQUENCE_VALIDATION) {
  runSequenceValidationDebugChecks();
}
init();


menuBtn?.addEventListener("click", () => {
  if (isInputLocked()) {
    return;
  }
  setMenuOpen(true);
});

closeMenuBtn?.addEventListener("click", () => {
  setMenuOpen(false);
  menuBtn?.focus();
});

menuOverlay?.addEventListener("click", () => {
  setMenuOpen(false);
  menuBtn?.focus();
});

playAgainButtonEl?.addEventListener("click", restartGame);

window.restartGame = restartGame;
window.debugFillSpawnSlotsAndTriggerGameOver = debugFillSpawnSlotsAndTriggerGameOver;
// Manual undo/redo verification script:
// 1) Make a swap, undo, redo.
// 2) Clear a sequence, undo.
// 3) Use bomb, undo.
// 4) Undo then do new action and confirm redo is cleared.
// 5) Trigger undo/redo during active effects and verify no stuck transforms/overlays.
document.addEventListener("keydown", handleGlobalKeydown);
