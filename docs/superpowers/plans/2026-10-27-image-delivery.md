# Image delivery implementation plan

> **For agentic workers:** execute inline with superpowers:executing-plans; request one final read-only review.

**Goal:** Remove first-visit image conversion delays throughout the site and the empty hero in the user's Vercel screenshot.

**Architecture:** Prepare responsive WebP files for local photographs before Next builds, with a content-addressed manifest and Next image loader. Prepare AVIF alternatives and small embedded previews for the six hero photos. Serve generated images as immutable static assets; retain native lazy loading below the fold.

**Tech Stack:** Next 16.3.4, existing sharp, node:test; no new dependencies.

**Spec:** The user's report and screenshot: hero text appears before its image; other sections also load slowly. Preserve selected photos, focal points, layout and original source resolution.

## Constraints and review focus

- Retain all six hero scenes and mobile/desktop art direction.
- Preserve current quality: WebP 75 for normal photos and 85 for hero; AVIF uses Next's existing quality conversion.
- Do not upscale originals, eagerly fetch galleries, or change user-provided visualizer images.
- Build and dev must generate assets automatically; no runtime sharp or filesystem in client modules.
- Hash names when source bytes or conversion settings change. Verify actual generated files, not only URL strings.
- Test a clean generated directory, cache reuse, tiny originals, Spanish paths, mobile source choice, and first-visit requests.

## Tasks

- [x] Add an image preparation module and CLI, test against real temporary image fixtures (red then green). Include portrait orientation, width caps, content hashes, valid output and incremental rebuilds.
- [x] Wire Next's image loader, sizes, dev/build lifecycle and static caching. Generate the checked-in metadata manifest and ignored assets; preserve lazy loading across existing components.
- [x] Add responsive AVIF hero sources and an embedded preview behind the actual image, without client load state or duplicate device downloads. Verify browser behavior with a delayed full photo.
- [x] Run the complete test suite and cold production build, inspect generated file sizes and HTML, perform isolated browser verification, and request final code review.

## Evidence and decisions

- Production HTML TTFB: ~0.21s. Cold 3840px pool hero AVIF TTFB: ~2.45s; WebP: ~1.56s.
- Existing images already use eager/high priority for hero and lazy loading elsewhere. Preparing files before deployment removes conversion from the visitor's request instead of adding competing eager requests.
- Cold preparation: 149 referenced images in 16.5s; subsequent preparation: 0.1s. Generated files are excluded from Git.
- Full suite: 156 tests passed. Cold Next build: 135 pages. Browser checks passed at desktop 2x and mobile 3x: preview visible while the full image was blocked, exactly one hero image downloaded, all six scenes decoded, catalog/details and lazy gallery images decoded, no optimizer requests or browser exceptions.
- Ruling: preparation is explicit in the `dev` and `build` commands, so npm/pnpm lifecycle-hook preferences cannot cause a deploy without assets.
