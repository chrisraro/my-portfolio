// Motion's animation engine stays out of the first load. Components render
// `m.*` inside <LazyMotion features={loadMotionFeatures} strict>, so only the
// small core ships with every page; domAnimation arrives in its own chunk once
// the page has hydrated, long before anyone opens a dialog or a toast.
export const loadMotionFeatures = () => import('@/lib/motion-dom-animation').then((mod) => mod.default)
