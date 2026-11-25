# Ishaq Hussain’s portfolio

Open `index.html` in a browser to preview the site. You can also serve the folder with `python3 -m http.server 8000` and visit <http://localhost:8000>.

## Add a project

1. Open `projects.js` and copy an existing entry, including the trailing comma.
2. Give it a unique, URL-friendly `id` such as `my-project`. Fill in the title, category, summary and technology list. The Projects tab shows cards in file order. Each card opens its own shareable view at `#projects/your-id`.
3. Optionally add `notes` for a technical write-up on the project detail view. For a screenshot, save it in `images/` and add an `image` field with alternative text. Use `links` for a public repo, demo or write-up.
4. Refresh the preview and check the new card. Commit the project entry and any screenshot together when you’re ready to publish.

```js
{
  id: "my-project",
  title: "My project",
  category: "Web application",
  summary: "What it does and who it’s for.",
  stack: ["Python", "SQLite"],
  notes: "A technical choice I made and what I learned.",
  image: { src: "images/my-project.png", alt: "Describe what the screenshot shows" },
  links: [{ label: "Source code", url: "https://github.com/your-account/your-repo" }],
},
```

Omit `notes`, `image` and `links` when you don’t have them. The site needs no build step. Keep `CNAME` in the published directory for the custom domain.

## Project editor

Serve the site over HTTP and open `/admin/`. Enter a title, description, public GitHub repository URL and the main file path relative to its root. The editor fetches a snapshot of the file on the default branch for preview and includes it in the generated project list. To update that displayed code later, update the saved snapshot.

Download `projects.js` and replace the repository file through GitHub. Only an account with repository write access can publish. The editor page itself is public and has no write credentials. Start with the latest published project list before generating another file so an older export cannot overwrite newer work.
