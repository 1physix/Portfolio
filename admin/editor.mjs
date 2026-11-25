import { getGitHubSource } from "../github-source.mjs";

const form = document.querySelector("#project-form");
const status = document.querySelector("#editor-status");
const output = document.querySelector("#editor-output");
const preview = document.querySelector("#source-preview");
const download = document.querySelector("#download-projects");
const submit = form.querySelector("button");
let downloadUrl;

try {
  document.documentElement.dataset.theme = localStorage.getItem("portfolio-theme") || "light";
} catch {
  // The editor can still be used when storage is unavailable.
}

form.addEventListener("input", () => {
  output.hidden = true;
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const fields = new FormData(form);
  const title = fields.get("title").trim();
  const summary = fields.get("description").trim();
  const repository = fields.get("repository").trim();
  const path = fields.get("path").trim();
  output.hidden = true;

  if (!title || !summary) {
    status.textContent = "Enter a title and description.";
    return;
  }

  submit.disabled = true;
  status.textContent = "Fetching source from GitHub…";
  try {
    const code = await getGitHubSource(repository, path);
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
    let id = base;
    for (let suffix = 2; projects.some(project => project.id === id); suffix++) {
      id = `${base}-${suffix}`;
    }

    const project = { id, title, summary, source: { path, code }, links: [{ label: "GitHub repository", url: repository }] };
    const data = JSON.stringify([...projects, project], null, 2);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([`const projects = ${data};\n`], { type: "text/javascript" }));
    download.href = downloadUrl;
    preview.textContent = code;
    output.hidden = false;
    status.textContent = "Project ready to download.";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});
