// src/app/item/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '../../../services/api';
import ItemComparison from '../../../components/ItemComparison';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  type: 'exchange' | 'bidding' | 'resell';
  images: string[];
  tags: string[];
  location: string;
  views: number;
  lookingFor?: string;
  startingBid?: number;
  currentBid?: number;
  buyNowPrice?: number;
  auctionEndDate?: string;
  totalBids?: number;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  shipping?: string;
  isPrime?: boolean;
  fastShipping?: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  warrantyStatus?: string;
  itemCondition?: string;
  damageInfo?: string;
  usageHistory?: string;
  originalBox?: string;
}

interface Props {
  params: { id: string };
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = params;

  const item: Item | null = await apiService.getItemById(id);
  if (!item) notFound();

  return (
    <div>
      <h1>{item.title}</h1>
      <Image src={item.images[0] || '/api/placeholder/400/400'} alt={item.title} width={400} height={400} />
      <p>{item.description}</p>
      {/* Move client-side tabs and comparison into a separate client component */}
    </div>
  );
}
