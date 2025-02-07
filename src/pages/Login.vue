<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px">
      <q-card-section class="text-center">
        <h5 class="text-h5 q-mt-none q-mb-md">Giriş Yap</h5>
      </q-card-section>

      <q-card-section>
        <q-form @submit="login" class="q-gutter-md">
          <q-input
            v-model="credentials.username"
            label="Kullanıcı Adı"
            :rules="[val => !!val || 'Kullanıcı adı gerekli']"
          />

          <q-input
            v-model="credentials.password"
            label="Şifre"
            type="password"
            :rules="[val => !!val || 'Şifre gerekli']"
          />

          <div class="q-mt-md">
            <q-btn
              label="Giriş Yap"
              type="submit"
              color="primary"
              class="full-width"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const credentials = ref({
  username: '',
  password: ''
})

const login = async () => {
  // Basit bir doğrulama
  if (credentials.value.username === 'goldpiedra' && credentials.value.password === 'Odunlumetin2!') {
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/')
  } else {
    $q.notify({
      color: 'negative',
      message: 'Hatalı kullanıcı adı veya şifre',
      icon: 'error'
    })
  }
}
</script>
