// src/api/filesystem.ts
/**
 * File system helpers for saving/copying/deleting images using Expo FileSystem.
 * These helpers keep image handling robust across platforms (android / ios).
 *
 * Behavior:
 * - saveImageToAppDir: copy the provided URI into the app's documentDirectory/images/<fileName>.<ext>
 * - removeFileIfExists: delete a file if it exists (safe / idempotent)
 *
 * Note: The passed `uri` can be a local file URI returned by ImagePicker or camera.
 */

import * as FileSystem from "expo-file-system";

/**
 * Save a source image URI into the app document directory under images/.
 * Returns the destination URI on success. On failure, returns the original uri.
 */
export async function saveImageToAppDir(sourceUri: string, fileName: string): Promise<string> {
  try {
    // extract extension if present
    const maybeExt = sourceUri.split(".").pop()?.split("?")[0];
    const ext = maybeExt && maybeExt.length <= 5 ? maybeExt : "jpg";
    const dir = FileSystem.documentDirectory + "images/";
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    const dest = `${dir}${fileName}.${ext}`;

    // Use copyAsync so original stays if it's in camera roll; using moveAsync might cause issues
    await FileSystem.copyAsync({ from: sourceUri, to: dest });
    return dest;
  } catch (e) {
    console.warn("saveImageToAppDir error:", e);
    // return the source uri as a fallback so calling code can still display it
    return sourceUri;
  }
}

/**
 * Delete the file at `uri` if it exists. Returns true when deleted or not present.
 */
export async function removeFileIfExists(uri: string): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
    return true;
  } catch (e) {
    console.warn("removeFileIfExists error:", e);
    return false;
  }
}

/**
 * Optionally: find orphan image files in the images directory that are not referenced
 * by any note. This requires the caller to pass the list of valid URIs (from notes).
 * Returns list of files deleted.
 */
export async function cleanupOrphanImages(validUris: string[]): Promise<string[]> {
  const dir = `${FileSystem.documentDirectory}images/`;
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) return [];
    const listing = await FileSystem.readDirectoryAsync(dir);
    const deleted: string[] = [];

    for (const file of listing) {
      const full = `${dir}${file}`;
      if (!validUris.includes(full)) {
        try {
          await FileSystem.deleteAsync(full, { idempotent: true });
          deleted.push(full);
        } catch (e) {
          console.warn("cleanup: failed delete", full, e);
        }
      }
    }

    return deleted;
  } catch (e) {
    console.warn("cleanupOrphanImages error:", e);
    return [];
  }
}
