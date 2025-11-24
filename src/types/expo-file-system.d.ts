// src/@types/expo-file-system.d.ts
// Minimal ambient declaration to fix TS complaining about documentDirectory.
// This makes the module typed as `any` for now (practical and safe).
// Restart TS server / editor after adding.

declare module 'expo-file-system' {
  const _exports: any;
  export = _exports;
}
