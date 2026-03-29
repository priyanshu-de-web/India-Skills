# Realtime Chat

> Module: D - Back-End Development / Difficulty: Normal

You need to create a real-time chat app divided into Front-end and Back-end.

Using the provided Front-end and Back-end templates and socket, you should be able to send messages to the currently connected users.

Differentiate between your messages and messages from others, and the input field should be cleared after sending a message.

(node_modules are provided in a compressed file. Be sure to refer to README.md)

## Deploy
- Back-end will run the server by executing the `npm run start` command for testing.
- Front-end must operate when accessing the specified URL. `/xx_module_a/realtime_chat`

> Marking aspect:
- It was developed separately into back-end and front-end. 0.20
- Front-end used the given file. 0.10
- Back-end and front-end communicate through socket.io, a given package. 0.20
- When you enter a message in the front-end, the message is sent to all currently connected users and can be viewed in real time. 0.40
- After sending the message, the input window will be blank. 0.10

> To SCM

The URL specified in the distribution method must be adjusted to suit the server environment.
