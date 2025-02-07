<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="text-h5 q-mr-sm">Ürünler</div>
        <q-space />
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Ürün Ara"
          class="col-12 col-sm-4"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      
      <q-table
        :rows="products"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="search"
        flat
        bordered
      >
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <div
              class="cursor-pointer"
              @click="showImageDialog(props.row.images[0]?.src)"
            >
              <q-img
                :src="props.row.images[0]?.src"
                spinner-color="primary"
                style="height: 100px; width: 100px"
                fit="contain"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    Resim Yok
                  </div>
                </template>
              </q-img>
              <q-tooltip>Büyük görüntülemek için tıklayın</q-tooltip>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <router-link 
              :to="'/product/' + props.row.id"
              class="text-primary"
              style="text-decoration: none"
            >
              {{ props.value }}
            </router-link>
          </q-td>
        </template>

        <template v-slot:body-cell-regular_price="props">
          <q-td :props="props">
            {{ props.value }} ₺
          </q-td>
        </template>
      </q-table>

      <!-- Görsel Popup Dialog -->
      <q-dialog v-model="imageDialog" maximized>
        <q-card class="column full-height">
          <q-card-section class="row items-center q-pb-none bg-primary text-white">
            <div class="text-h6">Ürün Görseli</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="col column flex-center q-pa-lg bg-grey-2">
            <q-img
              :src="selectedImage"
              spinner-color="primary"
              style="max-width: 90vw; max-height: 90vh;"
              fit="contain"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  Resim Yüklenemedi
                </div>
              </template>
            </q-img>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const products = ref([])
const search = ref('')
const imageDialog = ref(false)
const selectedImage = ref('')

const showImageDialog = (imageSrc) => {
  if (imageSrc) {
    selectedImage.value = imageSrc
    imageDialog.value = true
  }
}

const columns = [
  { 
    name: 'image', 
    align: 'center', 
    label: 'Görsel', 
    field: 'images',
    sortable: false 
  },
  { 
    name: 'name', 
    align: 'left', 
    label: 'Ürün Adı', 
    field: 'name',
    sortable: true 
  },
  { 
    name: 'sku', 
    align: 'left', 
    label: 'Stok Kodu', 
    field: 'sku',
    sortable: true 
  },
  { 
    name: 'regular_price', 
    align: 'right', 
    label: 'Fiyat', 
    field: 'regular_price',
    sortable: true 
  }
]

onMounted(async () => {
  if (!localStorage.getItem('isLoggedIn')) {
    router.push('/login')
    return
  }
  await loadProducts()
})

const loadProducts = async () => {
  try {
    loading.value = true
    const response = await axios.get('https://tudisilver.com/wp-json/wc/v3/products', {
      params: {
        consumer_key: 'ck_d0e1f917b5ebaed39f2b972549fe3e0d2d786de4',
        consumer_secret: 'cs_3eab54ece35ceee4ae5b4e61a406b73f68e1c2a2',
        per_page: 100
      }
    })
    products.value = response.data
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    loading.value = false
  }
}
</script>
