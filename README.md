# Subhadeep Banerjee — Portfolio (HTML / CSS / JS)

Plain website. No Node.js, no npm, no build step.

| File | What it is |
|------|------------|
| `index.html` | All page content (text, skills, experience, projects) |
| `style.css` | All design (colours and fonts are at the top, in `:root`) |
| `script.js` | Menu, animations, popups, form, and **your links at the top** |
| `favicon.svg`, `og-image.png` | Browser tab icon and social share image |
| `images/` | Optional project screenshots |

## Run on your computer

Double-click `index.html`. That's it.

Better option (auto-refresh on save): in VS Code install **Live Server** and click "Go Live", or in a terminal inside the folder run `python -m http.server` and open http://localhost:8000.
The contact form only works after uploading to Netlify.

## Fill in your details

1. Open `script.js` and edit the `CONFIG` block at the top: email, GitHub URL, LinkedIn URL, joining date. Anything left as `YOUR_...` stays hidden on the site.
2. Put your resume next to `index.html`, named exactly `resume.pdf`.
3. After deploying, replace `YOUR-SITE` in the two `og:` lines in `index.html` with your Netlify site name.

To edit text, skills, experience or projects, just edit `index.html` — each section is marked with a comment like `<!-- ===== PROJECTS ===== -->`.

## Upload to Netlify

**Drag and drop (easiest):** go to https://app.netlify.com/drop and drag this whole folder onto the page. To update later, open your site in Netlify → **Deploys** → drag the folder again.

**Through GitHub (auto-updates on every push):** push this folder to a GitHub repository, then in Netlify choose **Add new site → Import an existing project → GitHub**, pick the repo, leave the build command **empty** and the publish directory as `/` (or blank), and click **Deploy**.

**Contact form:** after the first deploy, open your site in Netlify → **Forms** → **Enable form detection**, then redeploy once. Submissions appear under Forms → contact. You can turn on email notifications there too.

## About FileZilla

FileZilla is listed in the skills because it's part of the toolkit for FTP/SFTP hosting. It isn't needed for Netlify.
