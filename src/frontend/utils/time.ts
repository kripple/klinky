import { formatDistanceToNow, parseISO } from 'date-fns';

export const relativeTime = (dateISOString: string) => {
  const date = parseISO(dateISOString);
  return formatDistanceToNow(date, { addSuffix: true });
};
