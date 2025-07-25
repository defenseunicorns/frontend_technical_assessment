// Copyright 2024 Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import { derived, writable, type Writable } from 'svelte/store'

import type { KubernetesObject } from '@kubernetes/client-node'
import { formatDetailedAge } from '$lib/utils/helpers'

import { SearchByType, type CommonRow, type ResourceStoreInterface, type ResourceWithTable } from './types'

export class ResourceStore<T extends KubernetesObject, U extends CommonRow> implements ResourceStoreInterface<T, U> {
  // Keep an internal store for the resources
  #resources: Writable<ResourceWithTable<T, U>[]>

  // Keep track of whether the store has been initialized
  #initialized = false

  // Keep an internal reference to the EventSource and the table
  #eventSource: EventSource | null = null
  #table: ResourceWithTable<T, U>[] = []

  // Keep an internal reference to the createTableCallback
  #tableCallback: (data: T[]) => ResourceWithTable<T, U>[]

  // Keep an internal reference to the age timer
  #ageTimer: NodeJS.Timeout | null = null
  #ageTimerStore: Writable<number> = writable(0)

  // Additional callback to stop the EventSource
  public stopCallback?: () => void
  public filterCallback?: (resources: ResourceWithTable<T, U>[]) => ResourceWithTable<T, U>[]

  // Public stores for the search text, search by type, and sorting options
  public search: Writable<string>
  public searchBy: Writable<SearchByType>
  public sortBy: Writable<keyof U>
  public sortAsc: Writable<boolean>
  public namespace: Writable<string>
  public numResources: Writable<number>
  public additionalStores: Writable<unknown>[] = []
  // State of loading resources
  public loading: Writable<boolean>

  // The list of search types
  public searchTypes = Object.values(SearchByType)
  // The URL for the EventSource
  public url = ''
  // The message to display when there are no resources
  public noResourcesMsg = { title: 'No resources found', titleStyle: '' }

  /**
   * Create a new ResourceStore instance
   *
   * @param url The URL for the EventSource
   * @param tableCallback The callback to create the table from the resources
   * @param sortBy The initial key to sort the table by
   * @param sortAsc The initial sort direction
   * @param additionalStores
   */
  constructor(
    url: string,
    tableCallback: (data: T[]) => ResourceWithTable<T, U>[],
    sortBy: keyof U,
    sortAsc = true,
    additionalStores: Writable<unknown>[] = [],
  ) {
    this.url = url
    this.#tableCallback = tableCallback

    // Initialize the internal store
    this.#resources = writable<ResourceWithTable<T, U>[]>([])

    // Initialize the public stores
    this.search = writable<string>('')
    this.searchBy = writable<SearchByType>(SearchByType.ANYWHERE)
    this.sortBy = writable<keyof U>(sortBy)
    this.sortAsc = writable<boolean>(sortAsc)
    this.namespace = writable<string>('')
    this.numResources = writable<number>(0)
    this.loading = writable<boolean>(true)

    // assign additional stores (expected to be init'd before constructor)
    this.additionalStores = additionalStores

    // Create a derived store that combines all the filtering and sorting logic
    const filteredAndSortedResources = derived(
      [
        this.#resources,
        this.namespace,
        this.search,
        this.searchBy,
        this.sortBy,
        this.sortAsc,
        this.numResources,
        this.#ageTimerStore,
        ...this.additionalStores,
      ],
      ([$resources, $namespace, $search, $searchBy, $sortBy, $sortAsc]) => {
        let filtered = $resources
        if ($resources.length > 0 && typeof $resources[0].resource === 'string') {
          if ($resources[0].resource === 'crd not found') {
            this.numResources.set(0)
            return $resources
          }
        }

        this.numResources.set($resources.length)

        // If there is a namespace, filter the resources
        if ($namespace) {
          filtered = filtered.filter((item) => item.resource.metadata?.namespace === $namespace)
        }

        // If there is a search term, filter the resources
        if ($search) {
          filtered = filtered.filter((item) => {
            let searchContents = ''

            // Determine what to search by
            switch ($searchBy) {
              case SearchByType.METADATA:
                searchContents = JSON.stringify(item.resource.metadata)
                break
              case SearchByType.NAME:
                searchContents = item.resource.metadata?.name ?? ''
                break
              // Default to anywhere (the entire resource)
              default:
                searchContents = JSON.stringify(item)
            }

            // Perform a case-insensitive search
            return searchContents.toLowerCase().includes($search.toLowerCase())
          })
        }

        // Update the age of the resources
        filtered.forEach((item) => {
          item.table.age = {
            text: formatDetailedAge(item.table.creationTimestamp),
            sort: item.table.creationTimestamp.getTime(),
          }
        })

        // If there is a filter callback, run the data through it
        if (this.filterCallback) {
          filtered = this.filterCallback(filtered)
        }

        // Sort the resources by the sortBy key
        return filtered.sort((a, b) => {
          // If the value is an object with a sort key, use that
          const valueA = (a.table[$sortBy] as { sort: number }).sort ?? a.table[$sortBy]
          const valueB = (b.table[$sortBy] as { sort: number }).sort ?? b.table[$sortBy]
          if (valueA < valueB) return $sortAsc ? -1 : 1
          if (valueA > valueB) return $sortAsc ? 1 : -1
          return 0
        })
      },
    )

    // Replace the subscribe method to use the derived store
    this.subscribe = filteredAndSortedResources.subscribe
  }

  /**
   * Update the searchBy key
   *
   * @param key The key to search by
   */
  sortByKey(key: keyof U) {
    this.sortBy.update((currentSortBy) => {
      // If the key is the same as the current sortBy key, toggle the sort direction
      if (key === currentSortBy) {
        this.sortAsc.update((asc) => !asc)
        return currentSortBy
      }

      // Otherwise, update the sortBy key
      return key
    })
  }

  /**
   * Start the store and update resources
   */
  start() {
    if (this.#initialized) {
      return () => {}
    }

    this.#initialized = true
    this.#eventSource = new EventSource(this.url)

    this.#eventSource.onmessage = ({ data }) => {
      try {
        this.#table = this.#tableCallback(JSON.parse(data))
        this.#resources.set(this.#table)
        this.loading.set(false)
      } catch (err) {
        console.error('Error updating resources:', err)
      }
    }

    this.#eventSource.onerror = (err) => {
      console.error('EventSource failed:', err)
    }

    // update age every 1 second
    const ageTimerInterval = setInterval(() => {
      this.#ageTimerStore.update((tick) => {
        return tick + 1
      })
    }, 1000)

    return () => {
      clearInterval(ageTimerInterval)
      this.stop()
    }
  }

  stop() {
    if (this.stopCallback) {
      this.stopCallback()
    }

    if (this.#eventSource) {
      this.#eventSource.close()
      this.#eventSource = null
      clearTimeout(this.#ageTimer as NodeJS.Timeout)
    }
  }

  restart() {
    this.stop()
    this.#initialized = false
    this.start()
  }

  subscribe: (run: (value: ResourceWithTable<T, U>[]) => void) => () => void
}

/**
 * Transform KubernetesObject resources into a common table format
 *
 * @param transformer The transformer function to apply to each resource
 * @returns A function to transform KubernetesObject resources
 */
export function transformResource<T extends KubernetesObject, U extends CommonRow>(
  transformer: (r: T, c?: CommonRow) => Partial<U>,
) {
  // Return a function to transform KubernetesObject resources

  return (resources: T[]) => {
    // If we don't have resource return empty array to avoid 'Cannot read properties of null (reading 'map')' error
    if (!resources) {
      return []
    }

    // Check if the resources contain an error
    const containsError = Object.keys(resources)[0] === 'error'
    if (containsError) {
      return [
        {
          resource: Object.values(resources)[0] as T,
          table: {} as U,
        },
      ]
    }

    // Map the resources to the common table format
    return resources.map<ResourceWithTable<T, U>>((r) => {
      // Convert common KubernetesObject rows
      const commonRows = {
        name: r.metadata?.name ?? '',
        namespace: r.metadata?.namespace ?? '',
        creationTimestamp: new Date(r.metadata?.creationTimestamp ?? ''),
      }

      // Run the transformer on the resource
      const results = transformer(r, commonRows)

      // Return the resource with the combined table
      return {
        resource: r,
        table: {
          ...commonRows,
          ...results,
        } as U,
      }
    })
  }
}
