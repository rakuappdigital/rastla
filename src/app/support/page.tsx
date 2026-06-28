export default function SupportPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "system-ui, sans-serif", lineHeight: 1.7 }}>

      {/* EN */}
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Support</h1>
      <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 32 }}>Luckura — Your Luck Tools</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Contact</h2>
      <p>For any questions, bug reports, or feedback, please reach us at:</p>
      <p><a href="mailto:sivilpenguen@gmail.com" style={{ fontWeight: 600 }}>sivilpenguen@gmail.com</a></p>
      <p>We aim to respond within 48 hours.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Frequently Asked Questions</h2>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Does the app require an internet connection?</h3>
      <p>No. Luckura works fully offline after installation.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Is my data stored on any server?</h3>
      <p>No. All your preferences and names are stored only on your device and are never sent anywhere.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>How do I switch between Turkish and English?</h3>
      <p>Tap the TR / EN toggle in the top-right corner of the app.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>How do I reset my data?</h3>
      <p>On any page, tap the "Reset" button at the top right. You will be asked to confirm before anything is deleted.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>The app is not working correctly. What should I do?</h3>
      <p>Try closing and reopening the app. If the problem persists, please contact us at the email above with a description of the issue.</p>

      <hr style={{ border: "none", borderTop: "1px solid #e5e5e5", margin: "56px 0" }} />

      {/* TR */}
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Destek</h1>
      <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 32 }}>Luckura — Şans Araçları</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>İletişim</h2>
      <p>Soru, hata bildirimi veya geri bildirim için bizimle iletişime geçin:</p>
      <p><a href="mailto:sivilpenguen@gmail.com" style={{ fontWeight: 600 }}>sivilpenguen@gmail.com</a></p>
      <p>48 saat içinde yanıt vermeye çalışıyoruz.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Sık Sorulan Sorular</h2>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Uygulama internet bağlantısı gerektiriyor mu?</h3>
      <p>Hayır. Luckura kurulumdan sonra tamamen çevrimdışı çalışır.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Verilerim bir sunucuda saklanıyor mu?</h3>
      <p>Hayır. Tüm tercihleriniz ve isimleriniz yalnızca cihazınızda saklanır, hiçbir yere gönderilmez.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Türkçe ve İngilizce arasında nasıl geçiş yaparım?</h3>
      <p>Uygulamanın sağ üst köşesindeki TR / EN düğmesine dokunun.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Verilerimi nasıl sıfırlarım?</h3>
      <p>Herhangi bir sayfada sağ üstteki "Sıfırla" düğmesine dokunun. Silme işleminden önce onay istenecektir.</p>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 4 }}>Uygulama düzgün çalışmıyor. Ne yapmalıyım?</h3>
      <p>Uygulamayı kapatıp yeniden açmayı deneyin. Sorun devam ederse yukarıdaki e-posta adresine sorunun açıklamasıyla ulaşın.</p>
    </div>
  );
}
