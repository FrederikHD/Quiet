// Patterns: whole screens built only from Quiet's components, the way an app would use them. They show how the
// components work together, and they are tested like the examples (axe, screenshots, phone widths).
import type { Component } from 'vue';

export interface Pattern {
  slug: string;
  title: string;
  /** One sentence under the title. */
  summary: string;
  /** The component folders it uses, linked from its page. */
  uses: string[];
  load: () => Promise<{ default: Component }>;
}

export const patterns: Pattern[] = [
  {
    slug: 'product-page',
    title: 'Product page',
    summary:
      'A storefront product page: images, colour and size, price, add to cart, details, reviews, related products and the cart drawer.',
    uses: [
      'SearchBox',
      'Breadcrumbs',
      'Gallery',
      'Rating',
      'Price',
      'Form',
      'RadioGroup',
      'Radio',
      'QuantityStepper',
      'Button',
      'Disclosure',
      'ReviewSummary',
      'Review',
      'Select',
      'ProductCard',
      'Dialog',
      'EmptyState',
      'Icon',
      'Toast',
    ],
    load: () => import('./ProductPage.vue'),
  },
  {
    slug: 'collection',
    title: 'Collection',
    summary:
      'A storefront collection: filters beside the grid (in a sheet on phones), chips for the filters in use, sort, 12 products at a time and an empty result, all kept in the URL.',
    uses: [
      'SearchBox',
      'Breadcrumbs',
      'Disclosure',
      'CheckboxGroup',
      'Checkbox',
      'PriceRange',
      'FilterChips',
      'Select',
      'ProductCard',
      'EmptyState',
      'Dialog',
      'Button',
      'Toast',
    ],
    load: () => import('./CollectionPage.vue'),
  },
  {
    slug: 'checkout',
    title: 'Checkout',
    summary:
      'A storefront checkout in three steps and its confirmation: addresses, delivery, payment and terms, with the order summary and a discount code beside the form.',
    uses: [
      'Steps',
      'Form',
      'FormSection',
      'Field',
      'FieldGroup',
      'Input',
      'AddressFields',
      'Checkbox',
      'RadioGroup',
      'Radio',
      'DescriptionList',
      'OrderSummary',
      'DiscountCode',
      'FormActions',
      'Button',
      'Icon',
      'Toast',
    ],
    load: () => import('./CheckoutPage.vue'),
  },
  {
    slug: 'orders',
    title: 'Orders',
    summary:
      'A back-office order list and an order: tabs, search, sorting, bulk actions and paging, then fulfilling the order and editing its address.',
    uses: [
      'AppShell',
      'Nav',
      'Page',
      'Tabs',
      'Table',
      'Input',
      'Icon',
      'Badge',
      'Button',
      'Pagination',
      'EmptyState',
      'Menu',
      'Card',
      'OrderSummary',
      'DescriptionList',
      'Dialog',
      'Form',
      'AddressFields',
      'Toast',
    ],
    load: () => import('./OrdersPage.vue'),
  },
  {
    slug: 'product-edit',
    title: 'Product edit',
    summary:
      'A back-office product edit page: one form across two columns, images, pricing, variants with their own price and stock, a sticky Save, and a guard against losing unsaved changes.',
    uses: [
      'AppShell',
      'Nav',
      'Page',
      'Form',
      'Card',
      'Field',
      'FieldGroup',
      'Input',
      'Textarea',
      'FileUpload',
      'CheckboxGroup',
      'Checkbox',
      'Table',
      'Select',
      'Combobox',
      'Badge',
      'Button',
      'FormActions',
      'Dialog',
      'EmptyState',
      'Toast',
    ],
    load: () => import('./ProductEditPage.vue'),
  },
];
