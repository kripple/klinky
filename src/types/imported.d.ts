declare type AppDatabase = import('@/types/database').AppDatabase;

declare type FormEvent =
  import('@/types/events').ReactFormEvent<HTMLFormElement>;

declare type ChangeEvent =
  import('@/types/events').ReactChangeEvent<HTMLInputElement>;

declare type ClickEvent = import('@/types/events').ReactMouseEvent<
  HTMLInputElement,
  MouseEvent
>;

declare type ReactNode = import('@/types/react').ReactNodeType;

declare type SetState<T> = import('@/types/react').SetState<T>;
