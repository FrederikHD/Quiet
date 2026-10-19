# FileUpload

Adds files by choosing them or dropping them onto the field. Use it for product images, certificates, size charts and CSV imports. Like Input, it's the bare control; the label, hint and errors come from Field.

```vue
<QField label="Images" hint="JPG, PNG, WebP or GIF, up to 5 MB each.">
  <QFileUpload v-model="images" variant="images" :max-size="5 * 1024 * 1024" :max-files="8" />
</QField>
```

## Variants

- **Files** (default): a dashed drop zone with a slim "Choose files" button, then a list of the added files with their size and a remove ×. `:multiple="false"` makes it one file ("Choose a file"); a new file replaces the old one.
- **`variant="images"`:** square thumbnails in a grid, then the drop zone with "Add images". The first image is marked "Main image": the one shown in lists and on cards. Images accept JPG, PNG, WebP and GIF unless you set `accept`.

## Checks

- **`accept`:** file types, like `'.pdf,application/pdf'` or `'image/*'`. Say the type in words with `acceptLabel` ("a PDF").
- **`maxSize`:** the largest file, in bytes.
- **`maxFiles`:** the most files allowed. The button turns disabled when the limit is reached.

A rejected file is never added. Under the zone it says why, in `danger`: "“notes.txt” isn’t an image (JPG, PNG, WebP or GIF).", "“cert.pdf” is larger than 5 MB." The message is announced, and it clears with the next file chosen or dropped. Repeat the limits in the Field's `hint`, so people know them before they pick.

## Values

- **The list:** `v-model`. Each item is `{ key, name, size?, url?, file? }`.
- **Files you already have:** come with a `url`.
- **New files:** come with the `File` in `file`, plus a preview URL for images. The component releases a preview URL when its item is removed. Items still in the value keep their URL after the component unmounts, so a saved value still shows; replace them with server URLs once uploaded.
- **Uploading:** upload `file` yourself, then replace the item with its server `url`. The native input is emptied after each pick, so a plain form post (`name`) carries no files.

## Keyboard and screen readers

- The button is a real button, named by the field label and its own text: "Images, Add images". Clicking the label works too.
- Each remove button names its file: "Remove linen-shirt-blue-front.jpg". After a remove, focus moves to the remove button that took its place (or the one before), or back to the choose button.
- The "or drop them here" text is hidden from screen readers. Dropping is a shortcut, never the only way.
- A rejection message is a polite live region and is tied to the button as its description until the next pick.
- `aria-invalid` is set on the button while the field is invalid.

## States

- **Drag over:** the zone turns `brand-tint` with a solid `brand` border.
- **Invalid:** a `danger` border on the zone, from the Field's `error` or `invalid`.
- **Disabled:** a `surface-sunken` zone, a disabled button, no remove buttons, and drops are ignored. Follows the Field's `disabled`.
- **Full:** with `maxFiles` reached, the choose button is disabled until a file is removed.

## What you provide

- **Required:** a label, through Field (`<QField label="Images">`).
- **Optional:** `variant` (`files` | `images`, default `files`), `multiple` (default `true` for images, `false` for files), `accept` (default for images: JPG, PNG, WebP, GIF), `acceptLabel` ("a PDF"), `maxSize` (bytes), `maxFiles`, `disabled`, `invalid`, `name`, `id` (on the choose button; the Field's id wins).
- **v-model:** `v-model` (the list, `{ key, name, size?, url?, file? }[]`, default `[]`).
- **Translations:** `strings`, or once with `configure({ strings: { upload: … } })` — `choose` ("Choose files"), `chooseOne` ("Choose a file"), `chooseImages` ("Add images"), `drop` ("or drop them here"), `dropOne` ("or drop it here"), `remove(name)` ("Remove linen.jpg"), `main` ("Main image"), `tooBig(name, max)` ("“cert.pdf” is larger than 5 MB."), `wrongType(name, accept)` ("“notes.txt” isn’t a PDF."), `tooMany(max)` ("Only 3 files can be added."), `acceptImages` ("an image (JPG, PNG, WebP or GIF)").
