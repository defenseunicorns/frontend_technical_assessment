// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { defineConfig, type PlaywrightTestConfig } from '@playwright/test'

const TEST_CONFIG = process.env.TEST_CFG || 'default'

const port = '5173'

const configs: Record<string, PlaywrightTestConfig> = {
  default: {
    name: 'default',
    webServer: {
      command: 'npm run build && npm run preview',
      port: Number(port),
      reuseExistingServer: true,
      env: { LOCAL_AUTH_ENABLED: 'false' },
    },
    testDir: 'tests',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  },
}

export default defineConfig({ ...configs[TEST_CONFIG] })

export { port }
