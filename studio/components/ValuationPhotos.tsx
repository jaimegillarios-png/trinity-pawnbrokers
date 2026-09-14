import { Box, Card, Flex, Grid, Stack, Text } from '@sanity/ui';
import type { ArrayOfObjectsInputProps } from 'sanity';

type Photo = { _key: string; name?: string; mime?: string; data?: string; bytes?: number };

/**
 * The photos a customer sent with a valuation request, shown as photographs.
 *
 * They are stored inside the (private) request document as data rather than as
 * Sanity image assets, because assets in this dataset are publicly listable —
 * so the Studio's default array input would show them as screenfuls of
 * base64. This draws them, read-only, and opens the full size in a new tab.
 */
export function ValuationPhotos(props: ArrayOfObjectsInputProps) {
  const photos = (props.value ?? []) as Photo[];

  if (!photos.length) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>No photos were sent with this request.</Text>
      </Card>
    );
  }

  return (
    <Grid columns={[2, 3]} gap={3}>
      {photos.map((photo) => {
        const src = photo.data ? `data:${photo.mime ?? 'image/jpeg'};base64,${photo.data}` : '';
        return (
          <Card key={photo._key} radius={2} border overflow="hidden">
            <Stack>
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  // A data: URL cannot be opened as a top-level navigation in
                  // most browsers; hand it a blob URL instead.
                  event.preventDefault();
                  fetch(src).then((r) => r.blob()).then((blob) => {
                    window.open(URL.createObjectURL(blob), '_blank', 'noopener');
                  });
                }}
              >
                <img
                  src={src}
                  alt={photo.name ?? ''}
                  style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
                />
              </a>
              <Box padding={2}>
                <Flex justify="space-between" gap={2}>
                  <Text size={0} textOverflow="ellipsis">{photo.name}</Text>
                  {photo.bytes ? <Text size={0} muted>{Math.round(photo.bytes / 1000)} KB</Text> : null}
                </Flex>
              </Box>
            </Stack>
          </Card>
        );
      })}
    </Grid>
  );
}
