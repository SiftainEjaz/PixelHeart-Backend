# PixelHeart APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/update
- PATCH /profile/password

STATUS - interested or ignored, accepted or rejected

## connectionRequestsRouter
- POST /request/send/:status/:toUserId [status = "interested" or "ignored"]
- PATCH /request/review/:status/:fromUserId [status : "accepted" or "rejected"]

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed