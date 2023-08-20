<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const keyword = ref('');

const toggleArray = ref([]);

onMounted(() => {
  store.dispatch('getPrimaryMenu');
});
const primaryCategories = computed(() => {
  return store.getters.primaryMenu;
});

const toggleMenuView = (id) => {
  const array = toggleArray.value;
  if (!array.includes(id)) {
    return array.push(id);
  }
  const idIndex = array.indexOf(id);
  array.splice(idIndex, 1);
};

const displayedCategories = computed(() => {
  return filteredCategories.value.length > 0
    ? filteredCategories.value
    : primaryCategories.value;
});

const filteredCategories = ref([]);

const filterMenu = () => {
  toggleArray.value = [];
  filteredCategories.value = primaryCategories.value.map((primCat) => {
    return {
      ...primCat,
      MenuCategories: primCat.MenuCategories.map((secCat) => {
        return {
          ...secCat,
          Menus: secCat.Menus.filter((menu) => {
            if (menu.name.toLowerCase().includes(keyword.value.toLowerCase())) {
              toggleArray.value.push(secCat.id);
              return true;
            }
          }),
        };
      }),
    };
  });
};

const hasMatchingMenus = (primCat) => {
  return primCat.MenuCategories.some((secCat) => {
    return secCat.Menus.some((menu) => {
      return menu.name.toLowerCase().includes(keyword.value.toLowerCase());
    });
  });
};
const hasMatchingMenusSec = (secCat) => {
  return secCat.Menus.some((menu) => {
    return menu.name.toLowerCase().includes(keyword.value.toLowerCase());
  });
};

const menuMatches = (menu) => {
  return menu.name.toLowerCase().includes(keyword.value.toLowerCase());
};

const hasAtLeastOneMatchingMenu = (array) => {
  let flag = false;
  array.forEach((item) => {
    item.MenuCategories.forEach((menu) => {
      if (menu.Menus.length > 0) {
        flag = true;
      }
    });
  });
  return flag;
};
</script>

<template>
  <div
    class="search-field-container sticky top-0 left-0 shadow-lg w-full p-5 bg-blue-500"
  >
    <input
      type="text"
      class="w-full px-3"
      placeholder="Type to filter"
      v-model="keyword"
      @input="filterMenu()"
    />
  </div>
  <div
    v-if="hasAtLeastOneMatchingMenu(displayedCategories)"
    class="primary-categories-container"
  >
    <template v-for="primCats in displayedCategories">
      <div
        v-if="primCats.MenuCategories.length > 0 && hasMatchingMenus(primCats)"
        :class="{
          'p-4': primCats.MenuCategories.length > 0,
          beverages: primCats.name.toLowerCase() === 'beverages',
          food: primCats.name.toLowerCase() === 'food',
          'soft-drinks': primCats.name.toLowerCase() === 'soft drinks',
          cigarette: primCats.name.toLowerCase() === 'cigratte',
          coffee: primCats.name.toLowerCase() === 'coffee',
        }"
      >
        <h2 class="font-bold text-3xl text-[#f00]">
          {{ primCats.name }}
        </h2>

        <div class="menu-categories-container">
          <div class="ml-5" v-for="menCats in primCats.MenuCategories">
            <template
              v-if="menCats.Menus.length > 0 && hasMatchingMenusSec(menCats)"
            >
              <div
                class="bg-slate-200 hover:bg-slate-300 duration-300 cursor-pointer header-wrapper flex justify-between items-center p-4 mt-4 mb-2 rounded-sm shadow-md"
                @click="toggleMenuView(menCats.id)"
              >
                <h3 class="font-semibold text-2xl">{{ menCats.name }}</h3>
                <span class="material-symbols-outlined"> expand_more </span>
              </div>
              <div class="ml-5" v-if="toggleArray.includes(menCats.id)">
                <div class="menu-cards my-7">
                  <template v-for="menu in menCats.Menus">
                    <div
                      v-if="menuMatches(menu)"
                      class="menus bg-slate-100 p-2 rounded shadow-md h-[100px] flex flex-col justify-between"
                    >
                      <h3
                        class="text-md break-all text-slate-800 font-semibold"
                      >
                        {{
                          menu.name.charAt(0).toUpperCase() +
                          menu.name.toLowerCase().slice(1)
                        }}
                      </h3>
                      <h3 class="text-sm font-semibold text-blue-500">
                        Rs. {{ menu.price }}
                      </h3>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div v-else>
    <h2 class="my-10 text-xl font-medium text-red-400 text-center">
      No items found
    </h2>
  </div>
</template>

<style scoped>
.beverages {
  background: rgb(145, 185, 241);
}
.food {
  background: rgb(245, 183, 135);
}
.soft-drinks {
  background: rgb(156, 231, 185);
}
.cigarette {
  background: rgb(254, 143, 143);
}
.coffee {
  background: rgb(180, 129, 116);
}

.menu-cards {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>
