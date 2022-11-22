# Messages for Web 2FA Interceptor
Firefox addon to intercept 2FA SMS notifications from Google's [Messages for web](https://messages.google.com) notification and copies them to your clipboard.

### Is this secure?
Any attacker who has access to your computer would already be able to access 2FA codes manually,
it is a marginally worse idea than just having access to SMS from your computer.
### How does this work?

In the Message for web page, `window.Notification` is proxied so we can observe whenever there's a notification. From this we are able to extract a 2FA code, which we can then automatically copied.

### todo
 - [ ] customizable regex code extraction
 - [ ] automatically enter codes into web pages