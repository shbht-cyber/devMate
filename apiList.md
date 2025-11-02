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
-Post : /request/review/:status/:requestId (status = "accepted" or "rejected")

## userRouter

-Get : /user/connections
-Get : /user/requests/received
-Get : /user/feed

status = "interested" , "ignored" , "accepted" , "rejected"
