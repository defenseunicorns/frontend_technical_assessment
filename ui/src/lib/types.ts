// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import type { SvelteComponent } from 'svelte'

import type { UserData } from '$features/navigation/types'

export type PatchOperation = {
  op: string
  path: string
  value: string
}

export type PeprDetails = {
  component: SvelteComponent
  messages?: string[]
  operations?: { [key: string]: PatchOperation[] }
}

export type PeprEvent = {
  _name: string
  count: number
  event: string
  header: string
  repeated?: number
  ts?: string
  epoch: number
  msg: string
  res?: Record<string, unknown>
  details?: PeprDetails | undefined
}

export type ClassBannerCfg = {
  enabled: boolean
  text: string
  footer: boolean
}

export type NotFoundPkg = {
  name: string
  architecture: string
  tag: string
}

export interface AuthResponse {
  authenticated: boolean
  userData: UserData
}

export interface UIConfig {
  classBannerCfg: ClassBannerCfg
  databaseLoaded: boolean
}
