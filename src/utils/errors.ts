export const HttpStatus = {
  '400 Bad Request': '400 Bad Request',
  '403 Forbidden': '403 Forbidden',
  '404 Not Found': '404 Not Found',
  '500 Internal Server Error': '500 Internal Server Error',
  '503 Service Unavailable': '503 Service Unavailable',
} as const;

export const HttpStatusCodes = {
  '400 Bad Request': 400,
  '403 Forbidden': 403,
  '404 Not Found': 404,
  '500 Internal Server Error': 500,
  '503 Service Unavailable': 503,
} as const;
