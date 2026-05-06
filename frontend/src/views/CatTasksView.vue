<template>
  <div>
    <button class="button" style="background:#ddd; color:#333;" @click="$router.back()">← Back</button>

    <div class="card" v-if="cat">
      <!-- Cat Header -->
      <div style="display:flex; align-items:center; margin-bottom:1rem;">
        <div class="cat-avatar" :style="{ background: cat.color }">{{ cat.initial }}</div>
        <div>
          <div style="font-weight:600;">{{ cat.name }}</div>
          <div style="font-size:0.85rem; color:#666;">{{ cat.notes }}</div>
        </div>
      </div>

      <!-- Mood Image -->
      <div style="text-align:center; margin-bottom:1rem;">
        <img
          :src="moodImage"
          alt="Cat mood"
          style="width:100px; height:auto; border-radius:12px;"
        />
        <div style="font-size:0.9rem; color:#777; margin-top:0.25rem;">
          Mood: {{ moodLabel }}
        </div>
      </div>

      <h3>Today’s Tasks</h3>

      <div v-if="tasks">
        <div
          v-for="task in tasks.tasks"
          :key="task.id"
          style="display:flex; align-items:center; margin-bottom:0.5rem;"
        >
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

/* -----------------------------
   CAT MOOD LOGIC + IMAGES
------------------------------ */

const moodImage = computed(() => {
  if (!tasks.value) return "/src/assets/cat-content.png";

  const total = tasks.value.tasks.length;
  const completed = tasks.value.tasks.filter(t => t.completed).length;

  if (completed === total) {
    return "/src/assets/cat-happy.png";
  }

  if (completed >= total / 2) {
    return "/src/assets/cat-content.png";
  }

  return "/src/assets/cat-grumpy.png";
});

const moodLabel = computed(() => {
  if (!tasks.value) return "Content";

  const total = tasks.value.tasks.length;
  const completed = tasks.value.tasks.filter(t => t.completed).length;

  if (completed === total) return "Happy";
  if (completed >= total / 2) return "Content";
  return "Grumpy";
});
</script>
