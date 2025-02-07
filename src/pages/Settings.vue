<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Fiyatlar</div>

      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Fiyatlar -->
            <div class="col-12">
              <div class="text-h6 q-mb-md">Fiyatlar</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.has_altin_fiyat"
                    label="Has Altın Fiyatı"
                    outlined
                    dense
                    type="number"
                    suffix="₺"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.dolar_fiyat"
                    label="Dolar Fiyatı"
                    outlined
                    dense
                    type="number"
                    suffix="₺"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.kargo"
                    label="Kargo"
                    outlined
                    dense
                    type="number"
                    suffix="₺"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.paketleme"
                    label="Paketleme"
                    outlined
                    dense
                    type="number"
                    suffix="₺"
                  />
                </div>
              </div>
            </div>

            <!-- Ürün Çarpanları -->
            <div class="col-12">
              <div class="text-h6 q-mb-md">Ürün Çarpanları</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.hizma"
                    label="Hızma"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.kupe"
                    label="Küpe"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.bileklik"
                    label="Bileklik"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.piercing"
                    label="Piercing"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.dogal_tas_bileklik"
                    label="Doğal Taş Bileklikler"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.sahmeran"
                    label="Şahmeran"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.halhal"
                    label="Halhal"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.kolye"
                    label="Kolye"
                    outlined
                    dense
                    type="number"
                  />
                </div>
              </div>
            </div>

            <!-- Milyem Değerleri -->
            <div class="col-12">
              <div class="text-h6 q-mb-md">Milyem Değerleri</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.hizma_milyem"
                    label="Hızma Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.kupe_milyem"
                    label="Küpe Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.bileklik_milyem"
                    label="Bileklik Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.gobek_piercing_milyem"
                    label="Göbek Piercing Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.standart_piercing_milyem"
                    label="Standart Piercing Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.dogal_tas_bileklik_milyem"
                    label="Doğal Taş Bileklikler Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.sahmeran_halhal_milyem"
                    label="Şahmeran / Halhal Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model.number="settings.kolye_milyem"
                    label="Kolye Milyem"
                    outlined
                    dense
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Kaydet"
            color="primary"
            @click="saveSettings"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const saving = ref(false)

const settings = ref({
  // Fiyatlar
  has_altin_fiyat: 0,
  dolar_fiyat: 0,
  kargo: 0,
  paketleme: 0,

  // Ürün Çarpanları
  hizma: 0,
  kupe: 0,
  bileklik: 0,
  piercing: 0,
  dogal_tas_bileklik: 0,
  sahmeran: 0,
  halhal: 0,
  kolye: 0,

  // Milyem Değerleri
  hizma_milyem: 0,
  kupe_milyem: 0,
  bileklik_milyem: 0,
  gobek_piercing_milyem: 0,
  standart_piercing_milyem: 0,
  dogal_tas_bileklik_milyem: 0,
  sahmeran_halhal_milyem: 0,
  kolye_milyem: 0
})

onMounted(async () => {
  if (!localStorage.getItem('isLoggedIn')) {
    router.push('/login')
    return
  }
  loadSettings()
})

const loadSettings = () => {
  // Kayıtlı ayarları localStorage'dan yükle
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
}

const saveSettings = () => {
  try {
    saving.value = true
    // Ayarları localStorage'a kaydet
    localStorage.setItem('settings', JSON.stringify(settings.value))
    
    $q.notify({
      color: 'positive',
      message: 'Fiyatlar kaydedildi',
      icon: 'check'
    })
  } catch (error) {
    console.error('Hata:', error)
    $q.notify({
      color: 'negative',
      message: 'Fiyatlar kaydedilirken hata oluştu',
      icon: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>
