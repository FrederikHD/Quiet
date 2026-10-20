import { readFileSync } from 'node:fs';
import { URL as NodeURL } from 'node:url';
import { mount } from '@vue/test-utils';
import { QField, QFileUpload, formatSize, type FileUploadItem } from '@frederikhd/quiet';
import { beforeEach, describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

const file = (name: string, size: number, type: string) => {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};
// What the native input hands over after choosing files.
async function choose(w: ReturnType<typeof mount>, files: File[]) {
  const input = w.get('input[type="file"]');
  Object.defineProperty(input.element, 'files', { value: files, configurable: true });
  await input.trigger('change');
}

beforeEach(() => {
  URL.createObjectURL = () => 'blob:preview';
  URL.revokeObjectURL = () => {};
});

describe('QFileUpload', () => {
  it('is a choose button over a hidden file input', () => {
    const w = mount(QFileUpload, { props: { name: 'docs' } });
    const input = w.get('input[type="file"]');
    expect(input.attributes('tabindex')).toBe('-1');
    expect(input.attributes('aria-hidden')).toBe('true');
    expect(input.attributes('name')).toBe('docs');
    expect(input.attributes('multiple')).toBeUndefined();
    const btn = w.get('button.q-btn');
    expect(btn.text()).toBe('Choose a file');
    expect(w.get('.q-upload__hint').text()).toBe('or drop it here');
    expect(w.get('.q-upload__msg').attributes('aria-live')).toBe('polite');
  });

  it('takes several images in the images variant, list first', () => {
    const w = mount(QFileUpload, {
      props: { variant: 'images', modelValue: [{ key: 'a', name: 'front.jpg', size: 284000, url: 'x.jpg' }] },
    });
    expect(w.get('.q-upload').classes()).toContain('q-upload--images');
    expect(w.get('input').attributes('multiple')).toBeDefined();
    expect(w.get('input').attributes('accept')).toBe('image/jpeg,image/png,image/webp,image/gif');
    expect(w.get('button.q-btn').text()).toBe('Add images');
    const children = w.get('.q-upload').element.children;
    expect(children[0].querySelector('.q-upload__list--images')).not.toBeNull();
    expect(w.get('.q-upload__thumb img').attributes('alt')).toBe('');
    expect(w.get('.q-upload__meta').text()).toBe(`Main image · ${formatSize(284000)}`);
  });

  it('adds chosen files and emits the new list', async () => {
    const w = mount(QFileUpload, { props: { multiple: true } });
    await choose(w, [file('a.pdf', 2048, 'application/pdf'), file('b.png', 4096, 'image/png')]);
    const list = w.emitted('update:modelValue')!.at(-1)![0] as FileUploadItem[];
    expect(list.map((i) => i.name)).toEqual(['a.pdf', 'b.png']);
    expect(list[0].url).toBeNull();
    expect(list[1].url).toBe('blob:preview');
    expect(list[0].file).toBeInstanceOf(File);
    expect(w.findAll('.q-upload__item')).toHaveLength(2);
    expect(w.get('.q-upload__meta').text()).toBe('2 KB');
  });

  it('replaces the file when only one is allowed', async () => {
    const w = mount(QFileUpload, { props: { modelValue: [{ key: 'old', name: 'old.pdf' }] } });
    await choose(w, [file('new.pdf', 10, 'application/pdf')]);
    expect((w.emitted('update:modelValue')!.at(-1)![0] as FileUploadItem[]).map((i) => i.name)).toEqual(['new.pdf']);
  });

  it('rejects the wrong type, too big and too many — and says why', async () => {
    const w = mount(QFileUpload, {
      props: { multiple: true, accept: '.pdf', acceptLabel: 'a PDF', maxSize: 1048576, maxFiles: 1 },
    });
    await choose(w, [
      file('photo.jpg', 10, 'image/jpeg'),
      file('huge.pdf', 5 * 1048576, 'application/pdf'),
      file('a.pdf', 10, ''),
      file('b.pdf', 10, ''),
    ]);
    const msgs = w.findAll('.q-upload__msg .q-field__msg--error').map((m) => m.text());
    expect(msgs).toEqual(['“photo.jpg” isn’t a PDF.', '“huge.pdf” is larger than 1 MB.', 'Only 1 file can be added.']);
    expect((w.emitted('update:modelValue')!.at(-1)![0] as FileUploadItem[]).map((i) => i.name)).toEqual(['a.pdf']);
    const msgId = w.get('.q-upload__msg').attributes('id');
    expect(w.get('button.q-btn').attributes('aria-describedby')).toContain(msgId);
  });

  it('disables the choose button when the list is full', () => {
    const w = mount(QFileUpload, {
      props: { variant: 'images', maxFiles: 1, modelValue: [{ key: 'a', name: 'a.jpg' }] },
    });
    expect(w.get('.q-upload__zone button').attributes('disabled')).toBeDefined();
  });

  it('removes a file and keeps focus in the component', async () => {
    const w = mount(QFileUpload, {
      attachTo: document.body,
      props: {
        multiple: true,
        modelValue: [
          { key: 'a', name: 'a.pdf' },
          { key: 'b', name: 'b.pdf' },
        ],
        'onUpdate:modelValue': (v: FileUploadItem[]) => w.setProps({ modelValue: v }),
      },
    });
    const remove = w.findAll('.q-upload__remove');
    expect(remove[0].attributes('aria-label')).toBe('Remove a.pdf');
    await remove[1].trigger('click');
    await nextTick();
    await nextTick();
    expect(w.findAll('.q-upload__item')).toHaveLength(1);
    expect(document.activeElement).toBe(w.get('.q-upload__remove').element);
    await w.get('.q-upload__remove').trigger('click');
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(w.get('.q-upload__zone .q-btn').element);
    w.unmount();
  });

  it('adds dropped files and highlights the zone while dragging', async () => {
    const w = mount(QFileUpload);
    const zone = w.get('.q-upload__zone');
    await zone.trigger('dragover');
    expect(zone.classes()).toContain('is-over');
    await zone.trigger('drop', { dataTransfer: { files: [file('a.pdf', 10, 'application/pdf')] } });
    expect(zone.classes()).not.toContain('is-over');
    expect(w.emitted('update:modelValue')).toHaveLength(1);
  });

  it('takes its id, name, disabled and invalid from the Field', () => {
    const w = mount(QField, {
      props: { id: 'cert', label: 'Certificate', hint: 'One PDF', error: 'Add the certificate', disabled: true },
      slots: { default: () => h(QFileUpload, { modelValue: [{ key: 'a', name: 'a.pdf' }] }) },
    });
    const btn = w.get('.q-upload__zone .q-btn');
    expect(btn.attributes('id')).toBe('cert');
    const textId = btn.get('span[id]').attributes('id');
    // Named by the label and its own text: "Certificate, Choose a file".
    expect(btn.attributes('aria-labelledby')).toBe(`cert-label ${textId}`);
    expect(btn.attributes('aria-describedby')).toContain('cert-hint');
    expect(btn.attributes('aria-invalid')).toBe('true');
    expect(btn.attributes('disabled')).toBeDefined();
    expect(w.get('.q-upload').classes()).toEqual(expect.arrayContaining(['is-invalid', 'is-disabled']));
    expect(w.find('.q-upload__remove').exists()).toBe(false);
  });

  it('honours aria-invalid and aria-label passed to it', () => {
    const w = mount(QFileUpload, { attrs: { 'aria-invalid': 'true', 'aria-label': 'Upload certificate' } });
    const btn = w.get('.q-upload__zone .q-btn');
    expect(btn.attributes('aria-invalid')).toBe('true');
    expect(btn.attributes('aria-label')).toBe('Upload certificate');
    expect(btn.attributes('aria-labelledby')).toBeUndefined();
  });

  it('takes its own strings', () => {
    const w = mount(QFileUpload, { props: { strings: { chooseOne: 'Datei wählen', dropOne: 'oder hierher ziehen' } } });
    expect(w.get('.q-btn').text()).toBe('Datei wählen');
    expect(w.get('.q-upload__hint').text()).toBe('oder hierher ziehen');
  });

  it('never hides its message live region with display:none, so a later message is announced', () => {
    const css = readFileSync(new NodeURL('../../quiet/src/components/FileUpload/style.css', import.meta.url), 'utf8');
    const rules = css.split('}').filter((r) => r.includes('.q-upload__msg'));
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) expect(r).not.toMatch(/display:\s*none/);
  });
  describe('reordering', () => {
    const three = (): FileUploadItem[] => [
      { key: 'a', name: 'front.jpg' },
      { key: 'b', name: 'back.jpg' },
      { key: 'c', name: 'detail.jpg' },
    ];
    const mountImages = () => {
      const w = mount(QFileUpload, {
        attachTo: document.body,
        props: {
          variant: 'images' as const,
          modelValue: three(),
          'onUpdate:modelValue': (v: FileUploadItem[]) => w.setProps({ modelValue: v }),
        },
      });
      return w;
    };
    const names = (w: ReturnType<typeof mount>) => w.findAll('.q-upload__name').map((n) => n.text());

    it('puts a handle on each image, named by its file and described by its position', () => {
      const w = mountImages();
      const handles = w.findAll('.q-upload__move');
      expect(handles).toHaveLength(3);
      expect(handles[1].attributes('aria-label')).toBe('Move back.jpg');
      const desc = document.getElementById(handles[1].attributes('aria-describedby')!);
      expect(desc?.textContent).toBe('Position 2 of 3. The arrow keys move it.');
      w.unmount();
    });

    it('has no handle for files unless asked, when disabled, or with a single item', () => {
      const files = mount(QFileUpload, { props: { multiple: true, modelValue: three() } });
      expect(files.find('.q-upload__move').exists()).toBe(false);
      const asked = mount(QFileUpload, { props: { multiple: true, reorderable: true, modelValue: three() } });
      expect(asked.findAll('.q-upload__move')).toHaveLength(3);
      const disabled = mount(QFileUpload, { props: { variant: 'images', disabled: true, modelValue: three() } });
      expect(disabled.find('.q-upload__move').exists()).toBe(false);
      const one = mount(QFileUpload, { props: { variant: 'images', modelValue: three().slice(0, 1) } });
      expect(one.find('.q-upload__move').exists()).toBe(false);
    });

    it('moves with the arrow keys, Home and End, keeps focus on the handle and announces the move', async () => {
      const w = mountImages();
      const status = () => w.get('.q-visually-hidden[aria-live="polite"]').text();
      await w.findAll('.q-upload__move')[0].trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      await nextTick();
      expect(names(w)).toEqual(['back.jpg', 'front.jpg', 'detail.jpg']);
      expect(document.activeElement).toBe(w.findAll('.q-upload__move')[1].element);
      expect(status()).toBe('front.jpg moved to position 2 of 3.');

      await w.findAll('.q-upload__move')[2].trigger('keydown', { key: 'Home' });
      await nextTick();
      await nextTick();
      expect(names(w)).toEqual(['detail.jpg', 'back.jpg', 'front.jpg']);
      expect(status()).toBe('detail.jpg is now the main image.');
      expect(w.get('.q-upload__meta').text()).toBe('Main image');

      await w.findAll('.q-upload__move')[0].trigger('keydown', { key: 'End' });
      expect(names(w)).toEqual(['back.jpg', 'front.jpg', 'detail.jpg']);
      await w.findAll('.q-upload__move')[0].trigger('keydown', { key: 'ArrowUp' });
      expect(names(w)).toEqual(['back.jpg', 'front.jpg', 'detail.jpg']);
      w.unmount();
    });

    it('offers the moves that make sense in its menu', async () => {
      const w = mountImages();
      await w.findAll('.q-upload__move')[0].trigger('click');
      await nextTick();
      let items = Array.from(document.querySelectorAll('[role="menuitem"]')).map((m) => m.textContent?.trim());
      expect(items).toEqual(['Move later', 'Move to the end']);
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await nextTick();

      await w.findAll('.q-upload__move')[2].trigger('click');
      await nextTick();
      items = Array.from(document.querySelectorAll('[role="menuitem"]')).map((m) => m.textContent?.trim());
      expect(items).toContain('Make main image');
      expect(items).toContain('Move earlier');
      Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
        .find((m) => m.textContent?.includes('Make main image'))!
        .click();
      await nextTick();
      expect(names(w)).toEqual(['detail.jpg', 'front.jpg', 'back.jpg']);
      w.unmount();
    });
  });
});
