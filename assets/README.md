# Prototype Asset Naming

This folder documents the expected asset paths when switching the prototype to sprite rendering.

## Card Faces
Place card face images in:

```
assets/cards/<rank>_of_<suit>.png
```

Where:
- `<rank>` is `a,2,3,4,5,6,7,8,9,10,j,q,k`
- `<suit>` is `spades, hearts, diamonds, clubs`

Examples:
- `assets/cards/a_of_spades.png`
- `assets/cards/10_of_hearts.png`
- `assets/cards/k_of_diamonds.png`

## Jokers
Use:

```
assets/cards/joker.png
```

## Special Overlays (optional)
If/when you add icon overlays, place them in:

```
assets/icons/bomb.png
assets/icons/swapper.png
```

The current build keeps text badges as a fallback.
