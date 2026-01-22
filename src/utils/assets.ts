import { useEffect, useState } from "react";

let imageManifest: Record<string, string> = {};

/**
 * Helper to resolve asset paths with base URL and manifest (cache busting)
 * @param path - Original path to the asset (e.g., 'logo.png' or 'symptoms/spots.png')
 * @returns Resolved URL for the asset
 */
export async function resolveAsset(path: string | undefined): Promise<string | undefined> {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;

  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  // In production, try to use WebP from manifest
  if (import.meta.env.PROD) {
    // Load manifest if not loaded yet
    if (Object.keys(imageManifest).length === 0) {
      try {
        const manifests = import.meta.glob("../../build-cache/images-manifest.json", { eager: true });
        const manifestPath = "../../build-cache/images-manifest.json";
        if (manifests[manifestPath]) {
          const manifest: any = manifests[manifestPath];
          imageManifest = manifest.default || manifest;
        } else {
          imageManifest = { __failed: "true" };
        }
      } catch (e) {
        console.warn("Images manifest not found, falling back to original paths");
        imageManifest = { __failed: "true" }; // Mark as failed to avoid retrying
      }
    }

    const manifestKey = path.toLowerCase().endsWith('.png') 
      ? path.replace(/\.png$/i, '.webp') 
      : path;
            
    const hashedName = imageManifest[manifestKey];
    
    if (hashedName) {
      let finalPath;
      if (path.includes('/')) {
        const dir = path.substring(0, path.lastIndexOf('/') + 1);
        finalPath = dir + hashedName;
      } else {
        finalPath = hashedName;
      }
      const normalizedPath = finalPath.startsWith('/') ? finalPath.substring(1) : finalPath;
      return `${normalizedBase}${normalizedPath}`;
    }
  }

  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Hook to resolve asset path in components
 */
export function useAsset(path: string | undefined) {
  const [resolved, setResolved] = useState<string | undefined>();

  useEffect(() => {
    resolveAsset(path).then(setResolved);
  }, [path]);

  return resolved;
}
