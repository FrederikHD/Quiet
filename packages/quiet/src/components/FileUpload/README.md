# FileUpload

Adds files by choosing them or dropping them onto the field. Use it for product images, certificates, size charts and CSV imports. Like Input, it's the bare control; the label, hint and errors come from Field.

## Variants

- **Files** (default): a dashed drop zone with a slim "Choose files" button, then a list of the added files with their size and a remove ×. `:multiple="false"` makes it one file ("Choose a file"); a new file replaces the old one.
- **`variant="images"`:** square thumbnails in a grid, then the drop zone with "Add images". The first image is marked "Main image": the one shown in lists and on cards. Images accept JPG, PNG, WebP and GIF unless you set `accept`.

## Checks

- **`accept`:** file types, like `'.pdf,application/pdf'` or `'image/*'`. Say the type in words with `acceptLabel` ("a PDF").
- **`maxSize`:** the largest file, in bytes.
- **`maxFiles`:** the most files allowed. The button turns disabled when the limit is reached.

A rejected file is never added. Under the zone it says why, in `danger`: "“notes.txt” isn’t an image (JPG, PNG, WebP or GIF).", "“cert.pdf” is larger than 5 MB." The message is announced, and it clears with the next file added. Repeat the limits in the Field's `hint`, so people know them before they pick.

## Values

- **The list:** `v-model`. Each item is `{ key, name, size, url?, file? }`.
- **Files you already have:** come with a `url`.
- **New files:** come with the `File` in `file`, plus a preview URL for images. The component releases a preview URL when its item is removed. Items still in the value keep their URL after the component unmounts, so a saved value still shows; replace them with server URLs once uploaded.
- **Uploading:** upload `file` yourself, then replace the item with its server `url`.

## Keyboard and screen readers

- The button is a real button, named by the field label and its own text: "Images, Add images". Clicking the label works too.
- Each remove button names its file: "Remove linen-shirt-blue-front.jpg". After a remove, focus moves to the next remove button, or back to the add button.
- Dropping is a shortcut, never the only way.

## States

- **Drag over:** the zone turns `brand-tint` with a solid `brand` border.
- **Invalid:** a `danger` border, from the Field's `error`.
- **Disabled:** the disabled look every control shares.

## What you provide

- A label, through Field.
- `v-model`.
- **Optional:** `variant`, `multiple`, `accept`, `acceptLabel`, `maxSize`, `maxFiles`, `disabled`, `invalid`, `name`.
- **`strings`** ("Bilder hinzufügen", "oder hierher ziehen", …), or once with `configure({ strings: { upload } })`.
