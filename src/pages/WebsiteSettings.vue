<template>
  <q-page padding>
    <div class="q-pa-md">
      <h5 class="q-mt-none q-mb-md">Web Sitesi Ayarları</h5>
      
      <q-form @submit="saveSettings" class="q-gutter-md">
        <q-input
          v-model="settings.siteUrl"
          label="Web Sitesi URL"
          :rules="[val => !!val || 'Web sitesi URL gerekli']"
        />
        
        <q-input
          v-model="settings.apiKey"
          label="API Key"
          :rules="[val => !!val || 'API Key gerekli']"
        />
        
        <q-input
          v-model="settings.apiSecret"
          label="API Secret"
          :type="showSecret ? 'text' : 'password'"
          :rules="[val => !!val || 'API Secret gerekli']"
        >
          <template v-slot:append>
            <q-icon
              :name="showSecret ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showSecret = !showSecret"
            />
          </template>
        </q-input>

        <div class="row q-gutter-sm">
          <q-btn
            label="Kaydet"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Test Et"
            color="secondary"
            @click="testConnection"
          />
        </div>
      </q-form>

      <q-card v-if="connectedProducts.length > 0" class="q-mt-lg">
        <q-card-section>
          <div class="text-h6">Web Sitesindeki Ürünler</div>
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item v-for="product in connectedProducts" :key="product.id">
              <q-item-section>
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption>{{ product.sku }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="sync"
                  @click="syncProduct(product.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { wordpressService } from '../services/wordpress'

const $q = useQuasar()
const showSecret = ref(false)
const settings = ref({
  siteUrl: '',
  apiKey: '',
  apiSecret: ''
})
const connectedProducts = ref([])

onMounted(async () => {
  // Kayıtlı ayarları yükle
  const savedSettings = localStorage.getItem('wordpressSettings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
    await loadConnectedProducts()
  }
})

const saveSettings = async () => {
  try {
    console.log('Saving settings:', settings.value)
    // Ayarları localStorage'a kaydet
    localStorage.setItem('wordpressSettings', JSON.stringify(settings.value))
    
    // WordPress servisini güncelle
    wordpressService.updateCredentials(settings.value)
    
    await loadConnectedProducts()
    
    // IndexPage'i yenile
    const event = new CustomEvent('wordpress-settings-updated')
    window.dispatchEvent(event)
    console.log('Settings saved and event dispatched')
    
    $q.notify({
      color: 'positive',
      message: 'Ayarlar kaydedildi',
      icon: 'check'
    })
  } catch (error) {
    console.error('Settings save error:', error)
    $q.notify({
      color: 'negative',
      message: 'Ayarlar kaydedilirken hata oluştu',
      icon: 'error'
    })
  }
}

const testConnection = async () => {
  try {
    console.log('Testing connection...')
    $q.loading.show()
    await wordpressService.testConnection(settings.value)
    console.log('Connection test successful')
    $q.notify({
      color: 'positive',
      message: 'Bağlantı başarılı',
      icon: 'check'
    })
  } catch (error) {
    console.error('Connection test error:', error)
    $q.notify({
      color: 'negative',
      message: 'Bağlantı hatası: ' + error.message,
      icon: 'error'
    })
  } finally {
    $q.loading.hide()
  }
}

const loadConnectedProducts = async () => {
  try {
    console.log('Loading connected products...')
    connectedProducts.value = await wordpressService.getProducts()
    console.log('Connected products loaded:', connectedProducts.value)
  } catch (error) {
    console.error('Error loading connected products:', error)
  }
}

const syncProduct = async (productId) => {
  try {
    $q.loading.show()
    await wordpressService.syncProduct(productId)
    $q.notify({
      color: 'positive',
      message: 'Ürün senkronize edildi',
      icon: 'check'
    })
    await loadConnectedProducts()
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Senkronizasyon hatası: ' + error.message,
      icon: 'error'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
