<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { type CarbonIcon } from 'carbon-icons-svelte'
  import { twMerge } from 'tailwind-merge'

  export let icon: typeof CarbonIcon
  export let handleClick: VoidFunction
  export let tooltipText = ''
  export let btnClass = ''
  export let iconClass = ''
  export let ariaLabel = ''
</script>

<div class="relative group">
  <button
    type="button"
    class={twMerge(
      `text-gray-100 bg-transparent rounded-lg text-sm w-8 h-8 top-2.5 end-2.5 inline-flex items-center justify-center hover:bg-gray-600 hover:text-gray-100 ${btnClass}`,
    )}
    aria-label={ariaLabel}
    on:click={handleClick}
    {...$$props}
  >
    <svelte:component this={icon} class={twMerge(`w-5 h-5 ${iconClass}`)} />
  </button>
  {#if tooltipText}
    <div class="my-tooltip bg-gray-700 whitespace-nowrap">
      <span>{tooltipText}</span>
    </div>
  {/if}
</div>

<style>
  /* Tooltip container styles */
  .my-tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: var(--bg-gray-700, #374151);
    color: var(--text-gray-100, #f3f4f6);
    font-size: 0.75rem;
    border-radius: 0.125rem;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    opacity: 0;
    transition: opacity 300ms;
    z-index: 50;
    pointer-events: none;
    white-space: nowrap;
  }

  /* Show tooltip on hover */
  .group:hover .my-tooltip {
    opacity: 0.9;
    pointer-events: auto;
  }
</style>
