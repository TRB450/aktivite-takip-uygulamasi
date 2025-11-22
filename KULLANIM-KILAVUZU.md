# Aktivite Takip Uygulaması - Kullanım Kılavuzu

## 📱 Telefonunuzda Ücretsiz Kullanım

Bu uygulama tamamen size ait ve sonsuza dek ücretsiz kullanabilirsiniz. İki yöntem var:

---

## Yöntem 1: Expo Go ile Hızlı Test (İnternet Gerekir)

1. **Expo Go Uygulamasını İndirin**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Projeyi Bilgisayarınızda Çalıştırın**
   ```bash
   # Dosyaları açın
   tar -xzf aktivite-takip-kaynak.tar.gz
   cd workspace
   
   # Bağımlılıkları yükleyin (ilk kez)
   npm install
   
   # Uygulamayı başlatın
   npm run dev
   ```

3. **QR Kod ile Bağlanın**
   - Terminal'de çıkan QR kodu Expo Go ile tarayın
   - Uygulama telefonunuzda açılır

**Not:** Bu yöntem bilgisayar çalışırken ve aynı wifi'de olduğunuzda çalışır.

---

## Yöntem 2: APK Build (Tamamen Bağımsız - ÖNERİLEN)

Telefonunuzda internet olmadan da çalışacak kendi APK'nızı oluşturun:

### Adım 1: Expo Hesabı Oluşturun (Ücretsiz)
```bash
npx expo login
```

### Adım 2: Android APK Oluşturun
```bash
# EAS Build kurulumu (ilk kez)
npm install -g eas-cli
eas build:configure

# APK oluştur (15-20 dakika sürer)
eas build --platform android --profile preview
```

### Adım 3: APK'yı İndirin ve Kurun
- Build tamamlanınca link verilir
- APK'yı telefonunuza indirin
- "Bilinmeyen kaynaklardan kuruluma izin ver" açın
- APK'yı kurun

**Artık uygulama tamamen sizdedir!** İnternet olmadan da çalışır.

---

## 📂 Proje Yapısı

```
workspace/
├── app.json              # Uygulama yapılandırması
├── App.tsx              # Ana uygulama dosyası
├── screens/             # Ekranlar
│   ├── ActivitiesScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── ProfileScreen.tsx
│   └── ...
├── components/          # Yeniden kullanılabilir bileşenler
├── navigation/          # Navigasyon yapılandırması
├── utils/              # Yardımcı fonksiyonlar
│   └── storage.ts      # Veri saklama
└── constants/          # Tema ve sabitler
```

---

## 🔧 Özelleştirme

### Uygulama Adını Değiştirme
`app.json` dosyasında:
```json
{
  "name": "İstediğiniz İsim",
  "displayName": "İstediğiniz İsim"
}
```

### Renkleri Değiştirme
`constants/theme.ts` dosyasında renkleri düzenleyin.

---

## 💾 Verileriniz

- Tüm veriler telefonunuzda **AsyncStorage** ile saklanır
- Hiçbir veri sunucuya gönderilmez
- Tamamen gizli ve güvenli
- Uygulama silinirse veriler de silinir
- "Verileri Dışa Aktar" ile yedek alabilirsiniz

---

## 🆘 Sorun Giderme

### "npm install" hatası alıyorum
```bash
# Node.js ve npm'in kurulu olduğundan emin olun
node --version
npm --version

# Gerekirse cache temizleyin
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### APK kurulmuyor
- "Bilinmeyen kaynaklar" iznini açın
- Telefonunuzda yeterli yer olduğundan emin olun
- Android 5.0 veya üstü gerekir

---

## 📝 Lisans

Bu kodlar tamamen size aittir. İstediğiniz gibi kullanabilir, değiştirebilir ve paylaşabilirsiniz.

---

**Keyifli kullanımlar! 🎉**
