// src/index.ts

/**
 * Dynamically import an npm package from CDN (esm.sh with fallbacks).
 * Supports subpaths, versioning, CSS injection, and batch imports.
 */

export interface InjectOptions {
    version?: string;
    autoInjectCss?: boolean;
    fallbackCDNs?: boolean;
  }
  
  const cdnResolvers = [
    (pkg: string) => `https://esm.sh/${pkg}`,
    (pkg: string) => `https://cdn.skypack.dev/${pkg}`,
    (pkg: string) => `https://unpkg.com/${pkg}?module`,
    (pkg: string) => `https://cdn.jsdelivr.net/npm/${pkg}`
  ];
  
  const cssMap: Record<string, string> = {
    'react-toastify': 'https://esm.sh/react-toastify/dist/ReactToastify.css',
    'react-hot-toast': 'https://esm.sh/react-hot-toast/dist/react-hot-toast.css',
  };
  
  export async function injectImport<T = any>(
    pkgName: string | string[],
    options: InjectOptions = {}
  ): Promise<T | T[]> {
    if (Array.isArray(pkgName)) {
      return Promise.all(pkgName.map((pkg) => injectImport(pkg, options))) as Promise<T[]>;
    }
  
    const fullName = options.version ? `${pkgName}@${options.version}` : pkgName;
  
    if (options.autoInjectCss && cssMap[pkgName]) {
      injectStyle(cssMap[pkgName]);
    }
  
    const urls = options.fallbackCDNs ? cdnResolvers.map(fn => fn(fullName)) : [cdnResolvers[0](fullName)];
  
    for (const url of urls) {
      try {
        const mod = await import(/* @vite-ignore */ url);
        return (mod?.default ?? mod) as T;
      } catch (err) {
        continue;
      }
    }
  
    throw new Error(`Failed to import ${pkgName} from all CDNs`);
  }
  
  export function injectStyle(url: string): void {
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
  
  export async function injectScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.body.appendChild(script);
    });
  }
  