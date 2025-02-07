<template>
  <div class="barcode-scanner">
    <video ref="video" class="scanner-video" />
    <canvas ref="canvas" class="scanner-canvas" />
    
    <q-btn
      color="primary"
      icon="camera_alt"
      label="Barkod Tara"
      @click="startScanning"
      :loading="isScanning"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/library'

const emit = defineEmits(['barcodeDetected'])
const video = ref(null)
const canvas = ref(null)
const isScanning = ref(false)
let codeReader = null

onMounted(() => {
  codeReader = new BrowserMultiFormatReader()
})

onUnmounted(() => {
  if (codeReader) {
    codeReader.reset()
  }
})

const startScanning = async () => {
  try {
    isScanning.value = true
    const videoInputDevices = await codeReader.listVideoInputDevices()
    const selectedDeviceId = videoInputDevices[0].deviceId

    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      video.value,
      (result, err) => {
        if (result) {
          emit('barcodeDetected', result.text)
          codeReader.reset()
          isScanning.value = false
        }
        if (err && !(err instanceof TypeError)) {
          console.error(err)
        }
      }
    )
  } catch (err) {
    console.error('Kamera erişim hatası:', err)
    isScanning.value = false
  }
}
</script>

<style scoped>
.barcode-scanner {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.scanner-video {
  width: 100%;
  max-width: 640px;
  margin-bottom: 1rem;
}

.scanner-canvas {
  display: none;
}
</style>
