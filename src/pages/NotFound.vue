<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-extrabold text-blue-600 tracking-widest">404</h1>
      <div class="bg-blue-600 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div class="mt-5">
        <p class="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <router-link 
          to="/" 
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
