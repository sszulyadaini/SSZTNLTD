# S S ZULYADAINI TECHNOVA LTD website

This is a dependency-free, multi-page static website built with HTML, CSS and JavaScript.

## Run locally

1. Install Python 3 if it is not already available.
2. Open PowerShell in this folder.
3. Start a local static server:

   ```powershell
   python -m http.server 8000
   ```

4. Visit `http://localhost:8000/` in a browser.
5. Stop the server with `Ctrl+C`.

There is no package installation or production build step.

## Update company information

Edit [company-config.js](./company-config.js). Verified company and founder names and the supplied mission are included. Unknown email, telephone, WhatsApp, address, CAC number, domain, social URLs and image paths are intentionally empty. Do not publish unverified values.

The contact and service-request pages read the configured business email when creating an email draft. The other contact details remain hidden until supplied. The visible company copy in the HTML should also be reviewed if the registered name or approved wording changes.

## Forms and privacy

Contact, service-request and feedback forms currently validate in the browser and prepare an email draft. They do not transmit form data to a server or store it. The forms are not a live submission service; a verified recipient must be configured, and the visitor must review and send the draft.

Before production, connect a backend or chosen form service. Add server-side validation, spam controls, rate limiting, secure secret management and email notifications there; never put private credentials in front-end files. Update the privacy policy to match the actual provider, data handling, retention and hosting configuration. Do not present a form as live until the endpoint is configured and tested.

## Deploy

Upload the static files to a static web host configured to serve `index.html` and return `404.html` for missing pages. Configure HTTPS and appropriate security headers at the host. No production domain has been supplied, so canonical URLs and an absolute sitemap are not configured. Add them after the final domain is confirmed.

## Project structure

- HTML files: individual pages and service details
- `styles.css`: shared responsive styles and themes
- `script.js`: navigation, carousel, theme controls, portfolio filters and draft forms
- `company-config.js`: verified company details and intentionally blank values awaiting confirmation
- `README.md`: setup and deployment notes
