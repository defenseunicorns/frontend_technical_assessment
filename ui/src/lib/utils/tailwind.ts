// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

/*
Previously, when we needed to use Tailwind utilities dynamically in a component (ex. h-${size}), we had to safelist them
in the tailwind.config.ts file to prevent Tailwind from removing what it thought were unused classes.
Tailwind v4 no longer supports or recommends safelist (although there are hacky ways around it).
The Tailwind docs here discuss issues with dynamic classes and recommends ways to handle them:
https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names
These types and constants in this file are used to handle applying dynamic tailwind utilities.
Another way around this issue is to use string prop values instead of numbers. (ex. export let height = "12"),
for components that do not use strings, use these helpers. You can also use class directives
(ex. class:h-32={height === 32}) but this can be very verbose.
*/

export const TAILWIND_MIN_WIDTHS = [
  400, 700, 800, 850, 900, 1024, 1100, 1150, 1200, 1250, 1300, 1450, 1500, 1600, 1650, 1750, 1865, 2000, 2200,
]

export const TAILWIND_SCALE = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64,
  72, 80, 96,
]

export type TailwindMinWidthType = (typeof TAILWIND_MIN_WIDTHS)[number]
export type TailwindScale = (typeof TAILWIND_SCALE)[number]

export const dynamicTailwindMinWidth: Record<TailwindMinWidthType, string> = {
  400: 'min-w-[400px]',
  700: 'min-w-[700px]',
  800: 'min-w-[800px]',
  850: 'min-w-[850px]',
  900: 'min-w-[900px]',
  1024: 'min-w-[1024px]',
  1100: 'min-w-[1100px]',
  1150: 'min-w-[1150px]',
  1200: 'min-w-[1200px]',
  1250: 'min-w-[1250px]',
  1300: 'min-w-[1300px]',
  1450: 'min-w-[1450px]',
  1500: 'min-w-[1500px]',
  1600: 'min-w-[1600px]',
  1650: 'min-w-[1650px]',
  1750: 'min-w-[1750px]',
  1865: 'min-w-[1865px]',
  2000: 'min-w-[2000px]',
  2200: 'min-w-[2200px]',
}

export const dynamicTailwindHeight: Record<TailwindScale, string> = {
  0: 'h-0',
  0.5: 'h-0.5',
  1: 'h-1',
  1.5: 'h-1.5',
  2: 'h-2',
  2.5: 'h-2.5',
  3: 'h-3',
  3.5: 'h-3.5',
  4: 'h-4',
  5: 'h-5',
  6: 'h-6',
  7: 'h-7',
  8: 'h-8',
  9: 'h-9',
  10: 'h-10',
  11: 'h-11',
  12: 'h-12',
  14: 'h-14',
  16: 'h-16',
  20: 'h-20',
  24: 'h-24',
  28: 'h-28',
  32: 'h-32',
  36: 'h-36',
  40: 'h-40',
  44: 'h-44',
  48: 'h-48',
  52: 'h-52',
  56: 'h-56',
  60: 'h-60',
  64: 'h-64',
  72: 'h-72',
  80: 'h-80',
  96: 'h-96',
}

export const dynamicTailwindWidth: Record<TailwindScale, string> = {
  0: 'w-0',
  0.5: 'w-0.5',
  1: 'w-1',
  1.5: 'w-1.5',
  2: 'w-2',
  2.5: 'w-2.5',
  3: 'w-3',
  3.5: 'w-3.5',
  4: 'w-4',
  5: 'w-5',
  6: 'w-6',
  7: 'w-7',
  8: 'w-8',
  9: 'w-9',
  10: 'w-10',
  11: 'w-11',
  12: 'w-12',
  14: 'w-14',
  16: 'w-16',
  20: 'w-20',
  24: 'w-24',
  28: 'w-28',
  32: 'w-32',
  36: 'w-36',
  40: 'w-40',
  44: 'w-44',
  48: 'w-48',
  52: 'w-52',
  56: 'w-56',
  60: 'w-60',
  64: 'w-64',
  72: 'w-72',
  80: 'w-80',
  96: 'w-96',
}
