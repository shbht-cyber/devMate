# DevMate api list

## authRouter

-Post : /signup
-Post : /login
-Post : /logout

## profileRouter :

-Get : /profile/view
-Patch : /profile/edit
-Patch : /profile/edit/password

## connectionRequestRouter

-Post : /request/send/:status/:userId (status = "interested" or "ignored")
-Post : /request/review/accepted/:requestId
-Post : /request/review/rejected/:requestId

## userRouter

-Get : /user/connections
-Get : /user/requests
-Get : /user/feed

status = "interested" , "ignored" , "accepted" , "rejected"
