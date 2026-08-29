import type { InstagramTile } from '@/types/content';

/**
 * The studio gallery (brief §18).
 *
 * This loads nothing from Instagram. No API is connected, no embed script runs,
 * and every tile is a self-hosted licensed editorial photograph credited in
 * `public/photography/index.json`. The section links out to the profile only when
 * `NEXT_PUBLIC_INSTAGRAM_URL` is configured; otherwise the link is omitted rather
 * than pointed at a guessed handle (brief §18, docs/DECISION_LOG.md D12).
 *
 * Captions describe what is in the frame. None of them claims the photograph was
 * taken at a booking this studio worked, because it was not.
 */

export const instagramTiles = [
  { id: 'instagram-01', caption: 'Gold at the ear — the detail that finishes a traditional look.', imageId: 'instagram-01' },
  { id: 'instagram-02', caption: 'Mehndi line work, photographed while it dries.', imageId: 'instagram-02' },
  { id: 'instagram-03', caption: 'Red and gold, stacked to the elbow.', imageId: 'instagram-03' },
  { id: 'instagram-04', caption: 'Jewellery laid out against a red saree before it is worn.', imageId: 'instagram-04' },
  { id: 'instagram-05', caption: 'Flowers dressed through a braid, one at a time.', imageId: 'instagram-05' },
  { id: 'instagram-06', caption: 'A single earring, hair swept back off the shoulder.', imageId: 'instagram-06' },
  { id: 'instagram-07', caption: 'The back of a finished bridal set — the view she never sees.', imageId: 'instagram-07' },
  { id: 'instagram-08', caption: 'A bench mid-morning: base, brushes, nothing precious.', imageId: 'instagram-08' },
] as const satisfies readonly InstagramTile[];
