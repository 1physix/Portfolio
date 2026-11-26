import { getGitHubSource } from "../github-source.mjs";

const form = document.querySelector("#project-form");
const fields = form.elements;
const status = document.querySelector("#editor-status");
const output = document.querySelector("#editor-output");
const preview = document.querySelector("#source-preview");
const download = document.querySelector("#download-projects");
const submit = form.querySelector("button");
let downloadUrl;
let revision = 0;

try {
  document.documentElement.dataset.theme = localStorage.getItem("portfolio-theme") || "light";
} catch {
  // The editor can still be used when storage is unavailable.
}

function repositoryLink(project) {
  return project?.links?.find(link => link.label === "GitHub repository");
}

function invalidateExport() {
  revision++;
  output.hidden = true;
  status.textContent = "";
}

for (const project of projects) {
  fields.project.add(new Option(project.title, project.id));
}

form.addEventListener("input", invalidateExport);
fields.project.addEventListener("change", () => {
  invalidateExport();
  const project = projects.find(item => item.id === fields.project.value);
  fields.title.value = project?.title ?? "";
  fields.description.value = project?.summary ?? "";
  fields.repository.value = repositoryLink(project)?.url ?? "";
  fields.path.value = project?.source?.path ?? "";
  submit.textContent = project ? "Prepare project update" : "Preview and prepare project";
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const { title, description, repository, path } = Object.fromEntries(
    [...new FormData(form)].map(([key, value]) => [key, value.trim()]),
  );
  const existing = projects.find(item => item.id === fields.project.value);
  const previousLink = repositoryLink(existing);
  invalidateExport();
  const submittedRevision = revision;

  if (!title || !description || (path && !repository)) {
    status.textContent = "Enter a title and description, and provide a repository if you enter a source file path.";
    return;
  }

  submit.disabled = true;
  try {
    if (repository && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/i.test(repository)) {
      throw new Error("Enter a public GitHub repository URL.");
    }

    let source = existing?.source;
    if (path && (path !== source?.path || repository !== previousLink?.url)) {
      status.textContent = "Fetching source from GitHub…";
      source = { path, code: await getGitHubSource(repository, path) };
    } else if (!path) {
      source = undefined;
    }

    if (revision !== submittedRevision) return;

    let id = existing?.id;
    if (!id) {
      const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
      id = base;
      for (let suffix = 2; projects.some(project => project.id === id); suffix++) {
        id = `${base}-${suffix}`;
      }
    }

    const links = (existing?.links ?? []).filter(link => link !== previousLink);
    if (repository) links.unshift({ label: "GitHub repository", url: repository });
    const project = { ...existing, id, title, summary: description, source, links };
    const updated = existing ? projects.map(item => item.id === id ? project : item) : [...projects, project];

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([`const projects = ${JSON.stringify(updated, null, 2)};\n`], { type: "text/javascript" }));
    download.href = downloadUrl;
    preview.textContent = source?.code ?? "";
    preview.parentElement.hidden = !source;
    output.querySelector("h2").hidden = !source;
    output.hidden = false;
    status.textContent = existing ? "Project update ready to download." : "Project ready to download.";
  } catch (error) {
    if (revision === submittedRevision) status.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});
