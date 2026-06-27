import { createRequire } from 'module'; const require = createRequire(import.meta.url);

// ../../../../node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// ../../../../node_modules/@quartz-community/utils/dist/index.js
import { jsxs, jsx, Fragment } from "preact/jsx-runtime";
import { h } from "preact";
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function trimSuffix(s, suffix) {
  if (endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x) => x !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}
var U200D = String.fromCharCode(8205);

// components/index.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "preact/jsx-runtime";
var MdbookNavComponent = ({ fileData, allFiles, displayClass }) => {
  const slug2 = fileData.slug;
  if (!slug2) return null;
  if (!slug2.startsWith("tools/software/")) return null;
  const parts = slug2.split("/");
  if (parts.length < 3) return null;
  const bookSlug = parts.slice(0, 3).join("/");
  const bookFiles = allFiles.filter((f) => {
    const s = simplifySlug(f.slug).replace(/\/$/, "");
    return s === bookSlug || s.startsWith(bookSlug + "/");
  });
  if (bookFiles.length === 0) return null;
  const allBookSlugs = bookFiles.map((f) => simplifySlug(f.slug).replace(/\/$/, ""));
  allBookSlugs.sort((a, b) => {
    if (a === bookSlug) return -1;
    if (b === bookSlug) return 1;
    return a.localeCompare(b, void 0, { numeric: true });
  });
  const bookLinks = Array.from(new Set(allBookSlugs));
  const curSlug = simplifySlug(slug2).replace(/\/$/, "");
  const currentIndex = bookLinks.indexOf(curSlug);
  if (currentIndex === -1) return null;
  const prevSlug = currentIndex > 0 ? bookLinks[currentIndex - 1] : null;
  const nextSlug = currentIndex < bookLinks.length - 1 ? bookLinks[currentIndex + 1] : null;
  if (!prevSlug && !nextSlug) return null;
  const prevFile = prevSlug ? allFiles.find((f) => simplifySlug(f.slug).replace(/\/$/, "") === prevSlug) : null;
  const nextFile = nextSlug ? allFiles.find((f) => simplifySlug(f.slug).replace(/\/$/, "") === nextSlug) : null;
  const prevTitle = prevFile?.frontmatter?.title ?? prevSlug;
  const nextTitle = nextFile?.frontmatter?.title ?? nextSlug;
  return /* @__PURE__ */ jsxs2("div", { class: `mdbook-nav ${displayClass ?? ""}`, children: [
    prevSlug && prevFile && /* @__PURE__ */ jsxs2("a", { href: resolveRelative(slug2, prevSlug), class: "nav-button prev", children: [
      /* @__PURE__ */ jsx2("span", { class: "icon", children: "\xAB" }),
      /* @__PURE__ */ jsxs2("span", { class: "title", children: [
        "Previous",
        /* @__PURE__ */ jsx2("br", {}),
        /* @__PURE__ */ jsx2("strong", { children: prevTitle })
      ] })
    ] }),
    nextSlug && nextFile && /* @__PURE__ */ jsxs2("a", { href: resolveRelative(slug2, nextSlug), class: "nav-button next", children: [
      /* @__PURE__ */ jsxs2("span", { class: "title", children: [
        "Next",
        /* @__PURE__ */ jsx2("br", {}),
        /* @__PURE__ */ jsx2("strong", { children: nextTitle })
      ] }),
      /* @__PURE__ */ jsx2("span", { class: "icon", children: "\xBB" })
    ] })
  ] });
};
MdbookNavComponent.css = `
.mdbook-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  gap: 1rem;
}

.mdbook-nav .nav-button {
  flex: 0 1 calc(50% - 0.5rem);
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  text-decoration: none;
  color: var(--dark);
  transition: all 0.2s ease;
}

.mdbook-nav .nav-button:hover {
  background-color: var(--lightgray);
  border-color: var(--gray);
}

.mdbook-nav .nav-button.next {
  justify-content: flex-end;
  text-align: right;
  margin-left: auto;
}

.mdbook-nav .nav-button.prev {
  justify-content: flex-start;
  text-align: left;
}

.mdbook-nav .icon {
  font-size: 2rem;
  line-height: 1;
  color: var(--tertiary);
}

.mdbook-nav .prev .icon {
  margin-right: 1rem;
}

.mdbook-nav .next .icon {
  margin-left: 1rem;
}

.mdbook-nav .title {
  font-size: 0.8rem;
  color: var(--darkgray);
}

.mdbook-nav .title strong {
  display: block;
  font-size: 1.1rem;
  color: var(--dark);
  margin-top: 0.2rem;
}
`;
var MdbookNav = (() => MdbookNavComponent);
export {
  MdbookNav
};
