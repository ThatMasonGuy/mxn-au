<!-- src/pages/Home.vue -->

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-grow container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8 text-center">Welcome to the Home Page</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src="https://source.unsplash.com/random/800x600" alt="Random Image" class="w-full rounded-lg shadow-md">
        </div>
        <div>
          <p class="text-lg mb-4">This is the home page content. You can add more content here.</p>
          <p class="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum
            bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>