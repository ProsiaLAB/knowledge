import { JSX } from "preact"
import readingTime from "reading-time"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import style from "./styles/contentMeta.scss"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: false,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      // if (fileData.dates) {
      //   // First segment: Emphasized created date (no label, italic for subtle emp)
      //   segments.push(
      //     <em>
      //       Created: <Date date={fileData.dates.created} locale={cfg.locale} />
      //     </em>,
      //   )
      //   // Second segment: "Last Modified:" with emphasized date (italic)
      //   segments.push(
      //     <span>
      //       Last Modified: <em><Date date={fileData.dates.modified} locale={cfg.locale} /></em>
      //     </span>,
      //   )
      // }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
