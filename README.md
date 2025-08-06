# Klinky Link URL Shortener

- https://github.com/chingu-voyages/Handbook/blob/main/docs/guides/soloproject/soloproject.md
- https://github.com/chingu-voyages/Handbook/blob/main/docs/guides/soloproject/topics/tier_developer.md
- https://medium.com/chingu/keys-to-a-well-written-readme-55c53d34fe6d

Your Solo Project must meet these criteria:

Must include distinct files which separate the FE and BE application logic in a way the follows the Single Responsibility Principle (SRP).

If the app accesses a database it must be accessed only from the BE logic. Applications that access databases from FE logic will not be accepted.

The BE logic must implement an app-specific API that is only implemented in the BE. The FE must access the BE API to deliver services to the end user.

Applications that use technology like Firebase only for authentication are not acceptable. Apps which couple this form of authentication with application specific API are acceptable.

The FE logic must include logic developed by the Chingu that operates on the data to transform it, change it, or present it to the end user

It must implement a front-end application that accesses a back-end server that implements an API of your own design, optionally using a database such as a NoSQL DBMS like MongoDB or a SQL DBMS like PostgreSQL.

Your backend must include CRUD (if using a database) or POST/READ/UPDATE/DELETE (for APIs).

## Routes

POST   /users
GET    /users/:uuid
DELETE /users/:uuid

GET    /users/:uuid/links
POST   /users/:uuid/links
GET    /users/:uuid/links/:link_id
PATCH  /users/:uuid/links/:link_id
DELETE /users/:uuid/links/:link_id

GET    /:alias

## TODO

- How should we handle file URLs?
- Rate limit / throttle / block (by IP?) on multiple requests containing different invalid user ids (like, more than one per second). Protect against users trying to brute-force the auth.

#### netlify-cli alternativePathsFor

node_modules/netlify-cli/dist/utils/proxy.js line 167

return empty array
