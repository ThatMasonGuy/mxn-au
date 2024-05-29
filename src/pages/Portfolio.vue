<template>
  <div class="mx-auto pb-12 w-full min-h-[--adjusted-height] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600 px-28">
    <div class="max-w-4xl mx-auto">
      <div>
        <header class="text-center mb-12 mt-8">
          <h1 class="text-5xl font-bold mb-2 text-gray-100">{{ data.name }}</h1>
          <p class="text-2xl text-gray-200">{{ data.title }}</p>
        </header>
      </div>

      <div class="mb-12">
        <h2 class="text-3xl font-semibold mb-4 text-gray-100">About Me</h2>
        <p class="text-lg text-gray-300">{{ data.about }}</p>
      </div>

      <div class="mb-12">
        <h2 class="text-3xl font-semibold mb-6 text-gray-100">Skills</h2>
        <div class="flexbox flex-wrap">
          <span v-for="skill in data.skills" :key="skill"
            class="inline-block bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-full text-lg mb-4 mr-4 transition duration-200 ease-in-out">{{
            skill }}</span>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-3xl font-semibold mb-6 text-gray-100">Projects</h2>
        <div v-for="project in data.projects" :key="project.name" class="mb-8 flex justify-between">
          <div>
            <h3 class="text-2xl font-bold mb-2 text-gray-200">{{ project.name }}</h3>
            <p class="text-lg text-gray-300 mb-2">{{ project.description }}</p>
            <div>
              <a :href="project.link" target="_blank"
                class="text-blue-700 hover:text-blue-500 hover:underline text-lg transition duration-200 ease-in-out">View
                Demo</a>
              <a v-if="project.website" :href="project.website" target="_blank"
                class="text-blue-700 hover:text-blue-500 ml-4 hover:underline text-lg transition duration-200 ease-in-out">View
                Live</a>
            </div>
          </div>
          <div>
            <Dialog :isOpen="isDialogOpen" @close="closeDialog">
          <DialogTrigger>
            <img :src="project.image" alt="{{ project.name }}"
              class="m-5 mt-0 mb-6 rounded-lg max-w-96 shadow-2xl hover:scale-105 transition duration-200 ease-in-out cursor-pointer"
              @click="openDialog">
          </DialogTrigger>
          <DialogContent class="sm:max-w-5xl bg-gray-100">
            <DialogHeader>
              <DialogTitle>{{ project.name }}</DialogTitle>
              <DialogDescription>
                {{ project.description }}
              </DialogDescription>
            </DialogHeader>
              <img :src="project.image" alt="Project Image" class="w-full rounded-lg shadow-xl">
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-3xl font-semibold mb-6 text-gray-100">Contact</h2>
        <div class="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-gray-100" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a :href="'mailto:' + data.email"
            class="text-lg text-blue-700 hover:text-blue-500 hover:underline transition duration-200 ease-in-out">{{
            data.email }}</a>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-gray-100" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
          </svg>
          <a :href="data.linkedin" target="_blank"
            class="text-lg text-blue-700 hover:text-blue-500 hover:underline transition duration-200 ease-in-out">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { LMSVisitorApp, LMSWebApp, LMSWebsite } from '@/assets/portfolio/images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default {
  components: {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  },
  setup() {
    const data = {
      name: 'Mason Bartholomai',
      title: 'IT Professional and Developer',
      about: 'Innovative IT professional with a strong background in PowerApps development, web application development, and IT training. Passionate about leading innovation and leveraging technology to enhance organizational efficiency.',
      skills: ['JavaScript', 'Vue.js', 'TailwindCSS', 'Firebase', 'PowerApps', 'Python', 'GitHub'],
      projects: [
        {
          name: 'Lifestyle Mentor Services Website',
          description: 'Built the entire lifestylementors.com.au website from scratch using Squarespace.',
          link: 'https://lifestylementors.com.au',
          image: LMSWebsite,
          website: 'https://lifestylementors.com.au'
        },
        {
          name: 'PowerApps Visitor Log',
          description: 'Developed a complex PowerApps app for logging visitors and managing session data.',
          link: '#',
          image: LMSVisitorApp
        },
        {
          name: 'Full Stack Web App',
          description: 'Set up a sub-domain hosting a full stack webapp using Firestore and Firebase for data and authentication.',
          link: 'https://lifestylementors.mxn.au',
          image: LMSWebApp,
          website: 'https://lifestylementors.mxn.au'
        }
      ],
      email: 'mason@mxn.au',
      linkedin: 'https://www.linkedin.com/in/masonbartholomai'
    }

    const isDialogOpen = ref(false)

    function openDialog() {
      isDialogOpen.value = true
    }

    function closeDialog() {
      isDialogOpen.value = false
    }

    return {
      data,
      isDialogOpen,
      openDialog,
      closeDialog,
    }
  }
}
</script>