// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { render } from '@testing-library/svelte'

import Status from './component.svelte'

describe('Status component', () => {
  test('renders text-emerald-400 for Running', () => {
    const { container } = render(Status, { props: { type: 'Pod', status: 'Running' } })
    expect(container.firstChild).toHaveClass('text-emerald-300')
  })
  test('renders text-red-400 for Failed', () => {
    const { container } = render(Status, { props: { type: 'Pod', status: 'Failed' } })
    expect(container.firstChild).toHaveClass('text-red-400')
  })
  test('renders text-orange-300 for Pending', () => {
    const { container } = render(Status, { props: { type: 'Pod', status: 'Pending' } })
    expect(container.firstChild).toHaveClass('text-orange-300')
  })
})
