'use client';

import dynamic from 'next/dynamic';

const RichTextDescriptionClient = dynamic(
  () => import('./RichTextDescriptionClient'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function RichTextDescription({ value, className }) {
  if (!value) return null;

  return <RichTextDescriptionClient value={value} className={className} />;
}
