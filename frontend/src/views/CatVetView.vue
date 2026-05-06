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

      <h3>Vet Records</h3>

      <form @submit.prevent="add">
        <input class="input" v-model="title" placeholder="Visit title" />
        <input class="input" v-model="date" type="date" />
        <textarea v-model="notes" style="width:100%; min-height:80px; border-radius:12px; border:1px solid #ddd; padding:0.6rem; margin-bottom:0.75rem;" placeholder="Notes"></textarea>
        <button class="button">Add Record</button>
      </form>

      <div v-if="records.length">
        <div v-for="r in records" :key="r.id" class="card" style="padding:0.75rem;">
          <div style="font-weight:600;">{{ r.title }}</div>
          <div style="font-size:0.85rem; color:#666;">{{ r.date }}</div>
          <div style="margin-top:0.5rem; white-space:pre-wrap;">{{ r.notes }}</div>
        </div>
      </div>

      <p v-else>No vet records yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCatsStore } from "../stores/cats";

const route = useRoute();
const cats = useCatsStore();
const catId = Number(route.params.id);

const cat = computed(() => cats.cats.find(c => c.id === catId));
const records = computed(() => cats.vet[catId] || []);

const title = ref("");
const date = ref("");
const notes = ref("");

onMounted(async () => {
  if (!cats.cats.length) await cats.loadCats();
  await cats.loadVet(catId);
});

async function add() {
  if (!title.value || !date.value) return;
  await cats.addVet(catId, {
    title: title.value,
    date: date.value,
    notes: notes.value
  });
  title.value = "";
  date.value = "";
  notes.value = "";
}
</script>
