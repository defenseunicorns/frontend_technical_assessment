// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { type Writable } from 'svelte/store'

import type { KubernetesObject } from '@kubernetes/client-node'

export interface CommonRow {
  name: string
  namespace?: string
  style?: string
  creationTimestamp: Date
  age?: {
    sort: number
    text: string
  }
}

export type ColumnWrapper<T> = [name: keyof T, styles?: string, modifier?: 'link-external' | 'link-internal'][]

export enum SearchByType {
  ANYWHERE = 'Anywhere',
  METADATA = 'Metadata',
  NAME = 'Name',
}

export interface ResourceWithTable<T extends KubernetesObject, U extends CommonRow> {
  resource: T
  table: U
}

export interface ResourceStoreInterface<T extends KubernetesObject, U extends CommonRow> {
  // Start the EventSource and update the resources
  start: () => () => void
  // Restart the EventSource and update the resources
  restart?: () => void
  // Sort the table by the key
  sortByKey: (key: keyof U) => void
  // Store for search text
  search: Writable<string>
  // Store for search by type
  searchBy: Writable<SearchByType>
  // Store for sortBy key
  sortBy: Writable<keyof U>
  // Store for sort direction
  sortAsc: Writable<boolean>
  // The list of search types
  searchTypes: SearchByType[]
  // Subscribe to the filtered and sorted resources
  subscribe: (run: (value: ResourceWithTable<T, U>[]) => void) => () => void
  // Store for namespace
  namespace: Writable<string>
  // Store for number of resources
  numResources: Writable<number>
  // The url for the EventSource
  url: string
  // The message to display when there are no resources
  noResourcesMsg: { title: string; titleStyle: string; msg?: string; msgStyle?: string }
  // State of loading resources
  loading: Writable<boolean>
}

// Define specific status types for each resource
export type PodStatus = 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown' | 'Completed'
export type DeploymentStatus = 'Available' | 'Progressing' | 'Unavailable'
export type ServiceStatus = 'Pending' | 'Active' | 'Terminating'
export type PVCStatus = 'Pending' | 'Bound' | 'Lost'
export type NodeStatus = 'Ready' | 'NotReady' | 'SchedulingDisabled'
export type JobStatus = 'Complete' | 'Failed' | 'Running'
export type CronJobStatus = 'Active' | 'Suspended'
export type ConfigMapStatus = 'Active'
export type SecretStatus = 'Active'
export type NamespaceStatus = 'Active' | 'Terminating'
export type LogTypeStatus = 'Normal' | 'Warning'
export type UDSPackageStatus = 'Pending' | 'Ready' | 'Failed' | 'Retrying'
export type CoreServiceStatus = 'Not Installed' | 'Not Ready' | 'Ready'

type K8TypeFields = { color: string }

// Define a type for the k8StatusMapping
export type K8StatusMapping = {
  Pod: Record<PodStatus, K8TypeFields>
  Deployments: Record<DeploymentStatus, K8TypeFields>
  ReplicaSets: Record<DeploymentStatus, K8TypeFields>
  StatefulSets: Record<DeploymentStatus, K8TypeFields>
  Services: Record<ServiceStatus, K8TypeFields>
  PersistentVolumeClaims: Record<PVCStatus, K8TypeFields>
  Nodes: Record<NodeStatus, K8TypeFields>
  Jobs: Record<JobStatus, K8TypeFields>
  CronJobs: Record<CronJobStatus, K8TypeFields>
  ConfigMaps: Record<ConfigMapStatus, K8TypeFields>
  Secrets: Record<SecretStatus, K8TypeFields>
  Namespaces: Record<NamespaceStatus, K8TypeFields>
  Logs: Record<LogTypeStatus, K8TypeFields>
  UDSPackage: Record<UDSPackageStatus, K8TypeFields>
  CoreService: Record<CoreServiceStatus, K8TypeFields>
}

// types used for the dashboard / overview page
export type ClusterData = {
  totalPods: number
  totalNodes: number
  cpuCapacity: number
  memoryCapacity: number
  currentUsage: {
    CPU: number
    Memory: number
    Timestamp: string
  }
  historicalUsage: {
    CPU: number
    Memory: number
    Timestamp: string
  }[]
}

export type CoreService = {
  name: string
  status: CoreServiceStatus
}

export type UDSPackage = {
  metadata: {
    name: string
    namespace: string
  }
  status: {
    phase: UDSPackageStatus
    endpoints: string[]
  }
}

// types for pod data loaded for the logs view
type Container = {
  name: string
}

type InitContainerStatus = {
  name: string
  state: {
    waiting?: object
    running?: object
    terminated?: object
  }
}

export type Pod = {
  metadata: {
    name: string
    namespace: string
  }
  spec: {
    containers: Container[]
    initContainers: Container[]
  }
  status: {
    initContainerStatuses: InitContainerStatus[]
  }
}
