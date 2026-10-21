// Type-only: fails the explorer's typecheck when a namespace or phrase is missing from the German guide (de.ts).
// Nothing imports this file or de.ts as code; the Translations guide shows de.ts as text.
import type { QuietStrings } from '@frederikhd/quiet';

type Complete<T> = { [K in keyof T as string extends K ? never : K]-?: Required<NonNullable<T[K]>> };
type Check<T extends Complete<QuietStrings>> = T;
export type GermanIsComplete = Check<typeof import('./de').de>;
