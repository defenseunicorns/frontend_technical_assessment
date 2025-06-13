// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { type HandleClientError } from '@sveltejs/kit'

// intercept unexpected errors (https://svelte.dev/docs/kit/errors#Unexpected-errors)
export const handleError: HandleClientError = async ({ status, message }) => {
  let code = status

  // test if request without cors returns redirect and therefore user session is invalid
  try {
    const res = await fetch('/api/v1/auth', { mode: 'no-cors', credentials: 'include' })
    // assuming opaque because redirected by authservice
    if (res.type === 'opaque') {
      code = 401
    }
  } catch {
    console.error('Auth check failed but is not opaque')
  }

  return {
    code,
    message,
  }
}
