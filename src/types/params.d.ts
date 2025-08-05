declare type UserParams = { user_uuid: string };

declare type LinkParams = { link_uuid: string };

declare type UpdateLinkParams = UserParams & {
  link_uuid: string;
  alias: string;
};

declare type CreateLinkParams = UserParams & {
  alias?: string;
  value: string;
};
