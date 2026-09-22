export default function DashboardPage() {
  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1>Admission Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 24 }}>
          <StatCard title="Applicants" value="1,284" trend="+12%" />
          <StatCard title="Documents Verified" value="947" trend="+18%" />
          <StatCard title="Pending Fees" value="204" trend="-7%" />
          <StatCard title="Seats Allotted" value="610" trend="+9%" />
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div style={{ background: '#f3f4f6', borderRadius: 12, padding: 20, border: '1px solid #ddd' }}>
      <div style={{ color: '#6b7280', fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>{value}</div>
      <div style={{ marginTop: 6, color: '#16a34a', fontSize: 13 }}>{trend}</div>
    </div>
  );
}
