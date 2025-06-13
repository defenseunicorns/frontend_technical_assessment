<!-- Copyright 2024 Defense Unicorns -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial -->

<script lang="ts">
  import { page } from '$app/stores'
</script>

<section class="bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
    <div class="mx-auto max-w-screen-sm text-center">
      <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-100">
        {$page.error?.code || 500}
      </h1>
      <p class="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-gray-100">Uh oh, there&apos;s been an error</p>
      <a
        href="/"
        class="inline-flex text-gray-100 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-hidden font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-primary-900 my-4"
      >
        Back to Homepage
      </a>
    </div>
  </div>
</section>
