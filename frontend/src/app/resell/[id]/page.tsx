import ItemDetailClient from '@/components/ItemDetailClient';

async function getItem(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${apiUrl}/items/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.item || data;
  } catch (error) {
    return null;
  }
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <div style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>Item not found</div>
          <a href="/resell" style={{ color: '#924DAC', textDecoration: 'none', fontWeight: 600 }}>← Back to Resell</a>
        </div>
      </div>
    );
  }

  return <ItemDetailClient item={item} />;
}