// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { writable, type Writable } from 'svelte/store'

export type ClusterInfo = {
  name: string
  context: string
  selected: boolean
}

type Loading = {
  loading: boolean
  cluster: ClusterInfo
  err?: string
}

export const clusters: Writable<ClusterInfo[]> = writable([])

export const loadingCluster: Writable<Loading> = writable({
  loading: false,
  cluster: { name: '', context: '', selected: false },
})
