<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import 'flowbite'

  import { onDestroy, onMount } from 'svelte'

  import { afterNavigate, goto } from '$app/navigation'
  import { authenticated } from '$features/auth/store'
  import { isSidebarExpanded, LoadingCluster, Navbar, Sidebar } from '$features/navigation'
  import { initFlowbite } from 'flowbite'

  import '../app.css'

  import { page } from '$app/stores'
  import { loadingCluster } from '$features/navigation/navbar/clustermenu/store'
  import { ClusterCheck } from '$lib/utils/cluster-check/cluster-check'

  export let data

  let clusterCheck: ClusterCheck

  // These initFlowbite calls help load the js necessary to target components which use flowbite js
  // i.e. data-dropdown-toggle
  onMount(() => {
    initFlowbite()
  })

  onDestroy(() => {
    if (clusterCheck) clusterCheck.close()
  })

  afterNavigate(initFlowbite)

  $: if ($authenticated) {
    clusterCheck = new ClusterCheck()
  } else {
    goto('/auth')
  }
</script>

<div class="flex flex-col h-screen">
  <div class="grow overflow-auto">
    <Navbar />

    {#if $authenticated && $page.url.pathname !== '/logs'}
      <Sidebar config={data.config} />
    {/if}

    <main
      class="flex h-full flex-col pt-16 transition-all duration-300 ease-in-out {$page.url.pathname === '/logs'
        ? ''
        : $isSidebarExpanded
          ? 'md:ml-64 sm:ml-64'
          : 'md:ml-16 sm:ml-16'}"
    >
      {#if $loadingCluster.loading}
        <LoadingCluster cluster={$loadingCluster.cluster} error={$loadingCluster.err} />
      {:else}
        <div class="h-full flex flex-col p-4 pt-6">
          <slot />
        </div>
      {/if}
    </main>
  </div>
</div>
