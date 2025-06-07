import "@/styles/HomePage/Snips/snipPage.css"
import Link from "next/link"

export default function SnipRenderer({ snips }: { snips: snipsWithAuthor[] }) {
  return (
    <section className="snip-wrapper">
      <div className="w-1/2">
        {snips.map(snip => (
          <div key={snip.id} className="container p-3">
            <Link
              href={`/user/${snip.author?.username}`}
            >
              <p className="snip-author">
                {snip.author?.username}
              </p>
            </Link>
            <p className="snip-content">{snip.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}