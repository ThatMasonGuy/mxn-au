<!-- src/pages/Contact.vue -->

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-grow container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <div class="max-w-lg mx-auto">
        <p class="text-lg mb-8 text-center">This is the contact page content. You can provide contact information or a
          contact form here.</p>
        <form class="grid grid-cols-1 gap-6">
          <div>
            <label for="name" class="block text-gray-700 font-bold mb-2">Name</label>
            <input type="text" id="name" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Your Name">
          </div>
          <div>
            <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
            <input type="email" id="email" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Your Email">
          </div>
          <div>
            <label for="message" class="block text-gray-700 font-bold mb-2">Message</label>
            <textarea id="message" rows="4" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Your Message"></textarea>
          </div>
          <div>
            <button type="submit"
              class="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
};
</script>