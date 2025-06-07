import "@/styles/HomePage/skeletonUI.css"

export function SkeletonPostLoader() {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton-post">
          <div className="skeleton-author-info">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-line skeleton-author"></div>
          </div>
          <div className="skeleton-text">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonSnipLoader() {
  return (
    <section className="skeleton-snips-wrapper">
      <div className="w-1/2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-snip-wrapper">
            <div className="skeleton-author-info">
              <div className="skeleton-line skeleton-author"></div>
            </div>
            <div className="skeleton-line"></div>
          </div>
        ))}
      </div>
    </section>
  )
}