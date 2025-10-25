import { Root } from "mdast"
import { QuartzTransformerPlugin } from "../types"

export const PaperPreviewInjector: QuartzTransformerPlugin = () => {
  return {
    name: "PaperPreviewInjector",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            // Check if the file has the #review tag
            const frontmatter = file.data.frontmatter as any
            const tags = frontmatter?.tags || []

            const hasReviewTag = tags.some((tag: string) =>
              tag.toLowerCase() === 'review' || tag.toLowerCase() === '#review'
            )

            if (hasReviewTag) {
              // Extract metadata from frontmatter
              const authors = frontmatter?.authors || []
              const volume = frontmatter?.volume || ""
              const issue = frontmatter?.issue || ""
              const published = frontmatter?.published || ""
              const doi = frontmatter?.doi || ""
              const abstract = frontmatter?.abstract || ""
              const journalLogo = frontmatter?.journal_logo || ""

              // Build simple authors list (inline, comma-separated)
              let authorsHTML = ""
              if (Array.isArray(authors) && authors.length > 0) {
                const authorNames = authors.map((author: any) => {
                  return typeof author === 'string' ? author : author.name || author
                })
                authorsHTML = `<div class="authors-list">${authorNames.join(', ')}</div>`
              }

              // Inject paper preview HTML
              tree.children.unshift({
                type: "html",
                value: `
                  <div class="paper-preview-container">
                    <div class="paper-preview">
                      ${journalLogo ? `
                      <div class="journal-logo">
                        <img src="${journalLogo}" alt="Journal Logo">
                      </div>` : ''}
                      
                      ${authorsHTML}
                      
                      ${volume || issue || published || doi ? `
                      <div class="metadata">
                        ${volume || issue || published ? `
                        <div class="metadata-row">
                          ${volume || issue ? `
                          <div class="metadata-item">
                            <span class="metadata-label">Volume/Issue:</span>
                            <span class="metadata-value">${volume}${issue ? ', ' + issue : ''}</span>
                          </div>` : ''}
                          ${published ? `
                          <div class="metadata-item">
                            <span class="metadata-label">Published:</span>
                            <span class="metadata-value">${published}</span>
                          </div>` : ''}
                        </div>` : ''}
                        ${doi ? `
                        <div class="metadata-row">
                          <div class="metadata-item">
                            <span class="metadata-label">DOI:</span>
                            <span class="metadata-value">
                              <a href="https://doi.org/${doi}" target="_blank">${doi}</a>
                            </span>
                          </div>
                        </div>` : ''}
                      </div>` : ''}
                      
                      ${abstract ? `
                      <div class="abstract-section">
                        <h2 class="abstract-heading">Abstract</h2>
                        <p class="abstract-text">${abstract}</p>
                      </div>` : ''}
                    </div>
                  </div>
                `
              })
            }
          }
        }
      ]
    }
  }
}