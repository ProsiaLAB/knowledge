import { simplifySlug, resolveRelative, FullSlug } from "@quartz-community/utils";
import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";

const MdbookNavComponent: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug;
  if (!slug) return null;
  if (!slug.startsWith("tools/software/")) return null;

  const parts = slug.split("/");
  if (parts.length < 3) return null;

  const bookSlug = parts.slice(0, 3).join("/");
  
  const bookFiles = allFiles.filter(f => {
    const s = simplifySlug(f.slug as FullSlug).replace(/\/$/, "");
    return s === bookSlug || s.startsWith(bookSlug + "/");
  });

  if (bookFiles.length === 0) return null;

  const allBookSlugs = bookFiles.map(f => simplifySlug(f.slug as FullSlug).replace(/\/$/, ""));
  
  allBookSlugs.sort((a, b) => {
    if (a === bookSlug) return -1;
    if (b === bookSlug) return 1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const bookLinks = Array.from(new Set(allBookSlugs));
  
  const curSlug = simplifySlug(slug).replace(/\/$/, "");
  const currentIndex = bookLinks.indexOf(curSlug);

  if (currentIndex === -1) return null;

  const prevSlug = currentIndex > 0 ? bookLinks[currentIndex - 1] : null;
  const nextSlug = currentIndex < bookLinks.length - 1 ? bookLinks[currentIndex + 1] : null;

  if (!prevSlug && !nextSlug) return null;

  const prevFile = prevSlug ? allFiles.find(f => simplifySlug(f.slug as FullSlug).replace(/\/$/, "") === prevSlug) : null;
  const nextFile = nextSlug ? allFiles.find(f => simplifySlug(f.slug as FullSlug).replace(/\/$/, "") === nextSlug) : null;

  const prevTitle = prevFile?.frontmatter?.title ?? prevSlug;
  const nextTitle = nextFile?.frontmatter?.title ?? nextSlug;

  return (
    <div class={`mdbook-nav ${displayClass ?? ""}`}>
      {prevSlug && prevFile && (
        <a href={resolveRelative(slug, prevSlug as FullSlug)} class="nav-button prev">
          <span class="icon">«</span>
          <span class="title">Previous<br/><strong>{prevTitle}</strong></span>
        </a>
      )}

      {nextSlug && nextFile && (
        <a href={resolveRelative(slug, nextSlug as FullSlug)} class="nav-button next">
          <span class="title">Next<br/><strong>{nextTitle}</strong></span>
          <span class="icon">»</span>
        </a>
      )}
    </div>
  );
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

export const MdbookNav = (() => MdbookNavComponent) satisfies QuartzComponentConstructor;
