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
