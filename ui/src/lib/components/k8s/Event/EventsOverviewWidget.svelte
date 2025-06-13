<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { onMount } from 'svelte'

  import { createStore } from '$lib/features/k8s/events/store'

  let rows = createStore()

  onMount(() => {
    let stop = rows.start()

    return () => stop()
  })
</script>
