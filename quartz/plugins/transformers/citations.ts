import fs from "fs"
import path from "path"

import rehypeCitation from "rehype-citation"
import { PluggableList } from "unified"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

function field(body: string, name: string) {
  const r = new RegExp(name + "\\s*=\\s*\\{([^}]+)\\}", "i")
  const m = body.match(r)
  return m ? m[1] : ""
}

function parseBibFile(filePath: string) {
  const text = fs.readFileSync(filePath, "utf8")
  const entries: Record<string, any> = {}

  const entryRegex = /@.+?\{([^,]+),([\s\S]*?)\n\}/g

  let match
  while ((match = entryRegex.exec(text)) !== null) {
    const key = match[1].trim().toLowerCase()
    const body = match[2]

    const doi = field(body, "doi")
    const url = field(body, "url")

    entries[key] = {
      title: field(body, "title"),
      author: field(body, "author"),
      year: field(body, "year"),
      journal: field(body, "journal") || field(body, "booktitle"),
      link: doi ? `https://doi.org/${doi}` : url
    }
  }

  return entries
}

export interface Options {
  bibliographyFile: string
  suppressBibliography: boolean
  linkCitations: boolean
  csl: string
}

const defaultOptions: Options = {
  bibliographyFile: "./bibliography.bib",
  suppressBibliography: true,
  linkCitations: true,
  csl: "apa",
}

export const Citations: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "Citations",
    htmlPlugins(ctx) {
      const plugins: PluggableList = []

      let lang: string = "en-US"
      if (ctx.cfg.configuration.locale !== "en-US") {
        lang = `https://raw.githubusercontent.com/citation-stylelanguage/locales/refs/heads/master/locales-${ctx.cfg.configuration.locale}.xml`
      }

      const bibPath = path.resolve(opts.bibliographyFile)
      const citationData = parseBibFile(bibPath)

      plugins.push([
        rehypeCitation,
        {
          bibliography: opts.bibliographyFile,
          suppressBibliography: opts.suppressBibliography,
          linkCitations: opts.linkCitations,
          csl: opts.csl,
          lang,
        },
      ])

      plugins.push(() => {
        return (tree) => {
          visit(tree, "element", (node: any) => {
            if (
              node.tagName === "a" &&
              typeof node.properties?.href === "string" &&
              node.properties.href.startsWith("#bib-")
            ) {
              const key = node.properties.href.replace("#bib-", "").toLowerCase()
              const entry = citationData[key]

              if (entry?.link) {
                node.properties.href = entry.link
                node.properties.target = "_blank"
                node.properties.rel = "noopener noreferrer"

                node.properties["data-cite-title"] = entry.title
                node.properties["data-cite-author"] = entry.author
                node.properties["data-cite-year"] = entry.year
                node.properties["data-cite-journal"] = entry.journal

                node.properties.className = [
                  ...(node.properties.className || []),
                  "citation-link",
                ]
              }
            }
          })
        }
      })

      return plugins
    },
  }
}