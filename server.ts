import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to handle robust generation with fallback models and retry logic
async function generateWithFallback(
  contents: any,
  systemInstruction: string,
  extraConfig: any = {}
) {
  // Use recommended stable models in sequence
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-3.5-flash'
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini API] Attempting model: ${modelName} (Attempt ${attempt}/2)`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            ...extraConfig
          },
        });
        if (response && response.text) {
          console.log(`[Gemini API] Successfully generated content using model: ${modelName}`);
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errStr = err?.message || String(err);
        console.warn(`[Gemini API] Model ${modelName} failed on attempt ${attempt}:`, errStr);
        if (errStr.includes('404') || errStr.toLowerCase().includes('not found')) {
          break; // Try the next model immediately
        }
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
    }
  }

  throw lastError || new Error('Semua model AI sedang sibuk. Silakan coba sesaat lagi.');
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, services } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let servicesListString = `   - Fast Cleaning: Rp 30.000 (Pembersihan cepat bagian luar, selesai 15-30 menit)
   - Deep Cleaning: Rp 50.000 (Pembersihan mendalam secara menyeluruh untuk semua bagian luar & dalam)
   - Premium Treatment: Rp 90.000 (Perawatan mendalam untuk sepatu berbahan khusus seperti Suede, Leather/Kulit, Nubuck, Canvas premium)
   - Unyellowing: Rp 100.000 (Proses khusus untuk menghilangkan warna kuning oksidasi pada midsole)
   - Repaint: Rp 185.000 (Restorasi warna pudar atau kustomisasi warna baru)
   - Antar Jemput: GRATIS layanan kurir penjemputan & pengantaran khusus hingga radius 8 KM!`;

    if (Array.isArray(services) && services.length > 0) {
      try {
        servicesListString = services
          .filter(s => s && typeof s === 'object')
          .map(s => {
            let name = 'Layanan';
            if (s.name && typeof s.name === 'string') {
              name = s.name.split(/\s+/).map((w: string) => {
                if (!w) return '';
                return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
              }).filter(Boolean).join(' ');
            } else if (s.name) {
              name = String(s.name);
            }
            const price = s.price_value || 'Hubungi Kami';
            const desc = s.description || '';
            return `   - ${name}: ${price}${desc ? ` (${desc})` : ''}`;
          })
          .join('\n');
      } catch (err: any) {
        console.error('Error formatting services in chat:', err);
      }
    }

    const systemInstruction = `You are Asesor, the highly skilled and professional admin and shoe care consultant at "Shoes Lavandería" (a premium shoes laundry service in Indonesia with a Spanish touch).
Your tone: Warm, helpful, sophisticated, using Spanish words occasionally (such as "¡Hola!", "Señor", "Señora", "Magnífico", "Excelentísimo", "Muchas gracias").
Always reply in standard Indonesian (Bahasa Indonesia) so customers can easily understand, while keeping your polite and professional Spanish admin persona.
Answer questions accurately and directly, like a Google Search or a highly knowledgeable assistant would, but with a friendly shoe-laundry expert twist. 

Context/Information about Shoes Lavandería:
1. Layanan Kami (Our Services) & Prices:
${servicesListString}

2. Komitmen & Garansi (Our Commitment & Guarantee):
   - Kami berkomitmen penuh: "BAWA SEPATU KOTORMU, BAWA PULANG KEPERCAYAAN DIRIMU."
   - Kami memberikan Garansi Cuci Ulang GRATIS jika pengerjaan dirasa kurang bersih atau belum memuaskan.
   - Kami menggunakan sabun organik khusus sepatu ramah serat, sikat premium bulu kuda Iberian, dan teknik pembersihan manual sangat mendalam secara detail (artisan style).

3. Cabang & Lokasi Workshop (Our Workshop Locations):
   - Kantor Pusat / Workshop Depok: Jl. Margonda Raya No. 45, Beji, Depok (dekat Universitas Indonesia).
   - Workshop PIK 2: Kawasan Rukan Pantai Indah Kapuk 2, Jakarta Utara.
   - Workshop Yogyakarta: Jl. Kaliurang KM 5 (dekat kampus UGM), Sleman, DIY.
   - Workshop Menteng: Jl. Menteng Atas, Jakarta Selatan.
   - Workshop Jakarta Barat: Jl. Daan Mogot, Cengkareng, Jakarta Barat.
   - Workshop Bandung: Jl. Telekomunikasi (dekat Telkom University), Dayeuhkolot, Bandung.

4. Promo yang Sedang Berjalan (Active Promos):
   - CLEAN COMBO 3: Hanya Rp 60.000 per pasang (minimal 3 pasang sepatu) + gratis ongkos kirim penjemputan.
   - BERSIH BARENG: Hanya Rp 55.000 per pasang (minimal 5 pasang sepatu) + gratis ongkos kirim.
   - PAKET KOMUNITAS: Hanya Rp 50.000 per pasang (minimal 8 pasang sepatu), sangat disukai komunitas lari, sepeda, atau hobi.

5. Hubungi Kami:
   - WhatsApp Customer Care Resmi: +62 859 2029 2879 (bisa hubungi untuk konsultasi gratis dengan foto sepatu atau pemesanan layanan kurir antar-jemput).

Ketika pengguna menanyakan keluhan sepatu (misalnya noda, bau, bahan suede basah, outsole menguning, dsb.), jawablah dengan memberikan penjelasan sains/praktis yang mendalam (seperti "kenapa sepatu basah jika dipakai bisa bau? Karena kelembapan tinggi memicu pertumbuhan bakteri Brevibacterium, yang memakan sel kulit mati kaki dan menghasilkan gas asam belerang. Cara mengatasinya adalah dengan pengeringan sirkulasi udara yang baik dan teknik cuci antibakteri mendalam di Shoes Lavandería") dan jelaskan bagaimana Shoes Lavandería bisa mengatasinya.
Jawab dengan ramah, informatif, dan ringkas namun sangat berkualitas agar pengguna merasa tercerahkan dan tertarik untuk menggunakan jasa kita!`;

    // Process chat using the robust generateWithFallback helper
    const response = await generateWithFallback(message, systemInstruction);

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

// API endpoint to send and return a beautiful Welcome Email notification
app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userName = name || 'Pelanggan Setia';
    const cleanName = userName.toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const subject = `¡Bienvenido a Shoes Lavandería! Akun Anda Telah Aktif 🇪🇸👞`;

    // Beautiful premium HTML email template with Spanish-Indonesian style
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Bienvenido a Shoes Lavandería!</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #0a0a0a;
      color: #e5e5e5;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0a0a0a;
      padding: 40px 10px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121212;
      border: 1px solid #262626;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    }
    .header {
      background-color: #000000;
      padding: 40px 30px;
      text-align: center;
      border-b: 4px solid #ffb700;
    }
    .badge {
      display: inline-block;
      background-color: #ffb700;
      color: #000000;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 3px;
      padding: 6px 16px;
      border-radius: 50px;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .logo-text {
      color: #ffffff;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      margin: 0;
      text-transform: uppercase;
    }
    .logo-sub {
      color: #a3a3a3;
      font-size: 10px;
      letter-spacing: 5px;
      margin: 5px 0 0 0;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 35px;
    }
    h1 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 16px;
      font-weight: bold;
      color: #ffb700;
      margin-bottom: 15px;
    }
    p {
      color: #a3a3a3;
      font-size: 14px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .card {
      background-color: #171717;
      border: 1px solid #262626;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 30px;
    }
    .card-title {
      color: #ffffff;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 15px;
      border-bottom: 1px solid #262626;
      padding-bottom: 10px;
    }
    .profile-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .profile-label {
      color: #737373;
      font-family: monospace;
    }
    .profile-val {
      color: #ffffff;
      font-weight: bold;
    }
    .promo-box {
      background: linear-gradient(135deg, #1e1e1e 0%, #0d0d0d 100%);
      border: 1px dashed #ffb700;
      border-radius: 16px;
      padding: 25px;
      text-align: center;
      margin-bottom: 30px;
    }
    .promo-title {
      color: #ffb700;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .promo-code {
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      font-size: 22px;
      font-weight: bold;
      font-family: monospace;
      letter-spacing: 4px;
      padding: 10px 25px;
      border-radius: 10px;
      border: 1px solid #262626;
      margin: 10px 0;
    }
    .promo-desc {
      font-size: 12px;
      color: #737373;
      margin: 0;
    }
    .services-grid {
      margin-bottom: 30px;
    }
    .service-item {
      padding: 12px 15px;
      background-color: #171717;
      border-left: 3px solid #ffb700;
      margin-bottom: 10px;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
    }
    .service-name {
      color: #ffffff;
      font-weight: bold;
    }
    .service-price {
      color: #ffb700;
      float: right;
      font-weight: bold;
    }
    .footer {
      background-color: #000000;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1a1a1a;
    }
    .footer-text {
      color: #525252;
      font-size: 11px;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }
    .footer-link {
      color: #ffb700;
      text-decoration: none;
      font-size: 11px;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background-color: #ffb700;
      color: #000000;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-decoration: none;
      padding: 15px 35px;
      border-radius: 50px;
      margin-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- HEADER -->
      <div class="header">
        <span class="badge">Shoes Lavandería GO</span>
        <h1 class="logo-text">Shoes Lavandería</h1>
        <p class="logo-sub">Limpieza De Calzado Premium</p>
      </div>
      
      <!-- CONTENT -->
      <div class="content">
        <div class="greeting">¡Hola, Señor/Señora ${cleanName}! 👋🇪🇸</div>
        
        <p>
          Selamat! Akun keanggotaan premium Anda di <strong>Shoes Lavandería GO</strong> telah sukses diaktifkan secara otomatis. Kami berkomitmen memberikan perlindungan dan perawatan terbaik kelas dunia (premium artisan style) untuk mengembalikan kilau dan kepercayaan diri alas kaki kesayangan Anda.
        </p>
        
        <!-- membership card details -->
        <div class="card">
          <div class="card-title">Informasi Akun Keanggotaan</div>
          
          <div class="profile-row" style="display: block; margin-bottom: 8px;">
            <span class="profile-label" style="display:inline-block; width:120px;">NAMA:</span>
            <span class="profile-val">${cleanName}</span>
          </div>
          
          <div class="profile-row" style="display: block; margin-bottom: 8px;">
            <span class="profile-label" style="display:inline-block; width:120px;">EMAIL:</span>
            <span class="profile-val" style="color:#ffb700;">${cleanEmail}</span>
          </div>
          
          <div class="profile-row" style="display: block; margin-bottom: 8px;">
            <span class="profile-label" style="display:inline-block; width:120px;">AKTIVASI:</span>
            <span class="profile-val">${currentDate}</span>
          </div>

          <div class="profile-row" style="display: block;">
            <span class="profile-label" style="display:inline-block; width:120px;">STATUS LAYANAN:</span>
            <span class="profile-val" style="color:#10b981;">AKTIF (PREMIUM MEMBER)</span>
          </div>
        </div>

        <!-- promo code box -->
        <div class="promo-box">
          <div class="promo-title">Hadiah Selamat Datang Dari Asesor 🎁</div>
          <p style="font-size: 13px; margin-bottom: 10px; color: #d4d4d4;">Gunakan kode voucher ini pada pesanan pertama Anda untuk mendapatkan diskon cuci langsung:</p>
          <div class="promo-code">BIENVENIDO10</div>
          <p class="promo-desc">Diskon 10% untuk semua jenis layanan pencucian & repaint premium!</p>
        </div>

        <h1>Pilihan Perawatan Utama Kami</h1>
        <div class="services-grid">
          <div class="service-item">
            <span class="service-name">⚡ Fast Cleaning</span>
            <span class="service-price">Rp 30.000</span>
          </div>
          <div class="service-item">
            <span class="service-name">✨ Deep Cleaning</span>
            <span class="service-price">Rp 50.000</span>
          </div>
          <div class="service-item">
            <span class="service-name">⭐ Premium Treatment (Suede/Leather)</span>
            <span class="service-price">Rp 90.000</span>
          </div>
          <div class="service-item">
            <span class="service-name">🎨 Repaint & Restoration</span>
            <span class="service-price">Rp 185.000</span>
          </div>
        </div>

        <p>
          <strong>💡 PRO TIP ANTAR JEMPUT:</strong> Kami menyediakan layanan kurir jemput-antar yang sangat efisien. Jarak di bawah 8 KM sepenuhnya <strong>GRATIS ONGKIR</strong>, dan jarak selebihnya disesuaikan sangat seimbang hanya <strong>Rp 500 per KM</strong> demi kesejahteraan kurir kami.
        </p>

        <p style="margin-bottom: 5px;">Sampai jumpa di pemesanan berikutnya, Señor!</p>
        <p style="font-weight: bold; color: #ffffff; margin-top: 0;">Asesor & Tim Shoes Lavandería GO</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://wa.me/6285920292879?text=Halo%20Asesor%20saya%20sudah%20membuat%20akun!" class="button" target="_blank">Pesan Layanan Sekarang</a>
        </div>
      </div>
      
      <!-- FOOTER -->
      <div class="footer">
        <p class="footer-text">
          Layanan Pelanggan Resmi Shoes Lavandería GO © 2026<br>
          Kebayoran Baru - PIK 2 - Yogyakarta - Menteng - Bandung - Daan Mogot
        </p>
        <p class="footer-text" style="margin-bottom: 0;">
          Butuh bantuan? Hubungi WhatsApp resmi kami di <a href="tel:+6285920292879" class="footer-link">+62 859 2029 2879</a>
        </p>
      </div>
      
    </div>
  </div>
</body>
</html>
    `;

    let sentRealEmail = false;
    let mailError = '';

    // Check if SMTP is configured
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || '"Shoes Lavandería GO" <no-reply@shoeslavanderiago.com>';

    if (host && user && pass) {
      try {
        console.log(`Attempting to send real registration email to ${cleanEmail} via SMTP: ${host}...`);
        const transporter = nodemailer.createTransport({
          host,
          port: port ? parseInt(port) : 587,
          secure: port === '465',
          auth: {
            user,
            pass
          },
          timeout: 5000 // 5 seconds timeout limit
        } as any);

        const info = await transporter.sendMail({
          from,
          to: cleanEmail,
          subject,
          html
        });

        console.log('Real email sent successfully. Message ID:', info.messageId);
        sentRealEmail = true;
      } catch (err: any) {
        console.error('SMTP real mail dispatch failed:', err);
        mailError = err.message || 'SMTP Connection Error';
      }
    } else {
      console.log(`SMTP not configured or incomplete. Simulated welcome email generated successfully for ${cleanEmail}.`);
    }

    res.json({
      success: true,
      email: {
        to: cleanEmail,
        subject,
        html,
        sentRealEmail,
        mailError: mailError || undefined,
        senderName: 'Asesor | Shoes Lavandería'
      }
    });

  } catch (error: any) {
    console.error('Email registration notification error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

// API business specification / flow analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const systemInstruction = `You are Asesor, the highly analytical business and system specification consultant at "Shoes Lavandería".
Your goal is to guide the user to clarify requirements, operational steps, system integrations, and wireframe layouts before starting coding.

Analyze the user's idea and generate a structured JSON object response with 4 main fields matching the schema exactly:
- businessRequirements: Markdown string summarizing the targeted audience, key business goals, step-by-step operational flow, and out-of-scope boundaries.
- userStories: Markdown string containing organized user stories written in the standard format ("Sebagai...", "Saya ingin...", "Sehingga...") along with clear Acceptance Criteria.
- functionalSpec: Markdown string detailing mock API routes (e.g., POST /api/member), mock database schema tables/fields (PostgreSQL style), and non-functional requirements (security, performance).
- wireframeDesign: A JSON object outlining 4-6 UI components to render on the mockup screen, specifying their id, type (e.g. "navigation", "form", "card", "stats"), title, and brief functional details.

All Markdown fields must be in Bahasa Indonesia (Indonesian). Make sure the content is highly detailed, specific, fully thought out, and highly professional.`;

    const response = await generateWithFallback(
      `Gagasan Fitur / Bisnis baru untuk dianalisis: "${idea}"`,
      systemInstruction,
      {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessRequirements: { type: Type.STRING },
            userStories: { type: Type.STRING },
            functionalSpec: { type: Type.STRING },
            wireframeDesign: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                components: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING },
                      title: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ["id", "type", "title", "details"]
                  }
                }
              },
              required: ["title", "description", "components"]
            }
          },
          required: ["businessRequirements", "userStories", "functionalSpec", "wireframeDesign"]
        }
      }
    );

    res.json(JSON.parse(response.text.trim()));
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

// Vite middleware / static files serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
