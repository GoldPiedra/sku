import PouchDB from 'pouchdb'
import PouchFind from 'pouchdb-find'
PouchDB.plugin(PouchFind)

// Yerel veritabanı oluştur
const localDB = new PouchDB('stok_veri')

// WordPress senkronizasyon için uzak veritabanı (daha sonra yapılandırılacak)
let remoteDB = null

export const initializeDB = (wordpressUrl, credentials) => {
  remoteDB = new PouchDB(`${wordpressUrl}/wp-json/pouchdb/v1/database`, {
    auth: credentials
  })
  
  // İki yönlü senkronizasyonu başlat
  return localDB.sync(remoteDB, {
    live: true,
    retry: true
  }).on('change', function (change) {
    console.log('Değişiklik:', change)
  }).on('error', function (err) {
    console.error('Senkronizasyon hatası:', err)
  })
}

// Stok işlemleri
export const stokIslemleri = {
  // Yeni ürün ekle
  async urunEkle(urun) {
    try {
      const response = await localDB.post({
        ...urun,
        type: 'urun',
        createdAt: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Ürün ekleme hatası:', error)
      throw error
    }
  },

  // Ürün güncelle
  async urunGuncelle(urun) {
    try {
      const response = await localDB.put(urun)
      return response
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error)
      throw error
    }
  },

  // Ürün sil
  async urunSil(urunId, rev) {
    try {
      const response = await localDB.remove(urunId, rev)
      return response
    } catch (error) {
      console.error('Ürün silme hatası:', error)
      throw error
    }
  },

  // Tüm ürünleri getir
  async tumUrunleriGetir() {
    try {
      const result = await localDB.find({
        selector: {
          type: 'urun'
        }
      })
      return result.docs
    } catch (error) {
      console.error('Ürün listesi getirme hatası:', error)
      throw error
    }
  },

  // Barkoda göre ürün ara
  async barkodaGoreUrunBul(barkod) {
    try {
      const result = await localDB.find({
        selector: {
          type: 'urun',
          barkod: barkod
        }
      })
      return result.docs[0]
    } catch (error) {
      console.error('Barkod arama hatası:', error)
      throw error
    }
  }
}

export default {
  localDB,
  initializeDB,
  stokIslemleri
}
