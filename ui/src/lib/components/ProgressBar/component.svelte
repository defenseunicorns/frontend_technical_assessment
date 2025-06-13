<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import type { BarSizeType, UnitType } from '$components/StatsWidget/types'

  export let size: BarSizeType = 'sm'
  export let progress: number = 0
  export let capacity: number = 0
  export let unit: UnitType = 'GB'

  let calculatedWidth = 0
  let fixedProgress: string
  let fixedCapacity: string

  $: {
    let percentage = (progress / capacity) * 100
    fixedProgress = progress.toFixed(2)
    fixedCapacity = capacity.toFixed(2)
    // Need a minimum width set for rounded corners to look right
    calculatedWidth = percentage < 2 ? 2 : percentage
  }

  $: progressText = `${fixedProgress} ${unit} of ${fixedCapacity} ${unit} used`

  const sizeMapping = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
    xl: 'h-6',
  }
</script>

<div class="flex flex-col">
  <div class="rounded-full bg-gray-700 group-hover:bg-gray-600 mt-3">
    <div
      class={`${unit === 'GB' ? 'bg-emerald-500' : 'bg-blue-600'} h-2.5 rounded-full ${sizeMapping[size]}`}
      style={`width: ${calculatedWidth}%`}
    />
  </div>

  <div class="text-xs text-left mt-1 font-normal text-gray-100 truncate text-ellipsis">
    <span>
      {progressText}
    </span>
  </div>
</div>
