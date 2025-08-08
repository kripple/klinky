import type {
  Dispatch,
  ReactNode as ReactNodeType,
  SetStateAction,
} from 'react';

export type { ReactNodeType };

export type SetState<T> = Dispatch<SetStateAction<T>>;
