document.addEventListener("DOMContentLoaded", () => {
    const pop = document.createElement("div")
    pop.className = "citation-popover"
    document.body.appendChild(pop)

    document.querySelectorAll("a.citation-link").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            const title = el.dataset.citeTitle || ""
            const author = el.dataset.citeAuthor || ""
            const year = el.dataset.citeYear || ""
            const journal = el.dataset.citeJournal || ""

            pop.innerHTML =
                "<strong>" + title + "</strong><br>" +
                author + " (" + year + ")<br>" +
                journal

            const rect = el.getBoundingClientRect()
            pop.style.left = rect.left + window.scrollX + "px"
            pop.style.top = rect.bottom + window.scrollY + 8 + "px"
            pop.style.display = "block"
        })

        el.addEventListener("mouseleave", () => {
            pop.style.display = "none"
        })
    })
})