import { atom, onMount, computed } from 'nanostores';

const prefersReducedMotionAtom = atom<boolean | undefined>(undefined);

onMount(prefersReducedMotionAtom, () => {
  if (typeof window === 'undefined') return;

  const query = window.matchMedia('(prefers-reduced-motion: reduce)');

  const updateMotion = () => prefersReducedMotionAtom.set(query.matches);
  updateMotion();

  query.addEventListener('change', updateMotion);
  return () => query.removeEventListener('change', updateMotion);
});

export const prefersReducedMotionStore = computed(prefersReducedMotionAtom, (value) => value ?? false);
