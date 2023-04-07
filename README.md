# Messages for Web 2FA Interceptor
Firefox addon to intercept 2FA SMS notifications from Google's [Messages for web](https://messages.google.com) notification and copies them to your clipboard.

### Is this secure?
Any attacker who has access to your computer would already be able to access 2FA codes manually,
it is a marginally worse idea than just having access to SMS from your computer.
### How does this work?

On the Message for web page, `window.Notification` is proxied so we can observe whenever there's a notification. This proxy code runs in the context of the page, so we need to use `window.postMessage` to move this information around the app.

Autofill works via various incantations of triggering events, most of which apparently first appeared in 1Password's extension, but which I used [Bitwarden addon client](https://github.com/bitwarden/clients/blob/master/apps/browser/src/autofill/content/autofill.js) as a my reference source for.

### todo
 - [ ] customizable regex code extraction
 - [ ] automatically enter codes into web pages