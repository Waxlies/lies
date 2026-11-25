# Discord Moderasyon Botu

Discord.js v14 ile hazırlanmış, Slash komutlarını (`/`) kullanan moderasyon botu şablonu.

## Komut Listesi
- `/ban` - Kullanıcıyı sunucudan yasaklar.
- `/unban` - Belirtilen ID'ye sahip kullanıcının yasağını açar.
- `/kick` - Kullanıcıyı sunucudan atar.
- `/timeout` - Kullanıcıyı belirtilen dakika kadar zaman aşımına uğratır (susturur).
- `/untimeout` - Zaman aşımını kaldırır.
- `/clear` - Kanaldan belirtilen miktarda mesajı siler.

## Başlangıç

1. Bağımlılıkları kurun:
   ```bash
   npm install
   ```

2. `.env.example` dosyasını referans alarak `.env` oluşturun:
   - `DISCORD_TOKEN`: Bot tokeniniz
   - `CLIENT_ID`: Bot uygulama ID'niz
   - `GUILD_ID`: Test edeceğiniz sunucunun ID'si (opsiyonel)

3. Komutları kaydedin:
   ```bash
   npm run deploy
   ```

4. Botu çalıştırın:
   ```bash
   npm start
   ```
