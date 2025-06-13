<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { page } from '$app/stores'
  import { authenticated } from '$features/auth/store'

  import { isSidebarExpanded } from '../store'

  // Don't expand sidebar if api auth is enabled and user is unauthenticated
  $: {
    if ($authenticated && $page.url.pathname !== '/logs') {
      isSidebarExpanded.set(true)
    } else {
      isSidebarExpanded.set(false)
    }
  }
</script>

<div class="bg-gray-50 antialiased">
  <nav class="fixed left-0 right-0 z-50 border-b px-4 py-2.5 border-gray-700 bg-gray-900">
    <div class="flex flex-wrap items-center justify-between">
      <div class="flex items-center justify-start">
        {#if $authenticated && $page.url.pathname !== '/logs'}
          <button
            id="toggle-sidebar-id"
            data-testid="toggle-sidebar"
            aria-label="Toggle Sidebar"
            aria-expanded="true"
            aria-controls="sidebar"
            on:click={() => isSidebarExpanded.update((v) => !v)}
            class="mr-3 cursor-pointer rounded-sm p-2 lg:inline text-gray-100 hover:bg-gray-700 hover:text-gray-100"
          >
            <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h14M1 6h14M1 11h7"
              />
            </svg>
          </button>
        {/if}
        <a href="/" class="mr-4 flex">
          <img src="/doug.svg" class="mr-3 h-8" alt="FlowBite Logo" />
          <span class="self-center whitespace-nowrap text-2xl font-semibold text-gray-100">UDS</span>
        </a>
      </div>
    </div>
  </nav>
</div>
