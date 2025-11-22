# 📱 Aktivite Takip Uygulaması

React Native ve Expo ile geliştirilmiş, tamamen **ücretsiz ve açık kaynak** bir aktivite takip uygulaması.

## ✨ Özellikler

- ✅ **Aktivite Yönetimi**: Aktivite ekleme, düzenleme ve silme
- ⏱️ **Süre Takibi**: Start/Stop butonları ile gerçek zamanlı takip
- 📊 **İstatistikler**: Günlük, haftalık ve aylık grafikler
- 📈 **Aktivite Dökümü**: Her aktivite için toplam süre görüntüleme
- 💾 **Veri Dışa Aktarma**: JSON formatında yedekleme
- 🇹🇷 **Türkçe Arayüz**: Tam Türkçe dil desteği
- 📱 **Offline Çalışma**: İnternet bağlantısı gerektirmez
- 🔒 **Gizlilik**: Tüm veriler cihazınızda saklanır

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Expo CLI (otomatik yüklenecek)

### Adımlar

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## 📱 Telefonunuzda Çalıştırma

### Yöntem 1: Expo Go ile Test (Hızlı)

1. **Expo Go** uygulamasını indirin:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. QR kodu Expo Go ile tarayın

### Yöntem 2: APK Oluşturma (Kalıcı Kurulum - ÖNERİLEN)

Kendi bağımsız APK'nızı oluşturun:

```bash
# EAS CLI kur (ilk kez)
npm install -g eas-cli
eas login

# Build yapılandırması
eas build:configure

# Android APK oluştur
eas build --platform android --profile preview
```

Build tamamlanınca size APK linki verilir. Bu APK'yı telefonunuza kurun ve sonsuza dek ücretsiz kullanın!

## 📂 Proje Yapısı

```
.
├── App.tsx                 # Ana uygulama
├── app.json               # Uygulama yapılandırması
├── screens/               # Ekranlar
│   ├── ActivitiesScreen.tsx    # Aktiviteler listesi
│   ├── DashboardScreen.tsx     # İstatistikler
│   ├── ProfileScreen.tsx       # Profil ve ayarlar
│   └── ...
├── components/            # Yeniden kullanılabilir bileşenler
├── navigation/           # React Navigation yapılandırması
├── utils/               # Yardımcı fonksiyonlar
│   └── storage.ts       # AsyncStorage yönetimi
└── constants/          # Tema ve sabitler
```

## 🎨 Özelleştirme

### Uygulama Adını Değiştirme

`app.json` dosyasında:

```json
{
  "expo": {
    "name": "İstediğiniz İsim",
    "slug": "istediginiz-isim"
  }
}
```

### Renk Temasını Değiştirme

`constants/theme.ts` dosyasında renkleri düzenleyebilirsiniz.

## 💾 Veri Saklama

- Tüm veriler **AsyncStorage** ile cihazınızda saklanır
- Hiçbir veri sunucuya gönderilmez
- Uygulama silinirse veriler de silinir
- "Verileri Dışa Aktar" özelliği ile JSON yedek alabilirsiniz

## 🛠️ Teknolojiler

- **React Native** - Mobil uygulama framework'ü
- **Expo** - Hızlı geliştirme platformu
- **TypeScript** - Tip güvenli JavaScript
- **React Navigation** - Navigasyon yönetimi
- **AsyncStorage** - Yerel veri saklama
- **Expo Vector Icons** - İkonlar

## 📄 Lisans

Bu proje MIT lisansı altındadır. İstediğiniz gibi kullanabilir, değiştirebilir ve paylaşabilirsiniz.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📞 Destek

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Keyifli kullanımlar! 🎉**
