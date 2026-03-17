// Stub for screen-builder — provides mock session store without zustand
const state = {
  homeUrl: undefined as string | undefined,
};

type Selector<T> = (state: typeof state) => T;

export function useSessionStore<T>(selector: Selector<T>): T {
  return selector(state);
}
