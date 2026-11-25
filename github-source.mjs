const MAX_SOURCE_BYTES = 100_000;

export async function getGitHubSource(repositoryUrl, filePath, fetchSource = fetch) {
  const url = new URL(repositoryUrl);
  const repo = url.pathname.match(/^\/([\w.-]+)\/([\w.-]+?)\/?$/);
  if (url.origin !== "https://github.com" || url.username || url.password || !repo) {
    throw new Error("Enter a GitHub repository URL.");
  }

  const path = filePath.trim().split("/");
  if (path.some(part => !part || part === "." || part === ".." || /[\\\x00-\x1f]/.test(part))) {
    throw new Error("Enter the main file’s path relative to the repository root.");
  }

  const owner = encodeURIComponent(repo[1]);
  const name = encodeURIComponent(repo[2].replace(/\.git$/, ""));
  const file = path.map(encodeURIComponent).join("/");
  const endpoint = `https://api.github.com/repos/${owner}/${name}/contents/${file}`;
  const response = await fetchSource(endpoint, { headers: { Accept: "application/vnd.github+json" } });
  if (response.status === 404) throw new Error("That file was not found in the public repository’s default branch.");
  if (!response.ok) throw new Error("GitHub could not return the source file. Try again shortly.");

  const data = await response.json();
  if (data.type !== "file" || data.encoding !== "base64" || typeof data.content !== "string") {
    throw new Error("Choose a source file in the repository.");
  }
  if (data.size > MAX_SOURCE_BYTES || data.content.length > MAX_SOURCE_BYTES * 1.5) {
    throw new Error("Choose a source file under 100 KB.");
  }

  const bytes = Uint8Array.from(atob(data.content), character => character.charCodeAt(0));
  const source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (source.includes("\x00")) throw new Error("Choose a plain text source file.");
  return source;
}
