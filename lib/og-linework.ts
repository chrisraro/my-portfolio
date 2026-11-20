// The link-preview card's survey linework (app/og/[[...path]]/route.tsx),
// authored for 1200×630. Every line stays right of the words' column
// (PAD_X + TEXT_WIDTH = 840), so nothing runs behind a word or the site URL:
// contours, and the trail ending at the "you are here" dot, trail red's one
// use on the card. Here, not in the route file: a route may export only its
// handler and route options.
export const PAD_X = 80
export const TEXT_WIDTH = 760
// Gap between title words, in px at the 68px title: the face's own space plus
// the capitals' side bearings read wide, so the words are set one by one.
export const TITLE_WORD_GAP = 9

export const CONTOURS = [
  'M 860 0 C 900 80 980 120 1060 140 S 1170 190 1200 200',
  'M 960 0 C 990 50 1050 80 1110 92 S 1180 110 1200 112',
  'M 880 630 C 900 540 960 470 1040 430 S 1170 330 1200 300',
  'M 960 630 C 980 560 1030 510 1100 480 S 1180 410 1200 395',
  'M 1040 630 C 1060 590 1100 560 1150 545 S 1190 530 1200 528',
]
export const TRAIL = 'M 900 630 C 930 560 980 500 1030 440 S 1100 330 1120 300'
export const HERE = { cx: 1120, cy: 300, r: 11 }
