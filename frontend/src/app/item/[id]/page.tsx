import ItemDetailClient from '../../../components/ItemDetailClient';

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // TODO: Fetch item data from your API using id
  // Example: const response = await fetch(`/api/items/${id}`);
  // const item = await response.json();

  const item = {
    id: id,
    title: 'Sample Item',
    description: 'Sample description',
    category: 'Electronics',
    condition: 'Like New',
    type: 'resell' as const,
    images: [] as string[],
    tags: [] as string[],
    location: 'Mumbai',
    views: 0,
    createdAt: new Date().toISOString(),
  };

  return <ItemDetailClient item={item} />;
}
