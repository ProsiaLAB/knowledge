import { Element, Text } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export const FootnotesToReferences: QuartzTransformerPlugin = () => {
    return {
        name: "FootnotesToReferences",
        htmlPlugins() {
            return [
                () => {
                    return (tree) => {
                        // Visit all elements in the HTML AST
                        visit(tree, "element", (node: Element) => {
                            // Look for the footnotes section
                            // mdast-util-to-hast typically creates a section with class "footnotes"
                            // or an element with data-footnotes attribute
                            if (
                                (node.properties?.className &&
                                    Array.isArray(node.properties.className) &&
                                    node.properties.className.includes("footnotes")) ||
                                node.properties?.dataFootnotes
                            ) {
                                // Look for the heading element within footnotes section
                                visit(node, "element", (headingNode: Element) => {
                                    if (headingNode.tagName === "h2" || headingNode.tagName === "h3") {
                                        // Check if this heading contains "Footnotes" text
                                        visit(headingNode, "text", (textNode: Text) => {
                                            if (textNode.value === "Footnotes") {
                                                textNode.value = "References"
                                            }
                                        })
                                    }
                                })
                            }

                            // Also check for any direct text nodes that might contain "Footnotes"
                            // This covers cases where the structure might be different
                            if (node.tagName === "h2" || node.tagName === "h3") {
                                visit(node, "text", (textNode: Text) => {
                                    if (textNode.value === "Footnotes") {
                                        textNode.value = "References"
                                    }
                                })
                            }
                        })

                        // Alternative approach: look for any text node containing "Footnotes"
                        // and replace it if it's in a heading context
                        visit(tree, "text", (node: Text, _, parent) => {
                            if (node.value === "Footnotes" && parent &&
                                parent.type === "element" &&
                                (parent.tagName === "h2" || parent.tagName === "h3")) {
                                node.value = "References"
                            }
                        })
                    }
                }
            ]
        },
    }
}