// WordPress REST API ile iletişim kuracak servis
import axios from 'axios'

class WordPressService {
  constructor() {
    this.client = null
    this.settings = null
  }

  updateCredentials(settings) {
    this.settings = settings
    console.log('Updating credentials with settings:', settings)
    
    // WooCommerce REST API v3 endpoint'i
    const baseURL = `${settings.siteUrl}/wp-json/wc/v3`
    console.log('Base URL:', baseURL)
    
    this.client = axios.create({
      baseURL,
      auth: {
        username: settings.apiKey,
        password: settings.apiSecret
      }
    })
  }

  async testConnection(settings) {
    console.log('Testing connection with settings:', settings)
    const testClient = axios.create({
      baseURL: `${settings.siteUrl}/wp-json/wc/v3`,
      auth: {
        username: settings.apiKey,
        password: settings.apiSecret
      }
    })

    try {
      const response = await testClient.get('/products')
      console.log('Test connection successful:', response.data)
      return true
    } catch (error) {
      console.error('Test connection failed:', error.response?.data || error.message)
      throw new Error('WordPress bağlantısı başarısız')
    }
  }

  async getProducts() {
    if (!this.client) {
      throw new Error('WordPress ayarları yapılandırılmamış')
    }

    try {
      console.log('Fetching WordPress products...')
      const response = await this.client.get('/products', {
        params: {
          per_page: 100 // Sayfa başına maksimum ürün sayısı
        }
      })
      console.log('WordPress products fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('WordPress ürünleri alınırken hata:', error.response?.data || error.message)
      throw error
    }
  }

  async syncProduct(productId) {
    if (!this.client) {
      throw new Error('WordPress ayarları yapılandırılmamış')
    }

    try {
      console.log('Syncing product:', productId)
      const response = await this.client.get(`/products/${productId}`)
      const wpProduct = response.data
      console.log('Product synced:', wpProduct)

      // PouchDB'ye kaydet
      // TODO: Implement PouchDB sync
      console.log('Ürün senkronize edildi:', wpProduct)

      return wpProduct
    } catch (error) {
      console.error('Ürün senkronizasyonu hatası:', error.response?.data || error.message)
      throw error
    }
  }
}

export const wordpressService = new WordPressService()
