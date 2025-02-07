import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()
app.use(cors())

// Debug için axios interceptor ekleyelim
axios.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    params: request.params
  })
  return request
})

axios.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    })
    return response
  },
  error => {
    console.log('Response Error:', {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      }
    })
    return Promise.reject(error)
  }
)

const WP_URL = 'https://tudisilver.com/wp-json/wc/v3'
const CONSUMER_KEY = 'ck_d0e1f917b5ebaed39f2b972549fe3e0d2d786de4'
const CONSUMER_SECRET = 'cs_3eab54ece35ceee4ae5b4e61a406b73f68e1c2a2'

app.get('/api/products', async (req, res) => {
  try {
    console.log('API Request received for products')
    
    const url = `${WP_URL}/products`
    console.log('Making request to:', url)
    
    const response = await axios.get(url, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 100
      },
      validateStatus: false // Tüm HTTP durumlarını kabul et
    })

    // HTTP durumunu kontrol et
    if (response.status >= 400) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(response.data)}`)
    }

    res.json(response.data)
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      }
    })
    
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || error.code
    })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WordPress API URL: ${WP_URL}`)
})
