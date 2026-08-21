import type { StructureResolver } from 'sanity/structure';

/**
 * Singletons are pinned at the top as single entries rather than lists —
 * "Site settings" and "Homepage" are one document each, and a list of one is
 * a papercut every time an editor opens it.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Trinity')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Item pages')
        .schemaType('assetPage')
        .child(
          S.documentTypeList('assetPage')
            .title('Item pages')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Legal pages')
        .schemaType('legalPage')
        .child(S.documentTypeList('legalPage').title('Legal pages')),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ]);
