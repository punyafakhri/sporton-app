# Sporton App

Platform e-commerce untuk manajemen produk olahraga dengan fitur customer shopping dan admin dashboard.

## 🚀 Live Demo

- **Customer**: https://sporton-app.vercel.app/
- **Admin Panel**: https://sporton-app.vercel.app/admin/login

## ✨ Fitur Utama

### Customer Features
- 🏠 Home page dengan daftar produk
- 🔍 Detail produk dengan informasi lengkap
- 🛒 Keranjang belanja (checkout)
- 💳 Integrasi payment gateway
- ✅ Konfirmasi pembayaran

### Admin Features
- 👤 Login authentication
- 📦 Manajemen produk (CRUD)
- 🏷️ Manajemen kategori
- 🏦 Manajemen data bank
- 💰 Riwayat transaksi

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.13.2
- **Styling**: CSS3
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 16+ 
- npm atau yarn
- Git

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/sporton-app.git
cd sporton-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
Buat file `.env.local` di root project:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sporton App
```

### 4. Run Development Server
```bash
npm run dev
```
Aplikasi akan tersedia di `http://localhost:5173/`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Jalankan development server dengan hot reload |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview build hasil production secara lokal |

## 📁 Project Structure

```
sporton-app/
├── src/
│   ├── admin/              # Halaman admin
│   │   └── AdminLayout.jsx
│   ├── api/                # API integration
│   ├── components/         # Reusable components
│   ├── styles/             # Stylesheet
│   ├── assets/             # Images dan static files
│   ├── App.jsx             # Main app component
│   ├── Home.jsx            # Home page
│   ├── LoginPage.jsx       # Admin login
│   ├── ProductDetail.jsx   # Detail produk
│   ├── CheckoutPage.jsx    # Halaman checkout
│   ├── PaymentPage.jsx     # Halaman pembayaran
│   ├── PaymentStatusPage.jsx # Status pembayaran
│   ├── ProductManagement.jsx # Admin: kelola produk
│   ├── CategoryManagement.jsx # Admin: kelola kategori
│   ├── BankManagement.jsx  # Admin: kelola bank
│   ├── TransactionManagement.jsx # Admin: riwayat transaksi
│   └── main.jsx            # Entry point
├── public/                 # Static files
├── vercel.json             # Vercel config
├── vite.config.js          # Vite configuration
└── package.json
```

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login ke Vercel**
```bash
vercel login
```

3. **Deploy ke Production**
```bash
vercel --prod
```

### Environment Variables di Vercel

1. Buka project di [Vercel Dashboard](https://vercel.com)
2. Masuk ke **Settings > Environment Variables**
3. Tambahkan variabel yang diperlukan

## 🔑 Routing Structure

### Customer Routes
- `/` - Home page
- `/product/:id` - Detail produk
- `/checkout` - Halaman checkout
- `/payment` - Halaman pembayaran
- `/payment-status` - Status pembayaran

### Admin Routes
- `/admin/login` - Login admin
- `/admin/products` - Manajemen produk
- `/admin/categories` - Manajemen kategori
- `/admin/banks` - Manajemen bank
- `/admin/transactions` - Riwayat transaksi

## 🔐 Authentication

Sistem login admin tersedia di `/admin/login`. Pastikan backend API sudah dikonfigurasi untuk authentication.

## 🌐 API Integration

Aplikasi menggunakan Axios untuk API communication. Konfigurasi API endpoint di:
- File API configuration di `src/api/`
- Environment variables di `.env.local`

## 📱 Responsive Design

Aplikasi sudah responsive dan teruji di:
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (320x568, 375x667)

## 🐛 Troubleshooting

### Port 5173 sudah digunakan
```bash
npm run dev -- --port 3000
```

### Build error
```bash
npm run build -- --debug
```

### Clear cache
```bash
rm -rf node_modules
npm install
```

## 📚 Dependencies

```json
{
  "axios": "^1.13.2",          // HTTP client
  "react": "^18.2.0",           // UI library
  "react-dom": "^18.2.0",       // React DOM
  "react-router-dom": "^6.20.0" // Routing
}
```

## 💡 Best Practices

- ✅ Gunakan environment variables untuk sensitive data
- ✅ Test di localhost sebelum deploy
- ✅ Commit messages yang descriptive
- ✅ Update dependencies secara berkala
- ✅ Monitor error logs di Vercel Dashboard

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Muhammad Fakhri Aldiansyah**
- GitHub: [@mfakhri](https://github.com/yourusername)

## 📞 Support

Jika ada pertanyaan atau issue, silahkan buka [Issues](https://github.com/yourusername/sporton-app/issues) atau hubungi langsung.

---

**Last Updated**: January 25, 2026  
**Version**: 0.0.1
