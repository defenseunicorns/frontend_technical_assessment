// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { expect, test } from '@playwright/test'

test('it renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Create rest of UI here')).toBeVisible()
})
