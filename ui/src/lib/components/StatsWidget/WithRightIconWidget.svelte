<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { Card } from '$components'
  import { type CarbonIcon } from 'carbon-icons-svelte'

  type IconThemeType = 'primary' | 'warning' | 'critical'

  const themeMapping = {
    primary: {
      bgColor: 'bg-blue-900',
      iconColor: 'fill-blue-500',
    },
    warning: {
      bgColor: 'bg-amber-100',
      iconColor: 'fill-amber-500',
    },
    critical: {
      bgColor: 'bg-pink-200',
      iconColor: 'fill-red-400',
    },
  } as const

  export let statText: string
  export let helperText: string
  export let icon: typeof CarbonIcon
  export let link: string = ''
  export let iconTheme: IconThemeType = 'primary'

  $: iconThemeOption = themeMapping[iconTheme]
</script>

<Card {link}>
  <div class="flex items-center justify-start gap-x-4">
    <div class="{iconThemeOption['bgColor']} p-3 rounded-md">
      <svelte:component this={icon} size={24} class={iconThemeOption['iconColor']} />
    </div>

    <div class="flex flex-col items-start">
      <span
        class="text-3xl font-semibold text-gray-100 truncate"
        data-testid={`resource-count-${helperText.split(' ')[0].toLowerCase()}`}
      >
        {statText}
      </span>
      <span class="mt-1 text-sm text-gray-100">
        {helperText}
      </span>
    </div>
  </div>
</Card>
