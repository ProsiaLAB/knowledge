import { Root } from "mdast"
import { QuartzTransformerPlugin } from "@quartz-community/types"
import matter from "gray-matter"
import yaml from "js-yaml"

function coerceToArray(input: unknown): string[] | undefined {
  if (input === undefined || input === null) return undefined;
  if (!Array.isArray(input)) {
    return String(input)
      .split(",")
      .map((s: string) => s.trim());
  }
  return input
    .filter((v: unknown) => typeof v === "string" || typeof v === "number")
    .map((v: string | number) => v.toString());
}

function coalesceAliases(data: Record<string, unknown>, aliases: string[]): unknown | undefined {
  for (const alias of aliases) {
    if (data[alias] !== undefined && data[alias] !== null) return data[alias];
  }
}

export const PreserveTagCase: QuartzTransformerPlugin = () => {
  return {
    name: "PreserveTagCase",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            const frontmatter = file.data.frontmatter as any
            if (!frontmatter || !frontmatter.tags) return

            try {
              const fileData = Buffer.from(file.value as Uint8Array)
              const { data } = matter(fileData, {
                engines: {
                  yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
                },
              })

              const originalTagsRaw = coalesceAliases(data, ["tags", "tag"])
              const originalTags = coerceToArray(originalTagsRaw)

              if (originalTags && originalTags.length > 0) {
                const mappedTags = frontmatter.tags.map((sluggedTag: string) => {
                  const matchingOriginal = originalTags.find((orig: string) => {
                    const cleanedOrig = orig.startsWith("#") ? orig.substring(1) : orig
                    // Normalize for comparison
                    const normOrig = cleanedOrig.toLowerCase().replace(/[\s\-_]/g, "")
                    const normSlugged = sluggedTag.toLowerCase().replace(/[\s\-_]/g, "")
                    return normOrig === normSlugged
                  })

                  if (matchingOriginal) {
                    return matchingOriginal.startsWith("#") ? matchingOriginal.substring(1) : matchingOriginal
                  }
                  return sluggedTag
                })

                frontmatter.tags = mappedTags
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      ]
    }
  }
}

export default PreserveTagCase
