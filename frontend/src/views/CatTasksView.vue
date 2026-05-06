<template>
  <div>
    <button class="button" style="background:#ddd; color:#333;" @click="$router.back()">← Back</button>

    <div class="card" v-if="cat">
      <div style="display:flex; align-items:center; margin-bottom:1rem;">
        <div class="cat-avatar" :style="{ background: cat.color }">{{ cat.initial }}</div>
        <div>
          <div style="font-weight:600;">{{ cat.name }}</div>
          <div style="font-size:0.85rem; color:#666;">{{ cat.notes }}</div>
        </div>
      </div>

      <h3>Today’s Tasks</h3>

      <div v-if="tasks">
        <div v-for="task in tasks.tasks" :key="task.id" style="display:flex; align-items:center; margin-bottom:0.5rem;">
          <input type="checkbox" :checked="task.completed" @change="toggle(task)" />
          <span style="margin-left:0.5rem;">{{ task.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCatsStore } from "../stores/cats";

const route = useRoute();
const cats = useCatsStore();
const catId = Number(route.params.id);

const cat = computed(() => cats.cats.find(c => c.id === catId));
const tasks = computed(() => cats.tasks[catId]);

onMounted(async () => {
  if (!cats.cats.length) await cats.loadCats();
  await cats.loadTasks(catId);
});

async function toggle(task) {
  await cats.toggleTask(catId, task);
}
</script>
