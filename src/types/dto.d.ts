declare type UserDto = {
  uuid: string;
  created_at: string;
};

declare type LinkDto = {
  uuid: string;
  user_uuid: string;
  created_at: string;
  updated_at: string;
  alias: string;
  value: string;
};
