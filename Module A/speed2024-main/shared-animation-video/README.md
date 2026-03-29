# Shared Animation Video

> Module: C - Front-End Development / Difficulty: Difficult

Eight videos are provided. Each video plays automatically on an infinite loop at a 16/9 ratio. When you click on a video, it redirects to the video page.

When transitioning between pages, the following conditions must be met:
- Page reload should not occur. (SPA)
- The currently playing video should not be reset or flicker.
- Videos other than the selected one should fade in/out naturally.
- The video page should display the video in full screen. When the video is clicked again, it should transition back to the initial list page.
- Scrolling on the list page or refreshing on the video page should work the same.

An .htaccess file is provided to enable page navigation without using server-side code. Use this file to ensure the video continues playing even when refreshing on the video page.

(Refer to demo.mp4)

---

> Marking aspect:
- On the list page, the 8 videos provided are played in proportion to 16/9. 0.30
- When you click on a video on the list page, the area around the video becomes blurred and the video goes full screen with the same transition effect as demo.mp4. 0.50
- When the video switches to full screen, the video does not reset or blink. 0.50
- If you refresh the video in full screen mode, the video will play in full screen mode. 0.30
- When you click on a video in full screen mode, it moves to the list page and the all videos plays again. 0.40

---

> To scm:

The .htaccess file should be modified to suit the competition environment.