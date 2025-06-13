<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { onMount } from 'svelte'

  import { WithRightIconWidget } from '$components'
  import EventsOverviewWidget from '$components/k8s/Event/EventsOverviewWidget.svelte'
  import { Analytics } from 'carbon-icons-svelte'

  // import Chart from 'chart.js/auto'

  import type { ClusterData, CoreService, UDSPackage } from '../types'

  let clusterData: ClusterData = {
    totalPods: 0,
    totalNodes: 0,
    cpuCapacity: 0,
    memoryCapacity: 0,
    currentUsage: {
      CPU: 0,
      Memory: 0,
      Timestamp: new Date().toISOString(),
    },
    historicalUsage: [],
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let udsPackages: UDSPackage[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let coreServices: CoreService[] = []

  function updateClusterData(newData: Partial<ClusterData>) {
    clusterData = {
      ...clusterData,
      ...newData,
    }
  }

  onMount(() => {
    const overviewPath: string = '/api/v1/monitor/cluster-overview'
    const overview = new EventSource(overviewPath)

    overview.addEventListener('usageDataUpdate', function (event: MessageEvent) {
      const newData = JSON.parse(event.data) as ClusterData
      if (newData && Object.keys(newData).length > 0) {
        updateClusterData({
          totalNodes: newData.totalNodes,
          totalPods: newData.totalPods,
          cpuCapacity: newData.cpuCapacity,
          memoryCapacity: newData.memoryCapacity,
          currentUsage: newData.currentUsage,
          historicalUsage: newData.historicalUsage,
        })
      }
    })

    overview.addEventListener('packagesUpdate', function (event: MessageEvent) {
      try {
        udsPackages = JSON.parse(event.data) as UDSPackage[]
      } catch (e) {
        console.error('Error parsing UDS packages data', e)
      }
    })

    overview.addEventListener('coreServicesUpdate', function (event: MessageEvent) {
      try {
        coreServices = JSON.parse(event.data) as CoreService[]
      } catch (e) {
        console.error('Error parsing core services data', e)
      }
    })

    return () => {
      overview.close()
    }
  })
</script>

<div class="flex flex-col p-4 text-gray-100 pt-0 gap-y-8">
  <h1 class="text-xl font-bold">Cluster Overview</h1>

  <div class="grid grid-cols-2 min-[1510px]:grid-cols-4 gap-4">
    <WithRightIconWidget
      statText={`${clusterData.totalPods}`}
      helperText="Pods Running"
      icon={Analytics}
      link="/workloads/pods"
    />
  </div>

  <div class="text-center text-3xl font-bold">Create rest of UI here</div>
  <EventsOverviewWidget />
</div>
