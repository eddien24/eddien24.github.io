import { DATA } from "./config.js";

const UI_CONSTANTS = {
  SCROLL_OFFSET: 200,
  SCROLL_BOTTOM_THRESHOLD: 50,
  COPY_FEEDBACK_DURATION_MS: 2000,
  ICONS: {
    COPY: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
    CHECK:
      '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
  },
};

async function loadContent() {
  try {
    const data = DATA;

    setupNavigation(data);
    obfuscateEmail(data.email);
    renderBio(data.bio, data.links);
    renderProjects(data.projects, data.links);
    renderPublications(data.publications, data.links, data.me);
    renderTeaching(data.teaching);
    updateLastModified();
    setupScrollSpy();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function setupNavigation() {
  const nav = document.querySelector("nav.top-nav ul");
  if (!nav) return;

  const sections = [
    { label: "Home", id: "", href: "#" },
    { label: "Publications", id: "publications", href: "#publications" },
    { label: "Projects", id: "projects", href: "#projects" },
    { label: "Teaching", id: "teaching", href: "#teaching" },
  ];

  nav.innerHTML = sections
    .map((section) => `<li><a href="${section.href}">${section.label}</a></li>`)
    .join("");

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav.top-nav");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    document.querySelectorAll("nav.top-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }
}

function setupScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav.top-nav a");

  function onScroll() {
    let current = "";

    if (window.scrollY < UI_CONSTANTS.SCROLL_OFFSET) {
      current = "";
    } else {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - UI_CONSTANTS.SCROLL_OFFSET) {
          current = section.getAttribute("id");
        }
      });
    }

    if (
      window.innerHeight + Math.round(window.scrollY) >=
      document.body.offsetHeight - UI_CONSTANTS.SCROLL_BOTTOM_THRESHOLD
    ) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) current = lastSection.getAttribute("id");
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (current === "" && href === "#") {
        link.classList.add("active");
      } else if (current && href === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll();
}

function obfuscateEmail(emailData) {
  if (!emailData || !emailData.address || !emailData.domain) return;

  const emailLink = document.querySelector("a[data-email]");
  if (emailLink) {
    const email = `${emailData.address}@${emailData.domain}`;
    emailLink.href = `mailto:${email}`;
    emailLink.setAttribute("data-email-address", email);
  }
}

function parseCollaborators(text, collaborators) {
  if (!collaborators || !text) return text;

  let result = text;

  Object.keys(collaborators).forEach((key) => {
    const collaborator = collaborators[key];
    const pattern = new RegExp(`\\[${escapeRegex(key)}\\]`, "g");
    const replacement = collaborator.url
      ? `<a href="${collaborator.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(collaborator.name)}</a>`
      : escapeHtml(collaborator.name);
    result = result.replace(pattern, replacement);
  });

  return result;
}

function renderBio(bio, collaborators) {
  const container = document.getElementById("bio-container");
  if (!container || !bio) return;

  let html = parseCollaborators(bio, collaborators);
  // Convert \n\n (paragraph breaks) to </p><p>, and single \n to <br>
  html = html.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
  // Wrap in paragraph tags if not already wrapped
  if (!html.startsWith("<p>")) {
    html = "<p>" + html + "</p>";
  }
  container.innerHTML = html;
}

function renderProjects(projects, collaborators) {
  const container = document.getElementById("projects-container");

  if (!projects || projects.length === 0) {
    container.innerHTML = "<p>No projects listed yet.</p>";
    return;
  }

  container.innerHTML = projects
    .map((project) => {
      const titleHtml = project.url
        ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.title)}</a>`
        : escapeHtml(project.title);

      const descriptionHtml = parseCollaborators(
        project.description,
        collaborators,
      );

      const linksHtml =
        project.links?.length > 0
          ? `<div class="project-links">
          ${project.links.map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join("")}
         </div>`
          : "";

      return `
      <div class="project-item">
          <h3>${titleHtml}</h3>
          <p>${descriptionHtml}</p>
          ${linksHtml}
      </div>`;
    })
    .join("");
}

// Helper for RenderPublications
function formatAuthors(authors, collaborators, yourName) {
  if (!Array.isArray(authors)) {
    if (yourName) {
      return escapeHtml(authors).replace(
        new RegExp(`\\b${escapeRegex(yourName)}\\b`),
        `<strong>${escapeHtml(yourName)}</strong>`,
      );
    }
    return escapeHtml(authors);
  }

  return authors
    .map((author) => {
      let name, url;

      if (typeof author === "string") {
        if (collaborators && collaborators[author]) {
          name = collaborators[author].name;
          url = collaborators[author].url;
        } else if (author === "self") {
          name = yourName || "You";
          url = null;
        } else {
          name = author;
          url = null;
        }
      } else if (author.name) {
        name = author.name;
        url = author.url;
      } else {
        return escapeHtml(JSON.stringify(author));
      }

      const displayName =
        name === yourName
          ? `<strong>${escapeHtml(name)}</strong>`
          : escapeHtml(name);
      return url
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${displayName}</a>`
        : displayName;
    })
    .join(", ");
}

// Helper for RenderPublications
function buildPublicationButtons(pub) {
  const buttons = [];

  if (pub.links && pub.links.length > 0) {
    buttons.push(
      ...pub.links.map(
        (link) =>
          `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`,
      ),
    );
  }
  if (pub.abstract) {
    buttons.push(
      `<button class="toggle-btn abstract-toggle">abstract</button>`,
    );
  }
  if (pub.bibtex) {
    buttons.push(`<button class="toggle-btn bibtex-toggle">bibtex</button>`);
  }

  return buttons.length > 0
    ? `<div class="publication-actions">${buttons.join("")}</div>`
    : "";
}

// Helper for RenderPublications
function buildPublicationExtras(pub) {
  let contentHtml = "";

  if (pub.abstract) {
    contentHtml += `
      <div class="publication-abstract-content">
        <p>${pub.abstract}</p>
      </div>`;
  }

  if (pub.bibtex) {
    contentHtml += `
      <div class="publication-bibtex-content">
        <button class="copy-btn" data-bibtex='${escapeBibtex(pub.bibtex)}'>
          ${UI_CONSTANTS.ICONS.COPY}
        </button>
        <code>${escapeHtml(pub.bibtex)}</code>
      </div>`;
  }

  return contentHtml;
}

function renderPublications(publications, collaborators, yourName) {
  const container = document.getElementById("publications-container");

  if (!publications || publications.length === 0) {
    container.innerHTML = "<p>No publications listed yet.</p>";
    return;
  }

  const sorted = [...publications].sort(
    (a, b) => (b.year || 0) - (a.year || 0),
  );

  container.innerHTML = sorted
    .map((pub) => {
      const titleHtml = pub.url
        ? `<a href="${pub.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(pub.title)}</a>`
        : escapeHtml(pub.title);

      const venueHtml = pub.venue_url
        ? `<a href="${pub.venue_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(pub.venue)}</a>`
        : escapeHtml(pub.venue);

      const authorsHtml = formatAuthors(pub.authors, collaborators, yourName);
      const actionsHtml = buildPublicationButtons(pub);
      const contentHtml = buildPublicationExtras(pub);

      return `
      <div class="publication-item">
          <div class="publication-venue">${venueHtml}</div>
          <div class="publication-content">
              <div class="publication-title">${titleHtml}</div>
              <div class="publication-meta">${authorsHtml}</div>
              ${actionsHtml}
              ${contentHtml}
          </div>
      </div>`;
    })
    .join("");

  attachPublicationEventListeners();
}

function attachPublicationEventListeners() {
  document.querySelectorAll(".publication-item").forEach((item) => {
    const abstractToggle = item.querySelector(".abstract-toggle");
    const bibtexToggle = item.querySelector(".bibtex-toggle");
    const abstractContent = item.querySelector(".publication-abstract-content");
    const bibtexContent = item.querySelector(".publication-bibtex-content");

    if (abstractToggle && abstractContent) {
      abstractToggle.addEventListener("click", () =>
        abstractContent.classList.toggle("show"),
      );
    }

    if (bibtexToggle && bibtexContent) {
      bibtexToggle.addEventListener("click", () =>
        bibtexContent.classList.toggle("show"),
      );
    }
  });

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const bibtex = btn.getAttribute("data-bibtex");
      navigator.clipboard.writeText(bibtex).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = UI_CONSTANTS.ICONS.CHECK;
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, UI_CONSTANTS.COPY_FEEDBACK_DURATION_MS);
      });
    });
  });
}

function renderTeaching(teaching) {
  const container = document.getElementById("teaching-container");

  if (!teaching || teaching.length === 0) {
    container.innerHTML = "<p>No teaching listed yet.</p>";
    return;
  }

  container.innerHTML = teaching
    .map((course) => {
      const numberHtml = course.url
        ? `<a href="${course.url}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(course.number)}</strong></a>`
        : `<strong>${escapeHtml(course.number)}</strong>`;

      return `
      <div class="teaching-item">
          <div class="course-semesters">${escapeHtml(course.semesters)}</div>
          <div class="course-header">
              ${numberHtml}: <span class="course-name">${escapeHtml(course.name)}</span>
          </div>
      </div>`;
    })
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeBibtex(bibtex) {
  return bibtex.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

function updateLastModified() {
  const lastUpdated = document.getElementById("last-updated");
  if (!lastUpdated) return;

  const formatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
  lastUpdated.textContent = formatted;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadContent);
} else {
  loadContent();
}
