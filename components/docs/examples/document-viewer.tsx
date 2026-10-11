"use client"

import * as React from "react"
import { Search } from "lucide-react"

import {
  DocumentOutline,
  DocumentThumbnails,
  DocumentViewer,
  type OutlineItem,
} from "@/components/ui/document-viewer"

/*
 * Real PDFs: use pdf.js through react-pdf (recommended). Install it in your
 * app, then plug it into `renderPage`. DocumentViewer itself has no PDF
 * dependency.
 *
 *   import { Document, Page, pdfjs } from "react-pdf"
 *   pdfjs.GlobalWorkerOptions.workerSrc = new URL(
 *     "pdfjs-dist/build/pdf.worker.min.mjs",
 *     import.meta.url
 *   ).toString()
 *
 *   <Document file={url} onLoadSuccess={({ numPages }) => setCount(numPages)}>
 *     <DocumentViewer
 *       pageCount={count}
 *       page={page}
 *       onPageChange={setPage}
 *       src={url}
 *       renderPage={(n, scale) => <Page pageNumber={n} scale={scale} />}
 *     />
 *   </Document>
 *
 * Page images work the same way: renderPage={(n) => <img src={pages[n - 1]} alt="" />}
 */

const CONTRACT_PAGES = 6
const CONTRACT_OUTLINE: OutlineItem[] = [
  { id: "parties", label: "Parties", page: 1 },
  {
    id: "terms",
    label: "Terms",
    page: 2,
    children: [
      { id: "term", label: "Term and renewal", page: 2 },
      { id: "fees", label: "Fees", page: 3 },
    ],
  },
  { id: "liability", label: "Liability", page: 5 },
  { id: "signatures", label: "Signatures", page: 6 },
]

const HANDBOOK_OUTLINE: OutlineItem[] = [
  { id: "welcome", label: "Welcome", page: 1 },
  {
    id: "time-off",
    label: "Time off",
    page: 4,
    children: [
      { id: "leave", label: "Annual leave", page: 4 },
      { id: "sick", label: "Sick leave", page: 6 },
    ],
  },
  { id: "conduct", label: "Code of conduct", page: 9 },
]

// Plain generated pages: stand-ins for pdf.js output.
function GeneratedPage({
  n,
  scale,
  name,
}: {
  n: number
  scale: number
  name: string
}) {
  return (
    <div
      className="flex flex-col gap-3 bg-background p-8"
      style={{ width: 480 * scale, minHeight: 640 * scale }}
    >
      <p className="eyebrow">{name}</p>
      <p className="heading text-2xl">Page {n}</p>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="h-2 bg-muted"
          style={{ width: `${95 - ((i * 7) % 30)}%` }}
        />
      ))}
    </div>
  )
}

export default function DocumentViewerDemo() {
  const [contractPage, setContractPage] = React.useState(1)
  const [handbookPage, setHandbookPage] = React.useState(1)

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="eyebrow">Contract review</p>
        <div className="h-[560px] w-full overflow-hidden">
          <DocumentViewer
            title="Services agreement"
            pageCount={CONTRACT_PAGES}
            page={contractPage}
            onPageChange={setContractPage}
            downloadHref="https://example.com/files/services-agreement.pdf"
            downloadName="services-agreement.pdf"
            renderPage={(n, scale) => (
              <GeneratedPage n={n} scale={scale} name="Services agreement" />
            )}
            search={
              <label className="flex h-8 items-center gap-1.5 border bg-background px-2">
                <Search
                  aria-hidden
                  className="size-3.5 text-muted-foreground"
                />
                <input
                  type="search"
                  aria-label="Search the document"
                  placeholder="Search"
                  className="w-28 bg-transparent text-sm outline-none"
                />
              </label>
            }
            thumbnails={
              <>
                <DocumentOutline
                  items={CONTRACT_OUTLINE}
                  onSelect={(item) => item.page && setContractPage(item.page)}
                />
                <DocumentThumbnails
                  pageCount={CONTRACT_PAGES}
                  page={contractPage}
                  onPageChange={setContractPage}
                />
              </>
            }
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="eyebrow">HR handbook</p>
        <div className="h-[560px] w-full overflow-hidden">
          {/* No renderPage: the default renderer shows the PDF natively,
              or a fallback link when the file cannot load. */}
          <DocumentViewer
            title="Employee handbook"
            src="https://example.com/files/employee-handbook.pdf"
            pageCount={24}
            page={handbookPage}
            onPageChange={setHandbookPage}
            thumbnails={
              <DocumentOutline
                items={HANDBOOK_OUTLINE}
                onSelect={(item) => item.page && setHandbookPage(item.page)}
                activeId={
                  [
                    ...HANDBOOK_OUTLINE.flatMap((i) => [
                      i,
                      ...(i.children ?? []),
                    ]),
                  ]
                    .filter((i) => (i.page ?? 99) <= handbookPage)
                    .at(-1)?.id
                }
              />
            }
            labels={{
              fallback: "The handbook could not be displayed in this browser.",
            }}
          />
        </div>
      </section>
    </div>
  )
}
