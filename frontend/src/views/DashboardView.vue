<template>
  <div>
    <h2>Today’s Care Tasks</h2>

    <div v-for="cat in cats.cats" :key="cat.id" class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center;">
          <div class="cat-avatar" :style="{ background: cat.color }">{{ cat.initial }}</div>
          <div>
            <div style="font-weight:600;">{{ cat.name }}</div>
            <div style="font-size:0.85rem; color:#666;">{{ cat.notes }}</div>
          </div>
        </div>

        <div>
          <router-link :to="`/cats/${cat.id}/tasks`" class="button" style="margin-right:0.5rem;">Tasks</router-link>
          <router-link :to="`/cats/${cat.id}/vet`" class="button">Vet</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCatsStore } from "../stores/cats";

const cats = useCatsStore();

onMounted(() => {
  cats.loadCats();
});
</script>
