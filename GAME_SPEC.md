# Match Kings — Game Spec v1

## 1. Overview

Match Kings is a single-player, mobile-first card puzzle game built on a 7×7 grid.

The board starts full of cards. The player selects two cards and, if the move is legal, merges them into a single higher-value card placed in the second selected card’s slot. The first selected card’s slot becomes empty. Over time, the player tries to create Kings, then merge Kings together to clear them from the board.

The puzzle goal is to clear the entire board.

This prototype is focused on validating the core puzzle loop only:

no score

no boosters/specials in play

no gravity

no persistence

no hints

no tutorial

## 2. Core Objective

The player wins by clearing all cards from the board.

The player loses only if:

the Draw pile is empty

there are still cards remaining on the board

and there are no legal merges remaining

If the board becomes empty at any point, the player wins immediately, regardless of how many cards remain in the Draw pile.

## 3. Board Setup

### Grid

Board size: 7×7

### Initial Board State

All 49 slots are filled at level start.

### Visual State

Empty slots remain visible as part of the table layout, but should fade into the felt/table background rather than feeling like broken holes.

If a new card is drawn into an empty slot, that slot should visually fade back in as occupied.

## 4. Cards

### 4.1 Card Set

Use traditional playing card visuals already present in the Solitaire Crush project.

Included suits:

Spades

Diamonds

Included ranks:

Ace

2

3

4

5

6

7

8

9

10

Jack

Queen

King

Excluded:

No Jokers

No special cards active in gameplay for this prototype

### 4.2 Suit Color Groups

Legal merge matching is based on suit color, not exact suit.

In this prototype there is one suit per color group:

Red group: Diamonds

Black group: Spades

This means:

Diamonds can only merge with Diamonds

Spades can only merge with Spades

Red cannot merge with Black

### 4.3 Rank Values

For merge calculations, card values map as:

Ace = 1

2 = 2

3 = 3

4 = 4

5 = 5

6 = 6

7 = 7

8 = 8

9 = 9

10 = 10

Jack = 11

Queen = 12

King = 13

## 5. Legal Merge Rules

### 5.1 General Merge Legality

A merge is legal if:

both selected cards currently exist on the board

both cards are of the same suit color group

the move obeys the King exception rules below

Important

Distance does not matter

Adjacency does not matter

Card position does not affect legality

Empty slots cannot be selected as merge targets

### 5.2 Normal Merge Rule

Any two non-King cards of the same suit color may be merged.

Examples:

4♦ + 5♥ = legal

9♣ + 2♠ = legal

7♥ + 10♣ = illegal

### 5.3 King Exception Rule

Kings have special merge behavior:

A King may only merge with another King

Any King may merge with any other King regardless of suit or suit color

Examples:

K♥ + K♦ = legal

K♠ + K♣ = legal

K♥ + K♣ = legal

K♥ + 3♥ = illegal

K♣ + Q♠ = illegal

## 6. Merge Result Rules

### 6.1 Destination Slot

When two cards merge:

the second selected card’s slot becomes the result slot

the first selected card disappears

the first selected card’s slot becomes empty

### 6.2 Result Suit

The resulting card always takes the suit of the second selected card.

Examples:

Tap 4♦ then 5♥ → result appears as 9♥

Tap 5♥ then 4♦ → result appears as 9♦

### 6.3 Result Rank

Use cyclical addition over the 1–13 rank sequence:

Ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, then back to Ace.

Equivalent formula:

((A + B - 1) mod 13) + 1

Examples:

4 + 5 = 9

9 + 2 = Jack

8 + 5 = King

Jack + 3 = Ace

Queen + 2 = Ace

King + King = special clear case, not normal rank output

### 6.4 King + King Clear

If two Kings are merged:

both Kings disappear

both involved board slots become empty

no replacement card is created

For animation/VFX purposes, the second selected slot is the main presentation anchor.

## 7. Board Behavior After Merge

There is no gravity in Match Kings.

After any merge:

empty slots remain where they are

cards do not fall

cards do not slide

columns do not collapse

no automatic refill occurs

The only way a new card enters the board is via Draw.

This is a deliberate departure from the original Solitaire Crush prototype, which uses gravity, collapse, and automatic card drops after actions.

GAME_SPEC

## 8. Draw System

### 8.1 Draw Pile

Each level starts with a 10-card Draw pile.

The remaining Draw count must always be visible to the player.

### 8.2 When Draw Can Be Used

The player may use Draw at any time, as long as:

the Draw pile still has cards remaining

and at least one empty slot exists on the board

Draw is not restricted to “no moves available” situations. It is a strategic tool.

### 8.3 Blocked Draw

If the player taps Draw and there are no empty slots:

Draw does not happen

no card is consumed

show message in the existing lower-left instruction text area:

“There are no empty slots!”

### 8.4 Draw Placement

When Draw is used:

consume 1 card from the Draw pile

evaluate which suits are currently present on the board

if a suit has been completely eliminated from the board, it cannot be drawn

choose one empty slot at random

all empty slots have equal probability

place the drawn card into that slot

### 8.5 Draw Animation

The drawn card should animate:

from the Draw pile UI

into the selected empty slot

## 9. Random Generation

### 9.1 Level Seed Model

Each level should be generated as a prebuilt level seed at start.

That seed contains:

initial 7×7 board contents

10-card Draw pile contents

This is preferred over purely on-demand random generation because it gives reproducibility for debugging, balancing, and design iteration.

### 9.2 Rank Probability

Generation is fully random, except for a reduced King chance.

Rank odds

King: 2%

All other 12 ranks combined: 98%, evenly distributed

So each non-King rank has:

98% / 12 = 8.166666...%

### 9.3 Suit Probability

Suit selection is uniform:

Spades: 50%

Diamonds: 50%

During Draw, suit output is filtered to only suits currently present on the board.

### 9.4 Joker Rule

Jokers are never generated

not on the board

not in the Draw pile

### 9.5 Solvability

For prototype v1:

no need to guarantee solvability

no need to solver-check boards

no need to guarantee strong puzzle quality beyond rule correctness

## 10. Win / Loss Logic

### 10.1 Win Check

Check for win whenever board state changes.

If all board slots are empty, player wins immediately.

### 10.2 Loss Check

Loss only matters when:

Draw pile is empty

and the board is not empty

At that point, determine whether any legal merge remains.

If no legal merges remain, player loses.

If legal merges still exist, play continues.

### 10.3 Legal Move Detection

A legal move exists if either:

there are at least two non-King cards of the same color group anywhere on the board

or there are at least two Kings anywhere on the board

Because:

non-Kings require same-color matching

Kings can merge with any Kings regardless of suit color

This check should be implemented explicitly for end-state validation.

## 11. Input & Controls

The current Solitaire Crush prototype is already mobile-first and already has an input/controller layer that can be repurposed for this interaction model.

GAME_SPEC

### 11.1 Primary Input

Primary merge input:

tap card A

tap card B

if legal, execute merge

### 11.2 Drag Input

Also support:

drag card A

release over card B

if targeting is valid, execute merge

### 11.3 Drag Snap Rule

For drag-to-merge targeting:

if dragged card overlaps target card area by 66% or more, snap/resolve to that target

otherwise do not merge

### 11.4 Selection Behavior

When first card is selected:

highlight it clearly

wait for second selection or cancellation

### 11.5 Cancel Behavior

A pending selection can be canceled by:

tapping the selected card again

tapping outside the cards / on non-card space

### 11.6 Invalid Target Behavior

If card A is selected and player taps an invalid card B:

show invalid feedback on B only

do not keep A selected

return immediately to neutral state

## 12. UX Feedback

### 12.1 Legal Selection Feedback

For v1, selection should be readable and calm:

clear selection highlight

keep prototype tabletop tone

no hints

### 12.2 Invalid Move Feedback

For invalid target selection:

red highlight on target card

tiny shake on target card

No sound.
No haptics.
No ambient motion.

### 12.3 Visual Clarity Priorities

Since rules are based on red vs black suit grouping, readability should emphasize suit color strongly enough for play comprehension, while still using normal playing card visuals.

Do not over-engineer extra color-group UI treatment in v1 unless playtesting reveals confusion.

## 13. Merge Animation Rules

### 13.1 Normal Merge Animation

When a valid non-King merge happens:

first selected card resolves away

second selected card begins rank-up transformation

card face transitions through +1 rank increments until final value is reached

use full card-face swaps for each intermediate rank

at final card:

slight lift toward the player

360 horizontal flip

soft settle back down

Tone target:

satisfying

polished

still calm / tabletop, not arcade-heavy

### 13.2 King Creation Animation

If a merge result becomes a King:

apply a gold rim glow from the start of the rank-up sequence until the end

then finish with:

slight upward lift

360 horizontal flip

soft settle/bounce

subtle crown/sparkle accent if easy to implement

The key design goal is that the player immediately understands:
“I created something important.”

### 13.3 King + King Clear Animation

When two Kings merge:

both vanish

use a more celebratory royal burst effect

anchor presentation around the second selected slot

can later be upgraded into a more screen-centered special VFX pass

Prototype tone should still remain readable and not overly noisy.

## 14. UI Requirements

### 14.1 Required UI

7×7 board

card visuals

selection highlight

Draw button

Draw pile remaining count badge

lower-left instructional / system text area

restart button

win screen

loss screen

next level button after win

retry button after loss

### 14.2 Level Flow

Prototype is level-based.

For v1:

completing a level goes to another randomized level using the same rules

losing allows retry

restart should also be available during play

No menu/lobby required for prototype.

## 15. Systems / State Model

Suggested prototype state:

grid[7][7] → card or empty

drawPile[] → prebuilt 10-card list

selectedCard → optional board position/card ref

gameState → playing / win / lose

messageText → lower-left feedback string

levelSeed → seed or generated payload used to build initial board + draw pile

Each card should minimally store:

rank

suit

color group

board position

No score state needed.
No special inventory needed.
No deck regeneration needed.

This is much simpler than the current Solitaire Crush prototype state model, which includes deck flow, special inventory, score, chain multiplier, and gravity-driven move resolution.

GAME_SPEC

## 16. Implementation Notes vs Solitaire Crush

The forked Solitaire Crush codebase should be adapted as follows:

### 16.1 Keep / Reuse

Likely reusable:

grid rendering

card visuals

card prefab/view setup

input controller shell

UI layer shell

mobile-first layout

general table/felt presentation

These are all aligned with the current prototype architecture.

GAME_SPEC

### 16.2 Remove / Bypass

Disable or remove from active gameplay:

sequence validator

sequence drag-clear logic

adjacency swap move loop

gravity resolution

column collapse

spawn-in-lowest-row flow

score system

chain multiplier

bomb behavior

swapper behavior

free swap/free bomb inventory

deck depletion/rebuild gameplay loop

joker logic

wildcard 2 logic

These belong to the original Solitaire Crush prototype rules and should not drive Match Kings v1.

GAME_SPEC

### 16.3 Hide, Don’t Destroy

Special-card-related code can remain in the codebase but should be:

disabled

hidden from UI

commented or isolated clearly

Reason:
you may revisit specials later in the prototype.

## 17. Prototype Success Criteria

This prototype succeeds if it answers:

Is the merge loop understandable?

Is creating Kings satisfying?

Is King-clearing satisfying?

Is the Draw system strategically interesting?

Does the game feel fun enough to justify deeper balancing and puzzle design later?

It does not need to prove:

long-term economy

progression

scoring

puzzle solvability guarantees

production UX polish

final art direction

## 18. Non-Goals for v1

Do not spend time in v1 on:

hints

tutorialization

audio

haptics

advanced VFX polish

progression curves

mathematically curated boards

deck realism balancing

score systems

live ops or persistence

Validate fun first.

If you want, the next best artifact is a Codex implementation brief that turns this into:

core classes/modules to edit

pseudocode for merge resolution

legal move detection logic

level seed generator logic

UI event flow for tap and drag interactions
