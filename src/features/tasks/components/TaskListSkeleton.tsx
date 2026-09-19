export function TaskListSkeleton() {
  return (
    <div className="task-list task-list--skeleton" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <article key={index} className="task-list__item">
          <div className="task-list__content">
            <span className="skeleton skeleton--title" />
            <span className="skeleton skeleton--description" />
            <div className="task-list__meta">
              <span className="skeleton skeleton--badge" />
              <span className="skeleton skeleton--date" />
            </div>
          </div>
          <div className="task-list__actions">
            <span className="skeleton skeleton--icon" />
            <span className="skeleton skeleton--icon" />
          </div>
        </article>
      ))}
    </div>
  );
}