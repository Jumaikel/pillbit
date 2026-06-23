/// <reference types="nativewind/types" />

// Allow side-effect CSS imports (used for NativeWind's global.css entry point)
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
