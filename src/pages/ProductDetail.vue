<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <!-- Sol Taraf - Ürün Görseli -->
        <div class="col-12 col-md-4">
          <q-card class="product-image-card">
            <q-card-section>
              <div class="text-h6 q-mb-md">Ürün Görseli</div>
              <q-img
                :src="product.images?.[0]?.src || 'https://cdn.quasar.dev/img/no-image.png'"
                :ratio="1"
                class="rounded-borders"
                fit="contain"
                spinner-color="primary"
                spinner-size="82px"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center text-grey-7">
                    <q-icon name="image_not_supported" size="48px" />
                  </div>
                </template>
              </q-img>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sağ Taraf - Ürün Detayları -->
        <div class="col-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h5 q-mb-md">{{ product.name || 'Ürün Detayı' }}</div>
              <div class="row q-col-gutter-md">
                <!-- Temel Bilgiler -->
                <div class="col-12">
                  <div class="text-h6 q-mb-md">Temel Bilgiler</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="product.name"
                        label="Ürün Adı"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="product.sku"
                        label="Stok Kodu"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.regular_price"
                        label="Fiyat"
                        outlined
                        dense
                        type="number"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.stock_quantity"
                        label="Stok Miktarı"
                        outlined
                        dense
                        type="number"
                      />
                    </div>
                  </div>
                </div>

                <!-- Ürün Özellikleri -->
                <div class="col-12">
                  <div class="text-h6 q-mb-md">Fiyatlandırma</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.gram"
                        label="Gram (gr.)"
                        outlined
                        dense
                        type="number"
                        @update:model-value="calculateValues"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.altin_ayar_milyem"
                        label="Altın Ayar Milyemi"
                        outlined
                        dense
                        type="number"
                        @update:model-value="calculateValues"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.altin_has"
                        label="Altın Has (gr.)"
                        outlined
                        dense
                        type="number"
                        readonly
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-select
                        v-model="product.iscilik_milyem_type"
                        :options="milyemOptions"
                        label="İşçilik Milyem"
                        outlined
                        dense
                        @update:model-value="updateIscilikMilyem"
                      >
                        <template v-slot:selected>
                          <div>
                            {{ product.iscilik_milyem_type }}
                            <q-badge color="primary" class="q-ml-sm">
                              {{ product.iscilik_milyem }}
                            </q-badge>
                          </div>
                        </template>
                      </q-select>
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.iscilikli_has_maliyet"
                        label="Ürün İşçilikli Has Maliyeti"
                        outlined
                        dense
                        type="number"
                        readonly
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="product.iscilikli_altin_tutar"
                        label="İşçilikli Altın ₺ Tutarı"
                        outlined
                        dense
                        type="number"
                        readonly
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-select
                        v-model="product.urun_carpani_type"
                        :options="urunCarpaniOptions"
                        label="Ürün Çarpanı"
                        outlined
                        dense
                        @update:model-value="updateUrunCarpani"
                      >
                        <template v-slot:selected>
                          <div>
                            {{ product.urun_carpani_type }}
                            <q-badge color="primary" class="q-ml-sm">
                              {{ product.urun_carpani }}
                            </q-badge>
                          </div>
                        </template>
                      </q-select>
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="product.perakende_satis_fiyati"
                        label="Perakende Satış Fiyatı"
                        outlined
                        dense
                        type="number"
                        readonly
                        suffix="₺"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="product.iscilik_yuzde_on"
                        label="İşçilik %10"
                        outlined
                        dense
                        type="number"
                        readonly
                        suffix="₺"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="product.iscilik_kdv"
                        label="İşçilik KDV'si %20"
                        outlined
                        dense
                        type="number"
                        readonly
                        suffix="₺"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="product.toplam_satis_fiyati"
                        label="Toplam Satış Fiyatı"
                        outlined
                        dense
                        type="number"
                        readonly
                        suffix="₺"
                        class="text-h6"
                        style="font-size: 1.2em"
                      >
                        <template v-slot:prepend>
                          <q-icon name="calculate" size="md" color="primary" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section v-if="product.attributes?.length">
              <div class="text-h6 q-mb-md">Ürün Özellikleri</div>
              <q-markup-table flat bordered>
                <tbody>
                  <tr v-for="attr in product.attributes" :key="attr.name">
                    <td class="text-weight-bold bg-grey-2" style="width: 30%">{{ attr.name }}</td>
                    <td>{{ Array.isArray(attr.options) ? attr.options.join(', ') : attr.options }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
              <q-btn
                label="Kaydet"
                color="primary"
                @click="saveProduct"
                :loading="saving"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const saving = ref(false)

// Fiyatlar sayfasından ayarları al
const settings = ref({
  has_altin_fiyat: 0,
  dolar_fiyat: 0,
  kargo: 0,
  paketleme: 0,
  hizma_milyem: 0,
  kupe_milyem: 0,
  bileklik_milyem: 0,
  gobek_piercing_milyem: 0,
  standart_piercing_milyem: 0,
  dogal_tas_bileklikler_milyem: 0,
  sahmeran_halhal_milyem: 0,
  kolye_milyem: 0,
  hizma: 0,
  kupe: 0,
  bileklik: 0,
  piercing: 0,
  dogal_tas_bileklik: 0,
  sahmeran: 0,
  halhal: 0,
  kolye: 0
})

const loadSettings = () => {
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
}

// Milyem seçenekleri
const milyemOptions = computed(() => [
  'Hızma Milyem',
  'Küpe Milyem',
  'Bileklik Milyem',
  'Göbek Piercing Milyem',
  'Standart Piercing Milyem',
  'Doğal Taş Bileklikler Milyem',
  'Şahmeran / Halhal Milyem',
  'Kolye Milyem'
])

// Ürün Çarpanı seçenekleri
const urunCarpaniOptions = computed(() => [
  'Hızma',
  'Küpe',
  'Bileklik',
  'Piercing',
  'Doğal Taş Bileklikler',
  'Şahmeran',
  'Halhal',
  'Kolye'
])

const product = ref({
  name: '',
  sku: '',
  regular_price: 0,
  stock_quantity: 0,
  gram: 0,
  altin_ayar_milyem: 0,
  altin_has: 0,
  iscilik_milyem: 0,
  iscilik_milyem_type: '',
  urun_carpani: 0,
  urun_carpani_type: '',
  iscilikli_has_maliyet: 0,
  iscilikli_altin_tutar: 0,
  perakende_satis_fiyati: 0,
  iscilik_yuzde_on: 0,
  iscilik_kdv: 0,
  toplam_satis_fiyati: 0
})

const calculateValues = () => {
  try {
    const p = product.value
    const s = settings.value

    // Değerleri number olarak al
    const gram = Number(p.gram) || 0
    const altinAyarMilyem = Number(p.altin_ayar_milyem) || 0
    const iscilikMilyem = Number(p.iscilik_milyem) || 0
    const hasAltinFiyat = Number(s.has_altin_fiyat) || 0
    const urunCarpani = Number(p.urun_carpani) || 0
    const kargo = Number(s.kargo) || 0
    const paketleme = Number(s.paketleme) || 0

    // 1. Altın Has (gr.)
    p.altin_has = (gram * altinAyarMilyem) / 1000

    // 2. İşçilikli Has Maliyet
    p.iscilikli_has_maliyet = gram * ((altinAyarMilyem + iscilikMilyem) / 1000)

    // 3. İşçilikli Altın ₺ Tutarı
    p.iscilikli_altin_tutar = p.iscilikli_has_maliyet * hasAltinFiyat

    // 4. Perakende Satış Fiyatı
    p.perakende_satis_fiyati = p.iscilikli_altin_tutar * urunCarpani

    // 5. İşçilik %10
    p.iscilik_yuzde_on = Math.round(p.perakende_satis_fiyati * 0.1)

    // 6. İşçilik KDV'si %20
    p.iscilik_kdv = Math.round(p.iscilik_yuzde_on * 0.2)

    // 7. Toplam Satış Fiyatı
    p.toplam_satis_fiyati = Math.round(
      p.perakende_satis_fiyati + 
      p.iscilik_yuzde_on + 
      p.iscilik_kdv + 
      kargo + 
      paketleme
    )

  } catch (error) {
    console.error('Hesaplama hatası:', error)
  }
}

// İşçilik Milyem tipine göre değeri güncelle
const updateIscilikMilyem = () => {
  const type = product.value.iscilik_milyem_type
  let settingsKey = ''
  
  switch(type) {
    case 'Hızma Milyem':
      settingsKey = 'hizma_milyem'
      break
    case 'Küpe Milyem':
      settingsKey = 'kupe_milyem'
      break
    case 'Bileklik Milyem':
      settingsKey = 'bileklik_milyem'
      break
    case 'Göbek Piercing Milyem':
      settingsKey = 'gobek_piercing_milyem'
      break
    case 'Standart Piercing Milyem':
      settingsKey = 'standart_piercing_milyem'
      break
    case 'Doğal Taş Bileklikler Milyem':
      settingsKey = 'dogal_tas_bileklik_milyem'
      break
    case 'Şahmeran / Halhal Milyem':
      settingsKey = 'sahmeran_halhal_milyem'
      break
    case 'Kolye Milyem':
      settingsKey = 'kolye_milyem'
      break
  }
  
  if (settingsKey && settings.value[settingsKey] !== undefined) {
    product.value.iscilik_milyem = Number(settings.value[settingsKey])
    calculateValues()
  }
}

// Ürün Çarpanı tipine göre değeri güncelle
const updateUrunCarpani = () => {
  const type = product.value.urun_carpani_type
  let settingsKey = ''
  
  switch(type) {
    case 'Hızma':
      settingsKey = 'hizma'
      break
    case 'Küpe':
      settingsKey = 'kupe'
      break
    case 'Bileklik':
      settingsKey = 'bileklik'
      break
    case 'Piercing':
      settingsKey = 'piercing'
      break
    case 'Doğal Taş Bileklikler':
      settingsKey = 'dogal_tas_bileklik'
      break
    case 'Şahmeran':
      settingsKey = 'sahmeran'
      break
    case 'Halhal':
      settingsKey = 'halhal'
      break
    case 'Kolye':
      settingsKey = 'kolye'
      break
  }
  
  if (settingsKey && settings.value[settingsKey] !== undefined) {
    product.value.urun_carpani = Number(settings.value[settingsKey])
    calculateValues()
  }
}

// Settings değiştiğinde seçili milyem değerini güncelle
watch(settings, () => {
  updateIscilikMilyem()
  updateUrunCarpani()
}, { deep: true })

onMounted(async () => {
  if (!localStorage.getItem('isLoggedIn')) {
    router.push('/login')
    return
  }
  loadSettings()
  await loadProduct()
})

const loadProduct = async () => {
  try {
    const response = await axios.get(`https://tudisilver.com/wp-json/wc/v3/products/${route.params.id}`, {
      params: {
        consumer_key: 'ck_d0e1f917b5ebaed39f2b972549fe3e0d2d786de4',
        consumer_secret: 'cs_3eab54ece35ceee4ae5b4e61a406b73f68e1c2a2'
      }
    })
    
    const metaData = response.data.meta_data || []
    const getValue = (key) => {
      const item = metaData.find(m => m.key === key)
      return item ? Number(item.value) || 0 : 0
    }
    const getStringValue = (key) => {
      const item = metaData.find(m => m.key === key)
      return item ? item.value : ''
    }

    product.value = {
      ...response.data,
      gram: getValue('gram'),
      altin_ayar_milyem: getValue('altin_ayar_milyem'),
      altin_has: getValue('altin_has'),
      iscilik_milyem: getValue('iscilik_milyem'),
      iscilik_milyem_type: getStringValue('iscilik_milyem_type'),
      urun_carpani: getValue('urun_carpani'),
      urun_carpani_type: getStringValue('urun_carpani_type'),
      iscilikli_has_maliyet: getValue('iscilikli_has_maliyet'),
      iscilikli_altin_tutar: getValue('iscilikli_altin_tutar'),
      perakende_satis_fiyati: getValue('perakende_satis_fiyati'),
      iscilik_yuzde_on: getValue('iscilik_yuzde_on'),
      iscilik_kdv: getValue('iscilik_kdv'),
      toplam_satis_fiyati: getValue('toplam_satis_fiyati')
    }
    
    calculateValues()
  } catch (error) {
    console.error('Hata:', error)
    $q.notify({
      color: 'negative',
      message: 'Ürün yüklenirken hata oluştu',
      icon: 'error'
    })
  }
}

const saveProduct = async () => {
  try {
    saving.value = true
    
    // Meta verileri string'e çevirerek kaydedelim
    const meta_data = [
      { key: 'gram', value: String(product.value.gram) },
      { key: 'altin_ayar_milyem', value: String(product.value.altin_ayar_milyem) },
      { key: 'altin_has', value: String(product.value.altin_has) },
      { key: 'iscilik_milyem', value: String(product.value.iscilik_milyem) },
      { key: 'iscilik_milyem_type', value: product.value.iscilik_milyem_type },
      { key: 'urun_carpani', value: String(product.value.urun_carpani) },
      { key: 'urun_carpani_type', value: product.value.urun_carpani_type },
      { key: 'iscilikli_has_maliyet', value: String(product.value.iscilikli_has_maliyet) },
      { key: 'iscilikli_altin_tutar', value: String(product.value.iscilikli_altin_tutar) },
      { key: 'perakende_satis_fiyati', value: String(product.value.perakende_satis_fiyati) },
      { key: 'iscilik_yuzde_on', value: String(product.value.iscilik_yuzde_on) },
      { key: 'iscilik_kdv', value: String(product.value.iscilik_kdv) },
      { key: 'toplam_satis_fiyati', value: String(product.value.toplam_satis_fiyati) }
    ]
    
    await axios.put(`https://tudisilver.com/wp-json/wc/v3/products/${route.params.id}`, {
      ...product.value,
      meta_data
    }, {
      params: {
        consumer_key: 'ck_d0e1f917b5ebaed39f2b972549fe3e0d2d786de4',
        consumer_secret: 'cs_3eab54ece35ceee4ae5b4e61a406b73f68e1c2a2'
      }
    })
    
    $q.notify({
      color: 'positive',
      message: 'Ürün başarıyla kaydedildi',
      icon: 'check'
    })
  } catch (error) {
    console.error('Hata:', error)
    $q.notify({
      color: 'negative',
      message: 'Ürün kaydedilirken hata oluştu',
      icon: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.product-image-card {
  height: 100%;
}

.product-image-card .q-img {
  max-height: 400px;
  object-fit: contain;
}
</style>
