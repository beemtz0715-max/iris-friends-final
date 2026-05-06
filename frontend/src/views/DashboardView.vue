<script setup>
import { ref } from "vue";
import { useCatsStore } from "../stores/cats";

const cats = useCatsStore();

const showAddCat = ref(false);

const newCat = ref({
  name: "",
  notes: "",
  color: "#ffb6c1",
});

function saveCat() {
  if (!newCat.value.name) return;

  cats.addCat(newCat.value);

  showAddCat.value = false;
  newCat.value = {
    name: "",
    notes: "",
    color: "#ffb6c1",
  };
}
</script>

<template>
  <div class="dashboard">

    <!-- Add Cat Button -->
    <button class="add-btn" @click="showAddCat = true">
      + Add Cat
    </button>

    <!-- Add Cat Form -->
    <div v-if="showAddCat" class="add-card">
      <h3>Add a Cat</h3>

      <input v-model="newCat.name" placeholder="Cat name" />
      <input v-model="newCat.notes" placeholder="Notes" />
      <input v-model="newCat.color" placeholder="Color (ex: #ffb6c1)" />

      <button class="save-btn" @click="saveCat">Save</button>
    </div>

    <!-- Cat List -->
    <div class="cat-list">
      <div v-for="cat in cats.cats" :key="cat.id" class="cat-card">
        <div class="cat-icon" :style="{ background: cat.color }">
          {{ cat.initial }}
        </div>

        <div class="cat-info">
          <h4>{{ cat.name }}</h4>
          <p>{{ cat.notes }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

/* Add Cat Button */
.add-btn {
  background: #ff6bcb;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* Add Cat Form Card */
.add-card {
  background: white;
  padding: 15px;
  margin-top: 15px;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

.add-card input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

/* Save Button */
.save-btn {
  background: #00b894;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
}

/* Cat List */
.cat-list {
  margin-top: 20px;
}

/* Cat Card */
.cat-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

/* Cat Icon */
.cat-icon {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
}

/* Cat Info */
.cat-info h4 {
  margin: 0;
}
</style>
