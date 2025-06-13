// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

export class ClusterCheck {
  #clusterCheck: EventSource
  // #disconnectedMsg = 'Cluster health check failed: no connection'
  #disconnected = false

  constructor() {
    this.#clusterCheck = new EventSource('/cluster-check')

    this.#clusterCheck.addEventListener('close', function () {
      this.close()
    })

    this.#clusterCheck.onmessage = (msg) => {
      if (msg.data === 'error') {
        this.#handleDisconnectedEvt()
      } else if (msg.data === 'success' && this.#disconnected) {
        this.#handleReconnectionEvt()
      } else if (msg.data === 'switched' && this.#disconnected) {
        this.#handleSwitched()
      }
    }
  }

  #handleDisconnectedEvt() {
    this.#disconnected = true
  }

  #handleReconnectionEvt() {
    // a disconnection occured but has now been resolved

    this.#disconnected = false

    // Dispatch custom event for reconnection
    // use window instead of svelte createEventDispatcher to trigger event globally
    const event = new CustomEvent('cluster-reconnected', {
      detail: { message: 'Cluster connection restored' },
    })
    window.dispatchEvent(event)
  }

  #handleSwitched() {
    this.#disconnected = false
  }

  close() {
    this.#clusterCheck.close()
  }
}
