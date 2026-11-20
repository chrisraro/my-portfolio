// Authored contour linework for the trailhead (spec §3). Coordinates are in a
// 1440 x 900 viewBox; the field scales with its container. Decorative only.
export const trailheadContours: string[] = [
  'M760 820 C900 600 1000 560 1180 520 S1420 420 1440 380',
  'M780 860 C930 640 1040 600 1210 560 S1430 470 1440 440',
  'M700 900 C860 700 980 660 1150 620 S1400 540 1440 520',
  'M820 760 C960 560 1060 520 1200 480 S1400 380 1440 330',
  'M860 700 C990 520 1080 480 1220 440 S1400 330 1440 280',
  'M640 900 C800 760 940 720 1120 690 S1380 620 1440 610',
  'M1080 620 C1160 560 1300 560 1360 640',
  'M1100 660 C1170 610 1290 610 1340 680',
]

// The red trail leaving the trailhead plate toward the first waypoints.
export const trailheadTrail = {
  d: 'M1290 570 C1180 640 1060 700 960 760 S760 830 640 812',
  viewBox: '0 0 1440 900',
}

// Short stretches of the trail between homepage sections, alternating
// direction so the trail zigzags down the page. 1440 x 120; the box crops the
// sides on a phone, so each curve crosses the middle.
export const trailSegments = [
  { d: 'M1040 0 C1040 60 400 60 400 120', viewBox: '0 0 1440 120' },
  { d: 'M400 0 C400 60 1040 60 1040 120', viewBox: '0 0 1440 120' },
] as const

// The elevation strip's ridge line, rising toward now. Stretched to the strip.
export const elevationProfile = {
  d: 'M0 50 C90 48 150 40 230 42 S380 30 470 34 S640 18 730 24 S900 8 1000 12 S1110 4 1152 2',
  viewBox: '0 0 1152 56',
}
