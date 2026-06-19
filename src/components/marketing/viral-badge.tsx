'use client';

interface ViralBadgeProps {
  tags: string[];
}

export function ViralBadge({ tags }: ViralBadgeProps) {
  const viralTags = ['viral', 'trending', 'tiktok', 'popular'];
  const isViral = tags.some(tag => viralTags.includes(tag.toLowerCase()));

  if (!isViral) return null;

  return (
    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse">
      🔥 VIRAL
    </div>
  );
}