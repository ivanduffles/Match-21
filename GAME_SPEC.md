# Solitaire Crush Prototype Spec

## Overview
Single-player, mobile-first card puzzle game inspired by Buraco sequences with match-style dynamics. Players move cards on a 7×7 grid to form and clear sequences, score points, and avoid filling the board.

---

## Core Objective
- Score points by forming and clearing valid sequences.
- The game ends only when a card drop is required and there is no empty slot available. If a clear opens space, play continues normally even if the grid was previously full.

---

## Board & Cards
- **Grid:** 7×7.
- **Initial state:** Bottom 3 rows filled; top 4 rows empty.
- **Deck:** Two standard decks (108 cards).
- **Deck flow:** Shuffle once and deal in order. When depleted, generate a new 108-card deck, tag specials, shuffle, continue from current grid state (no reset).
- **Special tagging:** Each new deck contains 20 total special cards: 10 bomb cards and 10 swapper cards. No card can be tagged as both.

---

## Sequences (Valid Matches)
### Rules
- **Only rank sequences** (no same-rank sets).
- **Length:** Minimum 3, maximum 7 (grid size).
- **Direction:** Horizontal or vertical.
- **Order:** Ascending or descending allowed.
- **Suit:** Must be the same suit throughout the sequence.
- **Consecutive ranks required:** Examples:  
  - Valid: `A-K-Q`, `Q-K-A`, `5-6-7`
  - Invalid: `5-6-8`, `10-9-7`
- Allowed sequences exist within `A-2-3-4-5-6-7-8-9-10-J-Q-K-A`. `K-A-2` is invalid.

### Ace
Ace can be used at **either end** of a sequence (A-2-3 or Q-K-A).

### Jokers / 2s
- Jokers and 2s can act as wilds.
- **Only 1 wildcard per sequence.**
- A 2 can be natural (as “2”), in which case another Joker or 2 may be used as the single wildcard in the same sequence.
- Example intent: `A-2-3-4-2` is valid (one natural 2 and one wildcard 2). `A-2-2-4` is valid if the second 2 substitutes a 3. `3-4-2-2` and `3-4-2-C` (C = Joker) are invalid.

---

## Player Actions
### Move (Primary Interaction)
- **Tap card A, tap orthogonally adjacent card B → swap positions.**
- Only 1-tile moves (up, down, left, right).
- If move is illegal (not adjacent), it fails (no state change).
- If a card moves from under other cards **into an empty slot**, the cards previously above it fall down by one slot.

### Select & Clear Sequence
- Player drags to select **one** sequence.
- Double tap to clear the selected sequence.
- Clearing removes the cards; cards above fall by `sequence_length` slots (gravity).
  - **Vertical clear:** Cards above fall by the cleared length.
  - **Horizontal clear:** Cards above each cleared card fall by 1 slot (one per affected column). Example: clearing (0,0)-(0,2) drops all cards in columns 0–2 down by one row.
- After any removal, affected columns collapse to fill empty slots below (no gaps remain within a column).
- Invalid selections are rejected on release; subsequences inside invalid selections do not count.
- Selection shape is a straight orthogonal line only. The selection grows or shrinks only along the vector defined by the first two legal tiles.

---

## Spawning / Card Drops
- **Exactly one card drops** after each move or clear (including swaps and bombs).
- The card lands in a **random empty slot** in the **lowest row that has at least one empty slot**.

---

## Scoring
### Base Value
- **Base factor starts at 10.**
- Score = `sequence_length × base_factor × chain_multiplier × canastra_bonus`.
- Base factor increases by +1 **after every sequence cleared** (global, persistent for the run).

### Chain Multiplier
- If the player clears sequences **back-to-back** without any non-clear action in between, apply a chain multiplier:
  - 1st clear: ×1
  - 2nd clear: ×2
  - 3rd clear: ×3
  - ...and so on.
- Any move, swap, or bomb **resets the chain** to ×1.

### Canastra (Length 7)
- **Clean canastra** (no jokers): **double the base value**.

### Example
Three consecutive clears of lengths 3, 5, 4 with no moves between:
- `3 × 10 × 1`
- `5 × 11 × 2`
- `4 × 12 × 3`
Note: Base increments immediately after scoring the current sequence.

---

## Special Cards
### Swapper Cards (10 per 108)
- Tagged in the UI.
- Tap a swapper, then tap any other card → swap positions.
- After use, **only the tapped swapper** loses special status.
- Swapping with a bomb does not alter the bomb status.
- Swapping with another swapper does not remove the other swapper’s status.
- Adjacent swapper cards moved via normal 1-tile swap do **not** lose swapper status.
- Swappers can participate in sequences as their normal rank/suit; if cleared in a sequence they are removed like any other card.

### Free Swaps (3 total)
- Tap “Swap” button, then select two cards to swap.
- Uses one charge; no replenishment in the prototype.

### Bomb Cards (10 per 108)
- Tagged in the UI.
- Double tap bomb to clear itself only (no splash).
- Bomb clear yields **no points**.
- Bombs can participate in sequences as their normal rank/suit; if cleared in a sequence they are removed like any other card.

### Free Bombs (3 total)
- Tap “Bomb” button, then double tap any card to clear it.
- Uses one charge; no replenishment in the prototype.

### Bomb vs Sequence
- If a bomb is cleared via sequence selection, it does **not** trigger its bomb effect.
- If the bomb is double-tapped first, it triggers normally.

---

## Input & UX
- **Mobile-only.**
- Primary interaction: tap adjacent cards to swap.
- Sequence selection: drag to select, then double tap to clear.
- No hints or tutorial for the prototype.
- Prototype loads directly into an active match (no main menu/lobby screen).

---

## Persistence
No persistence in the prototype (scores and stats are not saved).

---

## Systems Plan (Prototype Architecture)
### State Model
- **Grid:** 7×7 array of card objects or empty.
- **Deck:** current shuffled 108-card stack (replenishes when empty).
- **Special inventory:** `freeSwapCount = 3`, `freeBombCount = 3`.
- **Scoring:** `baseFactor = 10`, `chainMultiplier = 1`, `totalScore`.
- **Run status:** `gameOver` boolean.

### Core Modules
- **Deck Manager:** builds deck, tags 10 swapper + 10 bomb cards (no overlap), shuffles, and deals.
- **Grid Manager:** handles swaps, clears, gravity, and spawn placement in lowest available row.
- **Sequence Validator:** validates straight-line selections against suit + rank rules and joker limits.
- **Scoring Engine:** applies base factor, chain multiplier, and clean canastra bonus.
- **Input Controller:** maps taps/drag/double-tap to swaps, selections, clears, and specials.
- **UI Layer:** renders grid, selection highlights, special icons, score, and inventory counts.

### Critical Flows
- **Move flow:** swap adjacent cards → resolve gravity (if empty slots) → spawn 1 card → check game over.
- **Clear flow:** validate selection → remove cards → resolve gravity → update score and counters → spawn 1 card → check game over.
- **Bomb flow:** clear single card → resolve gravity → spawn 1 card → reset chain.

---

## Asset & UI Checklist (Prototype)
### Immediate Placeholders
- Text card labels (e.g., “A♠”, “9♥”) for early logic validation.
- Simple button states for Swap and Bomb (enabled/disabled).

### Near-Term Art Needs
- **Card faces:** 52 unique cards (can be reused across both decks).
- **Card back:** single asset.
- **Special overlays:** swapper icon, bomb icon.
- **Buttons:** swap and bomb (pressed/unpressed/disabled).
- **Selection VFX:** highlight outline and clear animation.
