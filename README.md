# npm-injector

> Dynamically import any npm package from CDN at runtime — no install needed!

`npm-injector` lets you load npm packages from CDNs like esm.sh, Skypack, unpkg, or jsDelivr directly in your app — perfect for plugins, extensions, micro frontends, playgrounds, or reducing bundle size.

---

## ✨ Features

- ⚡ Dynamic `import()` from CDN
- 🎯 Supports subpaths and versions (`lodash@4.17.21/debounce`)
- 🧠 Smart CDN fallback (esm.sh → skypack → jsdelivr → unpkg)
- 🧩 Auto CSS injection
- 🧵 Inject any script or style manually
- 🧪 Ideal for Vite, React, Next.js, and browser apps

---

## 📦 Installation

```bash
npm install npm-injector

```
### `injectImport<T>(pkgName: string): Promise<T>`

Dynamically import a module from a CDN.

```ts
const lodash = await injectImport('lodash');
console.log(lodash.VERSION);

```

### `injectStyle(href: string): void`

Inject a remote CSS stylesheet.

```ts
injectStyle('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
```

### `injectScript(src: string): Promise<void>`

Inject an external script tag.

```ts
await injectScript('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');
```

---

## 🧪 Using as a Module (ESM)

You can use `npm-injector` directly in your app code.

### Example: React + Vite + Toastify

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { injectImport, injectStyle } from 'npm-injector';

function App() {
  useEffect(() => {
    injectStyle('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

    injectImport('toastify-js').then((Toastify) => {
      Toastify({
        text: 'Hello from toastify!',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      }).showToast();
    });
  }, []);

  return <h1>Toast Example</h1>;
}

export default App;
```

---

## 🧠 Use Cases

* 📦 Load optional dependencies only when needed
* 🛠️ Create extensible apps with plugin support
* 🎯 Micro frontend scenarios with isolated packages
* 🎨 UI playgrounds or sandboxes
* ⚙️ Lightweight embedding for third-party integrations

---

## 📁 CDN Examples

* `lodash` → `lodash`
* `react-use` → `react-use`
* `sonner` → `sonner` *(with CSS injection)*
* `lodash/debounce` → subpath import
* `axios@1.6.5` → specific version

---

## ⚠️ Notes

* Works best in modern browsers with `import()`
* Some server-side (SSR) use cases may require conditionals
* CDN fallback order is: `esm.sh → skypack.dev → jsdelivr → unpkg`