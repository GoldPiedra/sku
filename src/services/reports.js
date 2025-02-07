import { utils, writeFile } from 'xlsx'
import { jsPDF } from 'jspdf'
import { Parser } from '@json2csv/plainjs'

export const reportService = {
  async exportToExcel(data, filename = 'stok-raporu.xlsx') {
    try {
      // Excel çalışma kitabı oluştur
      const wb = utils.book_new()
      
      // Veriyi çalışma sayfasına dönüştür
      const ws = utils.json_to_sheet(data)
      
      // Çalışma sayfasını kitaba ekle
      utils.book_append_sheet(wb, ws, 'Stok Raporu')
      
      // Excel dosyasını kaydet
      writeFile(wb, filename)
      
      return true
    } catch (error) {
      console.error('Excel export hatası:', error)
      throw error
    }
  },

  async exportToPDF(data, filename = 'stok-raporu.pdf') {
    try {
      const doc = new jsPDF()
      
      // Başlık ekle
      doc.setFontSize(16)
      doc.text('Stok Raporu', 20, 20)
      
      // Tablo başlıkları
      const headers = ['Barkod', 'Ürün Adı', 'Stok', 'Fiyat']
      let y = 40
      
      doc.setFontSize(12)
      doc.setTextColor(100)
      
      // Başlıkları yazdır
      headers.forEach((header, i) => {
        doc.text(header, 20 + (i * 40), y)
      })
      
      // Verileri yazdır
      data.forEach((item) => {
        y = y + 10
        if (y >= 280) {
          doc.addPage()
          y = 20
        }
        
        doc.text(String(item.barkod), 20, y)
        doc.text(String(item.ad).substring(0, 15), 60, y)
        doc.text(String(item.stok), 100, y)
        doc.text(String(item.fiyat), 140, y)
      })
      
      // PDF dosyasını kaydet
      doc.save(filename)
      
      return true
    } catch (error) {
      console.error('PDF export hatası:', error)
      throw error
    }
  },

  async exportToCSV(data, filename = 'stok-raporu.csv') {
    try {
      const parser = new Parser()
      const csv = parser.parse(data)
      
      // CSV dosyasını indir
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      return true
    } catch (error) {
      console.error('CSV export hatası:', error)
      throw error
    }
  }
}

export default reportService
