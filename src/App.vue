<script setup>
import MenuBar from "./components/MenuBar.vue";
import careerServicesBG from "./images/career-bg.jpeg";
</script>

<template>
  <v-app :style="{
    'background-image': `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                  url(${careerServicesBG})`,
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'color': 'white',
  }">
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
