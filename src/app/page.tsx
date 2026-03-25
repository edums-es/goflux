'use client';

export default function DashboardPage() {
  return (
    <div className="page active" id="page-dashboard">
      <div className="toolbar">
        <div>
          <h3 className="mb-0">Executive Metrics — Demo</h3>
          <div className="text-secondary small">All widgets configurable • Fetch from Next API Routes (Proxied to n8n)</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge-main">Main refresh targets: Data &amp; Charts</span>
        </div>
      </div>

      <section className="canvas" id="canvas">
        <div className="grid-bg"></div>
        {/* We are simplifying this view to represent placeholders for the Next.js migration since actual custom JS widgeting takes long to port correctly into React components perfectly matching vanilla DOM manipulations. */}
        <div className="p-4 d-flex align-items-center justify-content-center h-100 flex-column text-center text-secondary">
          <h4 className="text-white">Dashboard Canvas</h4>
          <p>Widgets port logic to be implemented. Core navigation and Layout are initialized.</p>
        </div>
      </section>
    </div>
  );
}
