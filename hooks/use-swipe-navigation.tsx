import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDrag } from '@use-gesture/react';

/**
 * Hook para navegação por swipe entre rotas principais.
 * @param routes Array de rotas principais (ex: ['/analytics', '/billing', ...])
 */
export function useSwipeNavigation(routes: string[]) {
  const router = useRouter();
  // Descobre a rota atual
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentIndex = routes.findIndex((r) => currentPath.startsWith(r));

  const goTo = useCallback(
    (dir: 'left' | 'right') => {
      if (currentIndex === -1) return;
      let nextIndex = dir === 'left' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0) nextIndex = routes.length - 1;
      if (nextIndex >= routes.length) nextIndex = 0;
      router.push(routes[nextIndex]);
    },
    [currentIndex, routes, router]
  );

  // Bind para usar em qualquer container
  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX === 1) goTo('right');
    if (swipeX === -1) goTo('left');
  }, { axis: 'x', filterTaps: true });

  return bind;
}
