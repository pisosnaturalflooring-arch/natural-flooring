export const IMAGE_WIDTHS = [48, 96, 192, 320, 640, 960, 1440, 1920, 2560, 3840];

export function imageWidths(originalWidth) {
  return [...new Set([...IMAGE_WIDTHS.filter((width) => width < originalWidth), Math.min(originalWidth, 3840)])];
}

/** All URLs refer to files made at build time; a small source is never enlarged. */
export function preparedImageUrl(entry, { width, quality = 75, format = "webp" }) {
  const target = imageWidths(entry.width).find((candidate) => candidate >= width) ?? Math.min(entry.width, 3840);
  const outputQuality = entry.hero && quality >= 85 ? 85 : 75;
  return `/_images/${entry.id}/${target}-${outputQuality}.${format}`;
}

export function heroImageSrcSet(entry, format = "avif") {
  return imageWidths(entry.width)
    .filter((width) => width >= 640 || width === entry.width)
    .map((width) => `${preparedImageUrl(entry, { width, quality: 85, format })} ${width}w`)
    .join(", ");
}
