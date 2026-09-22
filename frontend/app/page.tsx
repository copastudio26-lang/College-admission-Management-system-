const features = [
  'Multi-step Student Registration',
  'Document Verification Pipeline',
  'Secure Fee Payment Flow',
  'Merit-based Seat Allotment',
  'Admin Review Dashboard',
];

export default function HomePage() {
  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 16 }}>College Admission Management System</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: 800, lineHeight: 1.6 }}>
          A cloud-based admissions workflow for applicants, staff, and finance teams.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 32 }}>
          {features.map((feature) => (
            <div key={feature} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, background: '#f8f9fb' }}>
              <strong>{feature}</strong>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="/dashboard" style={{ background: '#1d4ed8', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none' }}>Open Dashboard</a>
          <a href="http://localhost:4000/health" style={{ background: '#111827', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none' }}>Check API Health</a>
        </div>
      </div>
    </main>
  );
}
