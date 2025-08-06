declare type AppDatabase = import('@/types/database').AppDatabase;

declare type FormEvent =
  import('@/types/react').ReactFormEvent<HTMLFormElement>;

declare type ChangeEvent =
  import('@/types/react').ReactChangeEvent<HTMLInputElement>;

declare type ClickEvent = import('@/types/react').ReactMouseEvent<
  HTMLInputElement,
  MouseEvent
>;
