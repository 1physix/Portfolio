const homeView = document.querySelector("#home-view");
const projectsView = document.querySelector("#projects-view");
const detailView = document.querySelector("#detail-view");
const projectList = document.querySelector("#project-list");
const blogView = document.querySelector("#blog-view");
const tabs = document.querySelectorAll("[data-tab]");

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
}

function technologyList(project) {
  const stack = element("ul", "stack");
  stack.setAttribute("aria-label", "Technologies");
  for (const technology of project.stack ?? []) {
    stack.append(element("li", "", technology));
  }
  return stack;
}

function projectCard(project) {
  const card = element("a", "project");
  card.href = `#projects/${project.id}`;
  const arrow = element("span", "card-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  card.append(
    arrow,
    element("p", "eyebrow", project.category),
    element("h2", "", project.title),
    element("p", "project-summary", project.summary),
    technologyList(project),
  );
  return card;
}

function renderDetail(project) {
  const back = element("a", "back-link", "← All projects");
  back.href = "#projects";
  const title = element("h1", "", project.title);
  title.id = "detail-title";
  title.tabIndex = -1;

  detailView.replaceChildren(
    back,
    element("p", "eyebrow", project.category),
    title,
    element("p", "lede", project.summary),
    technologyList(project),
  );

  if (project.image) {
    const image = element("img", "project-image");
    image.src = project.image.src;
    image.alt = project.image.alt;
    detailView.append(image);
  }

  if (project.notes) {
    detailView.append(element("h2", "", "Build notes"), element("p", "build-notes", project.notes));
  }

  if (project.links?.length) {
    const links = element("ul", "project-links");
    for (const link of project.links) {
      const item = element("li");
      const anchor = element("a", "", link.label);
      anchor.href = link.url;
      item.append(anchor);
      links.append(item);
    }
    detailView.append(links);
  }
  if (project.source) {
    const codeBlock = element("pre", "project-code");
    codeBlock.append(element("code", "", project.source.code));
    detailView.append(element("h2", "", project.source.path), codeBlock);
  }
  return title;
}

function showRoute(moveFocus = false) {
  const route = location.hash.slice(1);
  const [section, projectId] = route.split("/");
  const showProjects = section === "projects";
  const project = showProjects && projects.find(item => item.id === projectId);
  const showBlog = section === "blog";
  homeView.hidden = showProjects || showBlog;
  blogView.hidden = !showBlog;
  projectsView.hidden = !showProjects || Boolean(project);
  detailView.hidden = !project;

  for (const tab of tabs) {
    const active = tab.dataset.tab === (showProjects ? "projects" : showBlog ? "blog" : "home");
    if (active) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  }

  const viewTitle = project?.title || (showProjects ? "Projects" : showBlog ? "Blog" : "");
  document.title = viewTitle ? `${viewTitle} · Ishaq Hussain` : "Ishaq Hussain";
  const headingId = showProjects ? "#project-title" : showBlog ? "#blog-title" : "#intro";
  const heading = project ? renderDetail(project) : document.querySelector(headingId);
  if (moveFocus) {
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

if (projects.length) {
  projectList.append(...projects.map(projectCard));
} else {
  projectList.append(element("p", "", "Project write-ups are on the way."));
}
window.addEventListener("hashchange", () => showRoute(true));
showRoute();


const themeToggle = document.querySelector(".theme-toggle");
const themeRoot = document.documentElement;
const themeKey = "portfolio-theme";

function setTheme(dark) {
  themeRoot.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

try {
  setTheme(localStorage.getItem(themeKey) === "dark");
} catch {
  setTheme(false);
}

themeToggle.addEventListener("click", () => {
  themeRoot.classList.add("animate-theme");
  setTheme(themeRoot.dataset.theme !== "dark");
  try {
    localStorage.setItem(themeKey, themeRoot.dataset.theme);
  } catch {
    // The theme still works when browser storage is unavailable.
  }
});
