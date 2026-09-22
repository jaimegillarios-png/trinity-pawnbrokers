import type { StructureResolver } from 'sanity/structure';

/**
 * The Studio's left-hand nav, written out explicitly.
 *
 * Explicit means nothing appears here by accident — and nothing appears at all
 * unless it is listed. A schema can be registered, seeded and rendering on the
 * live site while being unreachable to the person who is supposed to edit it,
 * which is how the shop and five page singletons spent a while invisible.
 * Adding a document type means adding it here too.
 *
 * Singletons are pinned as single entries rather than lists: each is one
 * document, and a list of one is a papercut every time an editor opens it.
 */

/** One document, opened directly. The id must match the seeded `_id`. */
const single = (S: Parameters<StructureResolver>[0], title: string, type: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Trinity')
    .items([
      /* First, because it is the only thing in here that is somebody waiting
         for an answer. */
      S.listItem()
        .title('Valuation requests')
        .child(
          S.list()
            .title('Valuation requests')
            .items([
              S.listItem()
                .title('New')
                .child(
                  S.documentList()
                    .title('New')
                    .filter('_type == "valuationRequest" && status == "new"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('In progress')
                .child(
                  S.documentList()
                    .title('In progress')
                    .filter('_type == "valuationRequest" && status in ["contacted", "offered"]')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('All')
                .schemaType('valuationRequest')
                .child(
                  S.documentTypeList('valuationRequest')
                    .title('All requests')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }]),
                ),
            ]),
        ),
      S.divider(),

      single(S, 'Homepage', 'homePage'),

      S.listItem()
        .title('Item pages')
        .schemaType('assetPage')
        .child(
          S.documentTypeList('assetPage')
            .title('Item pages')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      /* The one-off pages. Each is a single document, so they are grouped
         rather than left as seven entries competing with the lists. */
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              single(S, 'What we lend against', 'lendPage'),
              single(S, 'How it works', 'howPage'),
              single(S, 'About the house', 'aboutPage'),
              single(S, 'FAQs', 'faqPage'),
              single(S, 'Contact', 'contactPage'),
            ]),
        ),

      /* The catalogue. Shop items are the one list on this site that changes
         weekly, so they get their own section rather than sitting under Pages
         — and the wording of the shop itself sits beside them. */
      S.listItem()
        .title('Shop')
        .child(
          S.list()
            .title('Shop')
            .items([
              single(S, 'Shop page wording', 'shopPage'),
              S.divider(),
              S.listItem()
                .title('All items')
                .schemaType('product')
                .child(
                  S.documentTypeList('product')
                    .title('All items')
                    .defaultOrdering([{ field: 'price', direction: 'desc' }]),
                ),
              /* Filtered views, because "what is actually for sale" is the
                 question staff ask most and the full list buries it once sold
                 pieces accumulate. */
              S.listItem()
                .title('For sale')
                .child(
                  S.documentList()
                    .title('For sale')
                    .filter('_type == "product" && status == "available"')
                    .defaultOrdering([{ field: 'price', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Reserved')
                .child(
                  S.documentList()
                    .title('Reserved')
                    .filter('_type == "product" && status == "reserved"'),
                ),
              S.listItem()
                .title('Sold')
                .child(
                  S.documentList()
                    .title('Sold')
                    .filter('_type == "product" && status == "sold"')
                    .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
                ),
            ]),
        ),

      S.listItem()
        .title('Guides')
        .child(
          S.list()
            .title('Guides')
            .items([
              single(S, 'Guides page', 'guidesIndex'),
              S.listItem()
                .title('Guides')
                .schemaType('guide')
                .child(
                  S.documentTypeList('guide')
                    .title('Guides')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                ),
            ]),
        ),

      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              single(S, 'Index settings', 'blogIndex'),
              S.listItem()
                .title('Articles')
                .schemaType('post')
                .child(
                  S.documentTypeList('post')
                    .title('Articles')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
            ]),
        ),

      S.listItem()
        .title('Legal pages')
        .schemaType('legalPage')
        .child(S.documentTypeList('legalPage').title('Legal pages')),

      S.divider(),

      single(S, 'Site settings', 'siteSettings'),
    ]);
