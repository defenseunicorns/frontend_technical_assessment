// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import type { ClusterInfo } from './store'

export function displayClusterName(cluster: ClusterInfo) {
  return cluster.context === cluster.name ? cluster.name : `${cluster.context}.${cluster.name}`
}
