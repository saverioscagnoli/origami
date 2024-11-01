import { customCreate } from "..";

type CreatingState = {
  state: boolean;
  isDir: boolean;
  set: (
    partial:
      | CreatingState
      | Partial<CreatingState>
      | ((state: CreatingState) => CreatingState | Partial<CreatingState>)
  ) => void;
};

const useCreating = customCreate<CreatingState>(set => ({
  state: false,
  isDir: false,
  set: partial =>
    set(state => {
      const newState = typeof partial === "function" ? partial(state) : partial;
      return { ...state, ...newState };
    })
}));

export { useCreating };
