# PixelHeart APIs

- POST /signup
- POST /login
- POST /logout

- GET /profile/view
- PATCH /profile/update
- PATCH /profile/password

STATUS - interested or ignored, accepted or rejected

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestId

- GET /connections
- GET /requests/received
- GET /feed