<!-- A storefront checkout in three steps and its confirmation, built only from Quiet's components. -->
<script setup lang="ts">
import {
  QAddressFields,
  QButton,
  QCheckbox,
  QCheckboxGroup,
  QDescriptionList,
  QDiscountCode,
  QField,
  QFieldGroup,
  QForm,
  QFormActions,
  QFormSection,
  QIcon,
  QInput,
  QOrderSummary,
  QRadio,
  QRadioGroup,
  QSteps,
  money,
  validateAddress,
  type Address,
  type FormError,
  type OrderSummaryItem,
} from '@frederikhd/quiet';
import { computed, nextTick, ref } from 'vue';
import { photo } from '../fixtures/pictures';

const steps = [{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }];
// 0–2: the steps; 3: the confirmation.
const step = ref(0);
const top = ref<HTMLElement | null>(null);
async function go(to: number) {
  step.value = to;
  tried.value = false;
  await nextTick();
  // A new step starts at the top, with focus on its heading.
  top.value?.scrollIntoView({ block: 'start' });
  top.value?.querySelector<HTMLElement>('h2')?.focus();
}

// The cart.
const items: OrderSummaryItem[] = [
  { id: 1, name: 'Linen shirt', variant: 'Navy · M', quantity: 1, price: 59, image: { src: photo('Navy') } },
  { id: 2, name: 'Linen trousers', variant: 'Sand · 32', quantity: 1, price: 79, image: { src: photo('Sand', 2) } },
];
const subtotal = items.reduce((n, i) => n + i.price, 0);
const codes = ref<string[]>([]);
const discount = computed(() => (codes.value.length ? Math.round(subtotal * 10) / 100 : 0));
function applyCode(code: string) {
  if (code.trim().toUpperCase() !== 'LINEN10') return `“${code}” isn’t a valid code`;
  codes.value = ['LINEN10'];
}

// Step 1: contact and addresses.
const email = ref('anna.schmidt@example.com');
const shipping = ref<Address>({ country: 'DE', firstName: 'Anna', lastName: 'Schmidt' });
const sameBilling = ref(true);
const billing = ref<Address>({ country: 'DE' });
const tried = ref(false);
const shipCheck = computed(() => validateAddress(shipping.value, { idPrefix: 'ship' }));
const billCheck = computed(() => validateAddress(billing.value, { idPrefix: 'bill', fields: { phone: 'hidden' } }));
const emailError = computed(() =>
  !email.value.trim() ? 'Enter your email' : /^\S+@\S+\.\S+$/.test(email.value) ? null : 'Check your email address',
);
const addressErrors = computed<FormError[]>(() => [
  ...(emailError.value ? [{ id: 'co-email', message: emailError.value }] : []),
  ...shipCheck.value.list,
  ...(sameBilling.value ? [] : billCheck.value.list),
]);

// Step 2: delivery.
const deliveries = {
  standard: { label: 'Standard', detail: '2–4 working days', price: 4.9 },
  express: { label: 'Express', detail: 'Next working day', price: 9.9 },
  pickup: { label: 'Pick up in Fulda', detail: 'Ready tomorrow from 10:00', price: 0 },
} as const;
type Delivery = keyof typeof deliveries;
const delivery = ref<Delivery | null>(null);
// Free standard delivery from 50 € (after the discount).
const shippingCost = computed(() =>
  !delivery.value
    ? null
    : delivery.value === 'standard' && subtotal - discount.value >= 50
      ? 0
      : deliveries[delivery.value].price,
);

// Step 3: payment.
const payment = ref<'card' | 'paypal' | 'invoice' | null>(null);
const card = ref({ number: '', expiry: '', cvc: '' });
const terms = ref(false);
const paymentErrors = computed<FormError[]>(() => [
  ...(!payment.value ? [{ id: 'co-pay', message: 'Choose how to pay' }] : []),
  ...(payment.value === 'card' && card.value.number.replace(/\s/g, '').length < 12
    ? [{ id: 'co-card', message: 'Enter the card number' }]
    : []),
  ...(!terms.value ? [{ id: 'co-terms', message: 'Accept the terms to place your order' }] : []),
]);
const err = (list: FormError[], id: string) => (tried.value ? list.find((e) => e.id === id)?.message : undefined);

const total = computed(() => subtotal - discount.value + (shippingCost.value ?? 0));
const vat = computed(() => total.value - total.value / 1.19);

function submit() {
  tried.value = true;
  const errors =
    step.value === 0 ? addressErrors.value : step.value === 1 ? (delivery.value ? [] : [1]) : paymentErrors.value;
  if (!errors.length) void go(step.value + 1);
}
const formErrors = computed<FormError[] | null>(() => {
  if (!tried.value) return null;
  const list =
    step.value === 0
      ? addressErrors.value
      : step.value === 1
        ? delivery.value
          ? []
          : [{ id: 'co-delivery', message: 'Choose a delivery method' }]
        : paymentErrors.value;
  return list.length ? list : null;
});

const nameOf = (a: Address) => `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
const addressLine = (a: Address) => `${a.line1 ?? ''}, ${a.postalCode ?? ''} ${a.city ?? ''}`;
const paymentLabel = { card: 'Card', paypal: 'PayPal', invoice: 'Invoice, within 14 days' };
</script>

<template>
  <div ref="top" class="checkout">
    <header class="checkout__header">
      <span class="checkout__brand">Leinen &amp; Co</span>
      <span class="checkout__secure"><QIcon name="lock" /> Secure checkout</span>
    </header>

    <div class="checkout__body">
      <main class="checkout__main">
        <template v-if="step < 3">
          <QSteps :steps="steps" :current="step" @select="(i) => go(i)" />

          <QForm
            :id="`co-step-${step}`"
            label-placement="top"
            markers="optional"
            :errors="formErrors"
            @submit.prevent="submit"
          >
            <template v-if="step === 0">
              <h2 class="checkout__title" tabindex="-1">Address</h2>
              <QFormSection title="Contact" :heading-level="3">
                <QField
                  id="co-email"
                  required
                  label="Email"
                  hint="For the order confirmation and delivery updates."
                  :error="tried ? emailError : null"
                >
                  <QInput v-model="email" type="email" autocomplete="email" />
                </QField>
              </QFormSection>
              <QFormSection title="Delivery address" :heading-level="3">
                <QAddressFields v-model="shipping" id-prefix="ship" :errors="tried ? shipCheck.errors : {}" />
                <QCheckbox v-model="sameBilling" label="Use this address for the invoice" />
              </QFormSection>
              <QFormSection v-if="!sameBilling" title="Billing address" :heading-level="3">
                <QAddressFields
                  v-model="billing"
                  id-prefix="bill"
                  kind="billing"
                  :fields="{ phone: 'hidden' }"
                  :errors="tried ? billCheck.errors : {}"
                />
              </QFormSection>
            </template>

            <template v-else-if="step === 1">
              <h2 class="checkout__title" tabindex="-1">Shipping</h2>
              <QDescriptionList
                class="checkout__recap"
                layout="inline"
                :items="[
                  { term: 'Contact', description: email },
                  { term: 'Deliver to', description: `${nameOf(shipping)}, ${addressLine(shipping)}` },
                ]"
              />
              <QRadioGroup
                id="co-delivery"
                v-model="delivery"
                label="Delivery"
                layout="cards"
                required
                :error="tried && !delivery ? 'Choose a delivery method' : null"
              >
                <QRadio
                  v-for="(d, key) in deliveries"
                  :key="key"
                  :value="key"
                  :label="d.label"
                  :description="d.detail"
                  :meta="key === 'standard' && subtotal - discount >= 50 ? 'Free' : d.price ? money(d.price) : 'Free'"
                />
              </QRadioGroup>
            </template>

            <template v-else>
              <h2 class="checkout__title" tabindex="-1">Payment</h2>
              <QRadioGroup
                id="co-pay"
                v-model="payment"
                label="Payment"
                layout="cards"
                required
                help="You are only charged once the parcel ships."
                :error="err(paymentErrors, 'co-pay')"
              >
                <QRadio value="card" label="Card" description="Visa, Mastercard, American Express"
                  ><template #media><QIcon name="credit-card" /></template
                ></QRadio>
                <QRadio value="paypal" label="PayPal" description="You'll confirm the payment at PayPal"
                  ><template #media><QIcon name="external-link" /></template
                ></QRadio>
                <QRadio value="invoice" label="Invoice" description="Pay within 14 days of delivery"
                  ><template #media><QIcon name="mail" /></template
                ></QRadio>
              </QRadioGroup>
              <QFieldGroup v-if="payment === 'card'" :columns="[2, 1, 1]">
                <QField id="co-card" label="Card number" required :error="err(paymentErrors, 'co-card')">
                  <QInput v-model="card.number" inputmode="numeric" autocomplete="cc-number" />
                </QField>
                <QField label="Expiry" hint="MM/YY" required
                  ><QInput v-model="card.expiry" autocomplete="cc-exp"
                /></QField>
                <QField label="Security code" required
                  ><QInput v-model="card.cvc" inputmode="numeric" autocomplete="cc-csc"
                /></QField>
              </QFieldGroup>
              <QCheckboxGroup id="co-terms" required :error="err(paymentErrors, 'co-terms')">
                <QCheckbox v-model="terms" value="yes" label="I accept the terms and the cancellation policy" />
              </QCheckboxGroup>
            </template>

            <QFormActions align="between">
              <QButton v-if="step > 0" variant="ghost" icon-start="arrow-left" @click="go(step - 1)">
                Back to {{ steps[step - 1].label.toLowerCase() }}
              </QButton>
              <span v-else />
              <QButton variant="primary" size="large" type="submit">
                {{ step < 2 ? `Continue to ${steps[step + 1].label.toLowerCase()}` : `Buy now · ${money(total)}` }}
              </QButton>
            </QFormActions>
          </QForm>
        </template>

        <section v-else class="confirmation" aria-labelledby="co-thanks">
          <QIcon name="check-circle" class="confirmation__icon" />
          <h2 id="co-thanks" class="checkout__title" tabindex="-1">Thank you, {{ shipping.firstName }}</h2>
          <p class="confirmation__lead">
            Your order <strong>#10565</strong> is placed. The confirmation is on its way to <strong>{{ email }}</strong
            >.
          </p>
          <QDescriptionList
            :items="[
              {
                term: 'Delivery',
                description: delivery
                  ? `${deliveries[delivery].label}, ${deliveries[delivery].detail.toLowerCase()}`
                  : '',
              },
              { term: 'Deliver to', description: `${nameOf(shipping)}, ${addressLine(shipping)}` },
              { term: 'Payment', description: payment ? paymentLabel[payment] : '' },
            ]"
          />
          <QButton variant="primary" size="large" @click="go(0)">Continue shopping</QButton>
        </section>
      </main>

      <aside class="checkout__summary" aria-label="Your order">
        <QOrderSummary
          :items="items"
          collapsible="auto"
          :totals="[
            discount ? { label: 'Discount', detail: 'LINEN10', amount: -discount } : null,
            shippingCost == null
              ? { label: 'Shipping', amount: null, note: 'Chosen in the next step' }
              : { label: 'Shipping', detail: deliveries[delivery!].label, amount: shippingCost, free: !shippingCost },
          ]"
          :total="total"
          :tax-note="`Including ${money(vat)} VAT (19 %)`"
        >
          <QDiscountCode
            v-if="step < 3"
            :applied="codes.map((code) => ({ code, label: '−10 %' }))"
            :apply="applyCode"
            collapsible
            @remove="codes = []"
          />
        </QOrderSummary>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.checkout {
  background: var(--surface);
}
.checkout__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-6);
  padding: var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--line);
}
.checkout__brand {
  font: var(--text-title);
}
.checkout__secure {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--ink-muted);
  font: var(--text-small);
}
.checkout__body {
  display: grid;
  max-width: 1280px;
  margin: 0 auto;
}
.checkout__main {
  display: grid;
  align-content: start;
  gap: var(--space-6);
  padding: var(--space-6);
}
.checkout__summary {
  padding: var(--space-4) var(--space-6);
  background: var(--surface-sunken);
}
/* Summary first on narrow screens, folded into one row; beside the form, sticky, from 900px. */
@container (max-width: 899px) {
  .checkout__summary {
    order: -1;
  }
}
@container (min-width: 900px) {
  .checkout__body {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  }
  .checkout__summary {
    padding: var(--space-8) var(--space-6);
  }
  .checkout__summary > * {
    position: sticky;
    top: var(--space-6);
  }
}
.checkout__title {
  margin: 0;
  font: var(--text-display);
}
.checkout__title:focus {
  outline: none;
}
.checkout__recap {
  padding: var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}
.confirmation {
  display: grid;
  justify-items: start;
  gap: var(--space-6);
  max-width: 640px;
}
.confirmation__icon {
  width: 48px !important;
  height: 48px !important;
  color: var(--success);
}
.confirmation__lead {
  margin: 0;
}
</style>
