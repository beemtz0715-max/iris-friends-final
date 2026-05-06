<template>
  <div>
    <h2>Today’s Care Tasks</h2>

    <!-- Add Cat Button -->
    <button class="add-btn" @click="showAddCat = true">+ Add Cat</button>

    <!-- Add Cat Modal -->
    <div v-if="showAddCat" class="modal">
      <div class="modal-card">
        <h3>Add a Cat</h3>

        <input v-model="newCat.name" placeholder="Cat name" />
        <input v-model="newCat.notes" placeholder="Notes" />

        <!-- REAL COLOR PICKER -->
        <label class="color-label">Choose a color:</label>
        <input type="color" v-model="newCat.color" class="color-picker" />

        <button class="save-btn" @click="saveCat">Save</button>
        <button class="cancel-btn" @click="showAddCat = false">Cancel</button>
      </div>
    </div>

    <!-- Original Cat List -->
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
import { ref, onMounted } from "vue";
import { useCatsStore } from "../stores/cats";

const cats = useCatsStore();

const showAddCat = ref(false);

const newCat = ref({
  name: "",
  notes: "",
  color: "#ffb6c1" // default pink
});

function saveCat() {
  if (!newCat.value.name) return;

  // Add cat LOCALLY ONLY — does NOT break backend
  cats.cats.push({
    id: Date.now(),
    name: newCat.value.name,
    notes: newCat.value.notes,
    color: newCat.value.color,
    initial: newCat.value.name.charAt(0).toUpperCase()
  });

  showAddCat.value = false;

  newCat.value = {
    name: "",
    notes: "",
    color: "#ffb6c1"
  };
}

onMounted(() => {
  cats.loadCats(); // loads Iris, Jasper, Raja, Cali from backend
});
</script>

<style scoped>
.add-btn {
  background: #ff6bcb;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 16px;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-card {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 350px;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.modal-card input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

/* Color Picker */
.color-picker {
  width: 100%;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 12px;
}

.color-label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.save-btn {
  background: #00b894;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: none;
  margin-bottom: 10px;
}

.cancel-btn {
  background: #ccc;
  color: black;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: none;
}

/* Cat Avatar */
.cat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
}
</style>
