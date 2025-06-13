<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { page } from '$app/stores'
  import { ChevronDown, Close, Filter } from 'carbon-icons-svelte'

  import { routes } from '../routes'
  import { isSidebarExpanded } from '../store'

  import './styles.css'

  import type { UIConfig } from '$lib/types'

  export let config: UIConfig

  let bannerCfg = config.classBannerCfg
  let dbLoaded = config.databaseLoaded
  let searchValue = ''
  let isSidebarHovered = false

  const toggleSubmenus: Record<string, boolean> = {}

  routes.forEach((route) => {
    toggleSubmenus[route.path] = $page.url.pathname.includes(route.path)
  })

  let filtered = routes

  // Filter routes, if matching parent, show all children
  function filterRoutes() {
    const filter = searchValue.toLowerCase()
    if (filter === '') {
      // Close all submenus on clear
      routes.forEach((route) => {
        toggleSubmenus[route.path] = false
      })
      filtered = routes
      return
    }

    filtered = routes
      // Deep-cloning routes to avoid modifying the original array
      .map((route) => ({ ...route }))
      // Filter routes based on the search query
      .filter((route) => {
        // If the parent route matches the search query, show all children
        if (route.name.toLowerCase().includes(filter)) {
          return true
        }

        // If the parent route doesn't match the search query, filter children
        if (route.children) {
          route.children = route.children.filter((child) => child.name.toLowerCase().includes(filter))
          return route.children.length > 0
        }
      })
      // Show all children of the matching parent
      .map((route) => {
        toggleSubmenus[route.path] = true
        return route
      })
  }

  // If link was clicked, updating url, but path is a child route that is currently not renendered
  // we need to toggle the submenu to show the child route
  function updateOnLinkClicks(path: string) {
    for (const route of routes) {
      if (path.includes(route.path) && !toggleSubmenus[route.path]) {
        toggleSubmenus[route.path] = true
      }
    }
  }

  $: isSidebarExpandedOrHovered = $isSidebarExpanded || isSidebarHovered

  $: if ($page.url.pathname) {
    updateOnLinkClicks($page.url.pathname)
  }

  $: if (!dbLoaded) {
    filtered = routes.map((route) => {
      if (route.name === 'Security') {
        route.hide = true
      }
      return route
    })
  }

  function handleClearSearch() {
    searchValue = ''
    filterRoutes()
  }
</script>

<aside
  data-testid="main-sidebar"
  id="sidebar"
  aria-labelledby="toggle-sidebar-id"
  class="fixed h-full max-h-[calc(100vh-3.5rem)] top-14 left-0 z-40 -translate-x-full transition-all duration-300 ease-in-out sm:translate-x-0 hover:w-64 {$isSidebarExpanded
    ? 'w-64'
    : 'w-16'} group"
  class:top-20={bannerCfg.enabled}
  class:with-header={bannerCfg.enabled && !bannerCfg.footer}
  class:with-banners={bannerCfg.enabled && bannerCfg.footer}
  on:mouseenter={() => (isSidebarHovered = true)}
  on:mouseleave={() => (isSidebarHovered = false)}
>
  <div
    class="h-full overflow-y-auto border-r py-5 border-gray-800 bg-gray-900 flex flex-col group-hover:px-3 group-hover:items-stretch {$isSidebarExpanded
      ? 'px-3'
      : 'items-center'}"
  >
    <div class="flex mb-4">
      <div class="relative w-full">
        <div
          class="flex absolute inset-y-0 left-0 items-center pointer-events-none {isSidebarExpandedOrHovered
            ? 'pl-2'
            : 'pl-5'}"
        >
          <Filter class="icon" />
        </div>
        <input
          type="search"
          id="sidebar-filter"
          bind:value={searchValue}
          class={`border text-sm rounded-lg ${isSidebarExpandedOrHovered && 'pe-10'}  block w-full pl-10 bg-gray-800 border-gray-600 placeholder-gray-300 text-gray-100 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-search-cancel-button]:hidden`}
          placeholder="Filter Pages"
          on:keyup={filterRoutes}
          on:input={filterRoutes}
        />
        <div class="absolute inset-y-0 end-0 flex items-center pe-3">
          {#if searchValue && isSidebarExpandedOrHovered}
            <button data-testid="clear-search-btn" type="button" on:click={handleClearSearch}>
              <Close class="icon hover:!text-gray-100" />
            </button>
          {/if}
        </div>
      </div>
    </div>
    <ul class="flex flex-col gap-y-2">
      {#each filtered as route}
        <li class={route.class} hidden={route.hide}>
          {#if route.children}
            <button
              type="button"
              class="group flex w-full items-center rounded-lg p-2 text-base font-normal transition duration-300 text-gray-100 hover:bg-gray-700"
              on:click={() => (toggleSubmenus[route.path] = !toggleSubmenus[route.path])}
            >
              <svelte:component
                this={route.icon}
                class={`icon ${$page.url.pathname.includes(route.path) && 'active'}`}
              />
              <span class="expanded-only ml-3 flex-1 whitespace-nowrap text-left">{route.name}</span>
              <ChevronDown
                class="expanded-only h-4 w-4 transition duration-300 {toggleSubmenus[route.path]
                  ? '-rotate-180 transform'
                  : ''}"
              />
            </button>
            <ul class="expanded-only flex flex-col gap-y-2 py-2 {toggleSubmenus[route.path] ? '' : 'hidden'}">
              {#each route.children as child}
                <li>
                  <a
                    href={route.path + child.path}
                    class="group flex w-full items-center rounded-lg p-2 pl-11 text-base font-light transition duration-300 text-gray-100 hover:bg-gray-700"
                    class:active={$page.url.pathname.includes(route.path + child.path)}
                  >
                    {child.name}
                  </a>
                </li>
              {/each}
            </ul>
          {:else}
            <a
              href={route.path}
              class="group flex items-center rounded-lg p-2 text-base font-normal text-gray-100 hover:bg-gray-700"
              class:active={$page.url.pathname === route.path}
            >
              <svelte:component this={route.icon} class={`icon ${$page.url.pathname === route.path && 'active'}`} />
              <span class="expanded-only ml-3">{route.name}</span>
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</aside>

<style>
  /* Calculating height of sidebar based on the height of the banners (header and footer) + navbar */
  .with-banners {
    height: calc(100vh - 6rem);
  }
  /* Calculating height of sidebar based on the height of the banner (header only) + navbar */
  .with-header {
    height: calc(100vh - 5rem);
  }
</style>
