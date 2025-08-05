declare type UserDto = {
  uuid: string;
  created_at: Date;
};

declare type LinkDto = {
  uuid: string;
  user_uuid: string;
  created_at: Date;
  updated_at: Date;
  alias: string;
  value: string;
};
