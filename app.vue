<script setup lang="ts">
import type { User } from './services/dataBase/schema/schemaTypes';
import { getData } from './services/dataBase/storeHandlers/user';

if (process.client) {

  const { isAuthenticated, setUser, getUser } = UserStore()
  await CategoryStore().setCategoriesAndSubCategories() // set all categories and sub-categories in categories store  from indexedDB
  await ProviderServicesStore().setAllProviderServices() // set all provider services into provider services store from indexedDB
  await UserStore().setAllUser() // set all users into user store from indexedDB
  await ReviewStore().setAllReviews() // set all reviews into review store from indexedDB
  await ImageStore().setAllImages() // set all images into images store from indexedDB
  if (isAuthenticated) {
    const user = (await getData(getUser?.id!)) as User; // get user data from indexedDB
    setUser(user); // if user authenticated then set the logged user data into user store

    await useAppointment().getAllAppointments() // set all appointments of a logged in user in appointment store from indexedDB
  }
}

//TODO: for handling loading state
const isLoading = useState("isLoading", () => false)

</script>

<template>
  <div class="w-full min-h-screen bg-secondary-50">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

  </div>
</template>
