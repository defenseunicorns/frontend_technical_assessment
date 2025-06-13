<script lang="ts">
  import { onMount } from 'svelte'

  import { Spinner } from '$components'

  let count = 5

  onMount(() => {
    const interval = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearInterval(interval)
        window.location.reload()
      }
    }, 1000)
  })
</script>

<section class="bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
    <div class="mx-auto max-w-screen-sm text-center">
      <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-100">401</h1>
      <p class="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-gray-100">Unauthenticated</p>
      <p class="mb-4 text-lg font-light text-gray-100">Sorry, your session is no longer valid.</p>
      <p class="mb-4 text-lg font-light text-gray-100">Redirecting to login in:</p>
      <div class="relative">
        <span class="absolute text-lg inset-x-0 inset-y-8">{count}</span>
        <Spinner width={24} height={24} />
      </div>
    </div>
  </div>
</section>
