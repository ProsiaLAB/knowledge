import { Root, Element } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "@quartz-community/types"

export const DisablePopovers: QuartzTransformerPlugin = () => {
  return {
    name: "DisablePopovers",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(tree, "element", (node: Element) => {
              if (
                node.properties &&
                node.properties.className &&
                String(node.properties.className).includes("domain-grid")
              ) {
                visit(node, "element", (child: Element) => {
                  if (child.tagName === "a") {
                    child.properties = child.properties || {}
                    child.properties["data-no-popover"] = "true"
                  }
                })
              }
            })
          }
        }
      ]
    }
  }
}

export default DisablePopovers
