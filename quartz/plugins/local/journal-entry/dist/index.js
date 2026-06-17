// index.ts
var MONTH_MAP = {
  january: "january",
  february: "february",
  march: "march",
  april: "april",
  may: "may",
  june: "june",
  july: "july",
  august: "august",
  september: "september",
  october: "october",
  november: "november",
  december: "december"
};
function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
}
function prettyDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
function parseEntryHeading(text) {
  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    const rawDate = dateMatch[1];
    const [year, month, day] = rawDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const weekNum = isoWeekNumber(date);
    const week2 = `W${String(weekNum).padStart(2, "0")}`;
    const display2 = prettyDate(rawDate);
    return { week: week2, display: display2 };
  }
  const weekMatch = text.match(/\bW(\d{1,2})\b/i);
  const week = weekMatch ? `W${weekMatch[1].padStart(2, "0")}` : "";
  const display = text.replace(/\bW\d{1,2}\b/i, "").replace(/^\s*[·|,—–]\s*/, "").replace(/\s*[·|,—–]\s*$/, "").trim();
  return { week, display };
}
function headingText(node) {
  return node.children.map((c) => "value" in c ? c.value : "").join("").trim();
}
function html(value) {
  return { type: "html", value };
}
var JournalEntryInjector = () => {
  return {
    name: "JournalEntryInjector",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            const frontmatter = file.data.frontmatter;
            const tags = frontmatter?.tags ?? [];
            const hasJournalTag = tags.some(
              (tag) => tag.toLowerCase() === "journal" || tag.toLowerCase() === "#journal"
            );
            if (!hasJournalTag) return;
            const newChildren = [];
            let insideMonth = false;
            let insideEntry = false;
            for (const node of tree.children) {
              if (node.type === "heading" && node.depth === 1) {
                if (insideEntry) {
                  newChildren.push(html("</details>"));
                  insideEntry = false;
                }
                if (insideMonth) {
                  newChildren.push(html("</div>"));
                  insideMonth = false;
                }
                const rawText = headingText(node);
                const words = rawText.split(/\s+/);
                const firstWord = words[0].toLowerCase();
                const monthKey = MONTH_MAP[firstWord] ?? "";
                const yearPart = words.slice(1).join(" ");
                newChildren.push(html(`<div class="journal-month-block" data-month="${monthKey}">`));
                insideMonth = true;
                newChildren.push(html(`
                  <h1 class="journal-month-heading">
                    <span class="journal-month-pill">${words[0]}</span>
                    <span class="journal-month-year">${yearPart}</span>
                  </h1>
                `));
                continue;
              }
              if (node.type === "heading" && node.depth === 2) {
                if (insideEntry) {
                  newChildren.push(html("</details>"));
                  insideEntry = false;
                }
                const rawText = headingText(node);
                const { week, display } = parseEntryHeading(rawText);
                const weekSpan = week ? `<span class="journal-week-num">${week}</span>` : "";
                const sepSpan = week && display ? `<span class="journal-sep">\xB7</span>` : "";
                const displaySpan = display ? `<span class="journal-entry-date">${display}</span>` : "";
                newChildren.push(html(`
                  <details class="journal-entry-block" open>
                    <summary class="journal-entry-heading">
                      ${weekSpan}${sepSpan}${displaySpan}
                      <span class="journal-entry-chevron"></span>
                    </summary>
                `));
                insideEntry = true;
                continue;
              }
              newChildren.push(node);
            }
            if (insideEntry) newChildren.push(html("</details>"));
            if (insideMonth) newChildren.push(html("</div>"));
            tree.children = newChildren;
          };
        }
      ];
    }
  };
};
var index_default = JournalEntryInjector;
export {
  JournalEntryInjector,
  index_default as default
};
