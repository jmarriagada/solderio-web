# SoldeRío — Plataforma Web de Ingeniería Solar en el Sur de Chile

> **Soberanía Energética Inteligente** • Macrozona Sur (Los Lagos, Los Ríos, La Araucanía).  
> Sitio Oficial en Producción: [https://solderio.cl](https://solderio.cl)

---

## ☀️ Sobre el Proyecto

**SoldeRío** es la plataforma digital de ingeniería fotovoltaica líder en el sur de Chile. Ofrece pre-dimensionamiento solar interactivo para hogares, parcelas y empresas, cumplimiento estricto de los Pliegos Técnicos RIC de la SEC, tramitación de la Ley Net Billing 21.118, almacenamiento BESS con baterías LiFePO4 de conmutación ininterrumpida (<10ms) y gestión comercial en tiempo real.

---

## 🛠️ Stack Tecnológico de Producción

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19).
- **Estilos & UI**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide Icons](https://lucide.dev/), tipografía Satoshi.
- **Backend & Base de Datos**: [Firebase Cloud Firestore](https://firebase.google.com/), Firebase Storage, Firebase Admin SDK.
- **Motor de Automatización**: [n8n](https://n8n.io/) (Open Source / Self-hosted) conectado vía Webhooks.
- **Mensajería & Notificaciones**: WhatsApp Business Cloud API, Resend (Email Transaccional).
- **Infraestructura DNS & Hosting**: Vercel Edge Network + Hostinger DNS (correos `@solderio.cl` preservados).

---

## 🗺️ Mapa de Rutas de la Aplicación

### 🌐 Soluciones Públicas
- **`/`**: Landing Page Principal (Hero interactivo, ecosistema, hardware Tier 1, calculadora rápida).
- **`/hogar`**: Soluciones residenciales, parcelas, respaldo anti-cortes de luz y monitoreo en tiempo real.
- **`/empresas`**: Plantas fotovoltaicas C&I, reducción de OPEX, tarifas punta y PPA sin inversión.
- **`/carga-ev`**: Infraestructura de electromovilidad y cargadores inteligentes Wallbox (TE-6 SEC).
- **`/porque-solar`**: Simulador técnico, comparativa de mitos vs realidades y marco regulatorio.
- **`/garantia`**: Respaldo integral de 25 años en generación fotovoltaica y 10 años en baterías LiFePO4.
- **`/acerca-de`**: Manifiesto de ingeniería, equipo fundador y compromiso con el sur.

### ⚡ Embudo Comercial & Recursos
- **`/cotizacion`**: Cotizador Solar Inteligente de 5 pasos con cálculo dinámico de potencia (kWp), almacenamiento LiFePO4 (kWh), ahorro anual y subida de boleta.
- **`/incentivos`**: Ley Net Billing 21.118, Depreciación Instantánea 100% (SII) y Fondos Concursables.
- **`/seguros`**: Coberturas contra temporales (>140 km/h), granizo, ramas, sismos y lucro cesante.
- **`/aprender`**: Guía interactiva *¿Cómo leer tu boleta Saesa/Crell/CGE?* y glosario de ingeniería.
- **`/preguntas-frecuentes`**: FAQ Hub interactivo con buscador reactivo y filtros por categoría.
- **`/trabaja-con-nosotros`**: Portal de atracción de talento para ingenieros SEC y técnicos montajistas.
- **`/blog`**: Hub editorial y casos de estudio reales en Puerto Varas, Osorno y Valdivia.
- **`/politicas-de-privacidad` & `/terminos`**: Resguardo legal bajo la Ley 19.628.

### 💼 Panel de Gestión Interno
- **`/admin`**: Dashboard CRM con KPIs de pipeline (kWp), estado de cotizaciones y contacto rápido por WhatsApp.

---

## 🚀 Inicio Rápido en Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/jmarriagada/solderio-web.git
cd solderio-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Compilación para Producción

```bash
npm run build
```

---

## 📄 Licencia

© 2026 SoldeRío SpA. Todos los derechos reservados.
