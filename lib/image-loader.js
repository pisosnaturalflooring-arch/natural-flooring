"use client";

import manifest from "./image-manifest.json";
import { preparedImageUrl } from "./image-presets.mjs";

export default function imageLoader({ src, width, quality }) {
  const entry = manifest[src];
  // SVG, data URLs and user-provided images retain their original delivery.
  return entry ? preparedImageUrl(entry, { width, quality }) : src;
}
