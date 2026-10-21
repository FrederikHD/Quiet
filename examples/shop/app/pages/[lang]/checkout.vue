<script setup lang="ts">
import {
  QAddressFields,
  QButton,
  QCheckbox,
  QEmptyState,
  QField,
  QForm,
  QFormSection,
  QInput,
  QNotice,
  QOrderSummary,
  validateAddress,
  type Address,
  type FormError,
} from '@frederikhd/quiet';
import { photo } from '~/data/pictures';
import { productBySlug } from '~/data/products';

const { lang, t, href } = useShop();
const link = useInAppLink();
useHead(() => ({ title: `${t.value.checkout} · ${t.value.shop}` }));

const { lines, subtotal, clear } = useCart();
const colourName = (c: string) => t.value.colourNames[c] ?? c;
const shipping = computed(() => (subtotal.value >= 50 ? 0 : t.value.shippingCost));
const items = computed(() =>
  lines.value.map((l) => {
    const p = productBySlug(l.slug);
    return {
      id: `${l.slug}-${l.colour}-${l.size}`,
      name: p?.name[lang.value] ?? l.slug,
      variant: `${colourName(l.colour)} · ${l.size}`,
      quantity: l.quantity,
      price: (p?.price ?? 0) * l.quantity,
      image: { src: photo(l.colour) },
    };
  }),
);

// Checked on "Place order", then again as people fix what was wrong.
const email = ref('');
const address = ref<Address>({ country: lang.value === 'de' ? 'DE' : 'GB' });
const terms = ref(false);
const tried = ref(false);
const addressCheck = computed(() => validateAddress(address.value, { idPrefix: 'ship' }));
const errors = computed(() => {
  const e: Record<string, string> = {};
  if (!email.value.trim()) e['co-email'] = t.value.emailMissing;
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) e['co-email'] = t.value.emailBad;
  for (const { id, message } of addressCheck.value.list) e[id] = message;
  if (!terms.value) e['co-terms'] = t.value.termsMissing;
  return e;
});
const shown = computed(() => (tried.value ? errors.value : {}));
const summary = computed<FormError[] | null>(() =>
  tried.value && Object.keys(errors.value).length
    ? Object.entries(errors.value).map(([id, message]) => ({ id, message }))
    : null,
);

const placedFor = ref<string | null>(null);
async function place() {
  tried.value = true;
  if (Object.keys(errors.value).length) return;
  placedFor.value = email.value.trim();
  clear();
  await nextTick();
  document.querySelector<HTMLElement>('main h1')?.focus();
}
</script>

<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title" tabindex="-1">{{ placedFor ? t.thanks : t.checkout }}</h1>
      <p v-if="placedFor" class="page__intro">{{ t.thanksText(placedFor) }}</p>
    </div>
    <ClientOnly>
      <template v-if="placedFor">
        <QNotice tone="info">{{ t.demo }}</QNotice>
        <p>
          <QButton :href="href()" @click="link(href())($event)">{{ t.keepShopping }}</QButton>
        </p>
      </template>

      <template v-else>
        <QEmptyState v-if="!lines.length" :title="t.emptyCart" icon="cart" :heading-level="2">
          {{ t.emptyCartText }}
          <template #actions>
            <QButton :href="href()" @click="link(href())($event)">{{ t.keepShopping }}</QButton>
          </template>
        </QEmptyState>

        <div v-else class="columns">
          <QForm label-placement="top" markers="optional" :errors="summary" @submit.prevent="place">
            <QFormSection :title="t.contact">
              <QField id="co-email" :label="t.email" required :hint="t.emailHint" :error="shown['co-email']">
                <QInput v-model="email" type="email" autocomplete="email" />
              </QField>
            </QFormSection>
            <QFormSection :title="t.shippingAddress">
              <QAddressFields v-model="address" id-prefix="ship" :errors="tried ? addressCheck.errors : {}" />
            </QFormSection>
            <QCheckbox id="co-terms" v-model="terms" :label="t.terms" required :error="shown['co-terms'] ?? null" />
            <QNotice tone="info">{{ t.demo }}</QNotice>
            <QButton variant="primary" size="large" type="submit" full-width>{{ t.placeOrder }}</QButton>
          </QForm>

          <aside class="columns__side">
            <QOrderSummary
              :items="items"
              :subtotal="subtotal"
              :totals="[{ label: t.shipping, amount: shipping, free: !shipping }]"
              :total="subtotal + shipping"
              :tax-note="t.taxNote"
              collapsible="auto"
            />
          </aside>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
