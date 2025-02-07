<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Stok Takip
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm">
          <q-btn
            to="/"
            flat
            dense
            icon="home"
            label="Ana Sayfa"
          />
          <q-btn
            to="/settings"
            flat
            dense
            icon="payments"
            label="Fiyatlar"
          />
          <q-btn
            flat
            dense
            icon="logout"
            label="Çıkış"
            @click="logout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>
