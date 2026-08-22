export const BRAND = {
  name: "SoldeRío",
  fullName: "SoldeRío Energía Inteligente",
  tagline: "Energía inteligente, ingeniería confiable.",
  motto: "Evalúa energía solar desde tu boleta y avanza con respaldo técnico.",
  description:
    "Democratizamos el acceso a la energía solar inteligente en el sur de Chile con proyectos fotovoltaicos llave en mano respaldados por ingeniería SEC Clase A y monitoreo 24/7.",
  region: "Macrozona Sur de Chile (Los Ríos, Los Lagos y La Araucanía)",
  contact: {
    email: "contacto@solderio.cl",
    phone: "+56 9 8765 4321",
    address: "Valdivia, Región de Los Ríos, Chile",
    hours: "Lun - Vie: 09:00 - 18:30 hrs",
  },
  social: {
    linkedin: "https://linkedin.com/company/solderio",
    instagram: "https://instagram.com/solderio.cl",
    whatsapp: "https://wa.me/56987654321",
  },
  colors: {
    background: "#F1F1F1", // White
    foreground: "#1F1F1F", // Charcoal
    accent: "#FF8300",     // Solar Orange
    surface: "#F7F8FA",    // Mist
    muted: "#6B7280",      // Slate
    border: "#D9DEE7",     // Silver
  },
};

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Hogar", href: "/hogar" },
  { label: "Empresas", href: "/empresas" },
  { label: "Carga EV", href: "/carga-ev" },
  { label: "Descubre", href: "#descubre" },
];

export const DESCUBRE_MENU = {
  empresa: {
    title: "EMPRESA",
    links: [
      { label: "Acerca de", href: "/acerca-de" },
      { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Agendar consulta", href: "/cotizacion" },
    ],
  },
  solar: {
    title: "SOLAR",
    links: [
      { label: "Porqué Solar", href: "/porque-solar" },
      { label: "O&M", href: "/empresas" },
      { label: "Tecnología", href: "/carga-ev" },
      { label: "Nuestra garantía", href: "/garantia" },
    ],
  },
  recursos: {
    title: "RECURSOS",
    links: [
      { label: "Incentivos", href: "/incentivos" },
      { label: "Seguros", href: "/seguros" },
      { label: "Aprender", href: "/aprender" },
      { label: "Blog & Noticias", href: "/blog" },
    ],
  },
};

export const HERO_CONTENT = {
  badge: "SoldeRío",
  title: "Soberanía Energética",
  sub: "",
  ctaPrimary: "Obtener una Cotización Solar",
  ctaSecondary: "Hablar con ventas",
  stats: [],
};

export const INTRO_CONTENT = {
  eyebrow: "La Solución SoldeRío",
  title: "Ingeniería de terreno combinada con inteligencia digital",
  description:
    "No somos simples instaladores de kits genéricos. SoldeRío integra ingeniería eléctrica de alto estándar con software de monitoreo en tiempo real para transformar la radiación solar en un activo digital transparente y rentable para tu propiedad.",
};

export const HOW_IT_WORKS_CARDS = [
  {
    id: "captacion",
    step: "01",
    tag: "Captación Solar Premium",
    title: "Módulos Fotovoltaicos de Alta Eficiencia",
    description:
      "Tus paneles capturan la radiación solar incidente incluso en días con nubosidad parcial, convirtiéndola en energía eléctrica continua (DC) con un perfil arquitectónico estético y de bajo impacto.",
    image:
      "https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Paneles Tier 1 Monocristalinos PERC/TOPCon", "Resistencia a alta humedad y vientos del sur", "Garantía de generación por 25 años"],
  },
  {
    id: "conversion",
    step: "02",
    tag: "Conversión Inteligente",
    title: "Inversor y Gestión Digital de Energía",
    description:
      "El inversor inteligente convierte la energía continua en corriente alterna (AC) con eficiencia superior al 97.5%, adaptándola de forma transparente para el consumo inmediato de todos tus electrodomésticos o procesos industriales.",
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Optimización inteligente por cadena", "Monitoreo remoto vía App Móvil 24/7", "Protecciones eléctricas de grado industrial"],
  },
  {
    id: "ahorro",
    step: "03",
    tag: "Ahorro y Almacenamiento",
    title: "Autoconsumo, Inyección Net-Billing y Baterías",
    description:
      "Alimenta tu propiedad con energía 100% limpia. El excedente no utilizado se inyecta a la red eléctrica pública mediante Net-Billing o se almacena en baterías de litio para respaldo nocturno y emergencias.",
    image:
      "https://images.unsplash.com/photo-1542332213-315a50fd9736?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Reducción drástica del gasto en electricidad", "Respaldo continuo ante cortes de luz", "Retorno de inversión transparente"],
  },
];

export const FEATURES_GRID = [
  {
    icon: "ShieldCheck",
    title: "Paneles Tier 1 Premium",
    description:
      "Módulos fotovoltaicos con tecnología de vanguardia, resistencia comprobada a nieve, lluvia y vientos fuertes, y arquitectura estética sobre techo.",
  },
  {
    icon: "Cpu",
    title: "Inversor Inteligente 97.5%+",
    description:
      "Inversores de alta gama con eficiencia superior, actualización de firmware vía OTA y protección avanzada de sobretensión.",
  },
  {
    icon: "BatteryCharging",
    title: "Almacenamiento en Baterías",
    description:
      "Sistemas opcionales con baterías de Litio LiFePO4 para independencia energética total y resiliencia frente a interrupciones del suministro.",
  },
  {
    icon: "Activity",
    title: "Monitoreo Digital 24/7",
    description:
      "Aplicación intuitiva para visualizar en tiempo real tu generación solar, tu autoconsumo, inyección a la red y ahorro acumulado.",
  },
  {
    icon: "Award",
    title: "Certificación SEC Clase A",
    description:
      "Ingeniería supervisada directamente por ingenieros eléctricos certificados SEC Clase A, garantizando cumplimiento legal y máxima seguridad.",
  },
  {
    icon: "Wrench",
    title: "Instalación Llave en Mano",
    description:
      "Nos encargamos de todo el proceso: desde la evaluación fotométrica y diseño en OpenSolar hasta el montaje, trámites TE1 y puesta en marcha.",
  },
];

export const PROCESS_TIMELINE = [
  {
    step: "01",
    title: "Evaluación desde tu Boleta",
    subtitle: "Technical Discovery",
    description:
      "Analizamos tu boleta de luz actual para determinar tu perfil de consumo, potencial de radiación solar en tu ubicación y viabilidad económica real.",
    time: "Día 1",
  },
  {
    step: "02",
    title: "Diseño e Ingeniería",
    subtitle: "Simulación OpenSolar / SAM",
    description:
      "Modelamos la planta fotovoltaica en 3D ajustada a la inclinación y sombra de tu techado, dimensionando equipos exactos para maximizar tu LCOE.",
    time: "Días 2 - 4",
  },
  {
    step: "03",
    title: "Instalación Certificada",
    subtitle: "Ejecución de Terreno",
    description:
      "Nuestro equipo técnico especializado realiza el montaje de estructuras, paneles, tableros de protección e inversores en un plazo de 1 a 3 días.",
    time: "Días 5 - 7",
  },
  {
    step: "04",
    title: "Certificación SEC y Puesta en Marcha",
    subtitle: "Tramitación TE1 & Monitoreo",
    description:
      "Gestionamos la declaración de la instalación en la SEC (TE1), la conexión Net-Billing con la distribuidora local y la configuración de tu App de monitoreo.",
    time: "Puesta en servicio",
  },
];

export const TECHNICAL_SPECS = [
  { category: "Potencia por Módulo", value: "415W – 580W (Tier 1 Monocristalino)" },
  { category: "Eficiencia del Panel", value: "21.2% – 22.8%" },
  { category: "Eficiencia del Inversor", value: "97.5% – 98.6% Euro Efficiency" },
  { category: "Garantía de Producto (Paneles)", value: "12 Años" },
  { category: "Garantía de Generación", value: "25 Años al 84.8% de capacidad" },
  { category: "Garantía de Inversor", value: "10 Años extendible a 20 años" },
  { category: "Garantía de Instalación", value: "10 Años por SoldeRío" },
  { category: "Certificación Eléctrica", value: "Norma SEC NCh 4/2003 y RIC N°08" },
  { category: "Capacidad de Baterías (Opcional)", value: "Desde 5.0 kWh hasta 30+ kWh (LiFePO4)" },
  { category: "Monitoreo Remoto", value: "WiFi / 4G con Telemetría cada 5 minutos" },
];

export const SUSTAINABILITY_STATS = [
  { value: "4.2", unit: "toneladas", label: "CO₂ evitado por año en un hogar promedio" },
  { value: "180", unit: "árboles", label: "Equivalente en árboles plantados anualmente" },
  { value: "25+", unit: "años", label: "De energía limpia e independencia energética" },
  { value: "100%", unit: "renovable", label: "Contribución a la transición verde del sur" },
];

export const TESTIMONIALS = [
  {
    quote:
      "SoldeRío evaluó nuestra boleta de luz y diseñó un sistema perfecto para nuestro hogar en Valdivia. Pasamos de pagar $140.000 mensuales a tener saldos a favor con Net-Billing. La instalación fue impecable.",
    author: "Matías Loyola",
    role: "Cliente Residencial",
    location: "Valdivia, Región de Los Ríos",
    system: "Sistema Fotovoltaico 5.4 kWp",
    rating: 5,
  },
  {
    quote:
      "Como empresa agroindustrial en Osorno, reducir costos fijos era clave. El equipo de SoldeRío coordinó la certificación SEC sin interrumpir nuestras operaciones. El monitoreo en tiempo real es excelente.",
    author: "Carolina Schmidt",
    role: "Gerente de Operaciones, Agrícola del Sur",
    location: "Osorno, Región de Los Lagos",
    system: "Planta Solar C&I 30 kWp",
    rating: 5,
  },
  {
    quote:
      "Buscábamos respaldo ante los continuos cortes de luz del invierno. Nos instalaron un sistema híbrido con baterías de litio. Ahora tenemos luz continua y ahorramos en el consumo diario.",
    author: "Roberto Morales",
    role: "Propietario",
    location: "Pucón, Región de La Araucanía",
    system: "Sistema Híbrido 8.2 kWp + Batería 10kWh",
    rating: 5,
  },
];

export const ABOUT_CONTENT = {
  eyebrow: "Sobre SoldeRío",
  title: "El partner tecnológico de tu transición energética",
  text1:
    "SoldeRío nace en la Macrozona Sur de Chile para resolver el problema de la energía con rigurosidad técnica y visión de largo plazo. Combinamos la experiencia de más de 30 años en ingeniería eléctrica e instalaciones de alta complejidad con una cultura nativa digital y enfocada en software.",
  text2:
    "Creemos que la energía solar debe evaluarse con datos transparentes, no con promesas genéricas. Cada proyecto que desarrollamos está respaldado por cálculos fotométricos de ingeniería, certificación SEC Clase A y un acompañamiento continuo.",
  founders: [
    {
      name: "Jorge Arriagada",
      role: "Co-Fundador & CEO",
      bio: "Ingeniero Comercial con más de 10 años en la industria solar fotovoltaica. Ex-CMO/CCO en SUNAI (software O&M para plantas solares en 7 países). Experto en Energy-as-a-Service.",
    },
    {
      name: "Marcos Rojas",
      role: "Co-Fundador & COO/CTO",
      bio: "Ingeniero Eléctrico con Certificación SEC Clase A y más de 30 años de trayectoria. Fundador de MR Ingeniería Eléctrica, experto en media/baja tensión y sistemas complejos.",
    },
  ],
  marqueeValues: [
    "Ingeniería SEC Clase A",
    "•",
    "Transparencia de Datos",
    "•",
    "Monitoreo 24/7",
    "•",
    "Garantía 25 Años",
    "•",
    "Net-Billing Chile",
    "•",
    "Energía Limpia",
    "•",
    "Macrozona Sur",
    "•",
  ],
};

export const EV_CHARGER_DATA = {
  hero: {
    badge: "SoldeRío Movilidad Eléctrica",
    title: "Cargadores Inteligentes EV",
    subtitle: "Conduce con la energía del sol",
    description:
      "Integra la recarga de tu vehículo eléctrico con tu planta solar. Carga dinámica con excedentes fotovoltaicos, balanceo de potencia anti-sobrecargas y certificación SEC TE-6 bajo el Pliego RIC N°15.",
    ctaPrimary: "Cotizar Cargador EV",
    ctaSecondary: "Hablar con un Ingeniero",
  },
  highlights: [
    {
      id: "pv-preferred",
      title: "Prioridad Solar (PV Preferred)",
      tagline: "Carga 100% fotovoltaica con excedentes",
      description:
        "Aprovecha al máximo cada watt generado por tus paneles solares. El cargador conmuta automáticamente de trifásico a monofásico para iniciar la carga desde solo 1.4 kW de excedente solar.",
      badge: "Desde 1.4 kW Solar",
    },
    {
      id: "dynamic-balancing",
      title: "Balanceo Dinámico de Carga",
      tagline: "Protección total contra sobrecargas",
      description:
        "Ajusta dinámicamente la potencia de carga según el consumo instantáneo de la casa o empresa e irradiancia solar, evitando la caída del automático general.",
      badge: "Cero Caídas de Térmico",
    },
    {
      id: "auth-modes",
      title: "3 Métodos de Autenticación",
      tagline: "Control total y acceso flexible",
      description:
        "Inicia y detiene la carga con tu App móvil FusionSolar/SoldeRío, tarjetas RFID sin contacto o conexión directa por Bluetooth. Autoriza a familiares o colaboradores con facilidad.",
      badge: "App • RFID • Bluetooth",
    },
    {
      id: "weather-protection",
      title: "Protección IP54 & RCD DC 6mA",
      tagline: "Diseñado para el clima del sur",
      description:
        "Gabinete sellado resistente a lluvia y polvo (IP54). Protección de fuga residual integrada Tipo A + DC 6mA y supresión de sobretensiones para máxima seguridad.",
      badge: "Norma SEC RIC N°15",
    },
  ],
  models: [
    {
      name: "SCharger-7KS-S0",
      type: "Monofásico Residencial",
      power: "Hasta 7.4 kW / 32A",
      voltage: "230 VAC ± 20%",
      connector: "Socket Tipo 2 (Mennekes) con obturador",
      modes: "Modo Rápido / Prioridad Solar / Programado",
      connectivity: "WiFi, Ethernet, Bluetooth, Modbus TCP",
      protection: "IP54, IK10, RCD Tipo A + DC 6mA, OVP/UVP/OCP",
      dimensions: "335 × 180 × 145 mm (3.0 kg)",
      secCert: "Declaración SEC TE-6 / RIC N°15",
      recommendedFor: "Hogares, parcelas y empalmes monofásicos de 25A a 40A",
    },
    {
      name: "SCharger-22KT-S0",
      type: "Trifásico Residencial / C&I",
      power: "Hasta 22 kW / 32A (3F) o 7.4 kW (1F)",
      voltage: "400 VAC ± 20% (3F) / 230 VAC (1F)",
      connector: "Socket Tipo 2 (Mennekes) con obturador",
      modes: "Modo Rápido / Prioridad Solar / Conmutación 1F-3F",
      connectivity: "WiFi, Ethernet, Bluetooth, 4G opcional, Modbus",
      protection: "IP54, IK10, RCD Tipo A + DC 6mA, Gestión Térmica",
      dimensions: "335 × 180 × 145 mm (3.1 kg)",
      secCert: "Declaración SEC TE-6 / RIC N°15",
      recommendedFor: "Empresas, condominios, flotas y casas con empalme trifásico",
    },
  ],
  modesComparison: [
    {
      mode: "☀️ 100% Solar Verde",
      source: "Excedentes fotovoltaicos",
      costPerKm: "$0 / km",
      speed: "1.4 kW a 7.4/22 kW dinámico",
      description: "Recarga tu auto exclusivamente con la energía limpia de tus paneles solares. Costo de combustible virtualmente cero.",
    },
    {
      mode: "⚡ Carga Rápida Máxima",
      source: "Solar + Red eléctrica combinada",
      costPerKm: "~$25 - $35 / km (vs $120+ en bencina)",
      speed: "Potencia máxima (7.4 kW o 22 kW)",
      description: "Carga la batería al 100% en el menor tiempo posible combinando la generación solar con la red local.",
    },
    {
      mode: "🌙 Carga Nocturna Programada",
      source: "Red en horario valle o Batería LUNA2000",
      costPerKm: "~$18 - $24 / km",
      speed: "Potencia programable",
      description: "Automatiza la recarga durante la noche para despertar cada día con la batería al 100% al menor costo tarifario.",
    },
  ],
};

export const ACERCA_DE_DATA = {
  hero: {
    badge: "Nuestra Historia & Propósito",
    title: "Por Qué SoldeRío",
    subtitle: "Ingeniería del Sur, Compromiso de Largo Plazo",
    description:
      "Nacimos en la Macrozona Sur para transformar la radiación solar en soberanía energética real. Combinamos más de 30 años de experiencia en ingeniería eléctrica de potencia con tecnología de software y monitoreo continuo 24/7.",
  },
  manifesto: {
    motto: "Energía inteligente, ingeniería confiable.",
    mission:
      "Democratizar el acceso a la energía solar fotovoltaica y almacenamiento inteligente en el sur de Chile, entregando proyectos llave en mano con el más alto rigor de ingeniería SEC Clase A y transparencia total en los datos.",
    vision:
      "Ser el partner tecnológico y energético de referencia en el sur del país, liderando la descentralización de la matriz energética con sistemas seguros, resilientes y diseñados para perdurar por décadas.",
    pillars: [
      {
        title: "Rigor Técnico Innegociable",
        description: "Cada planta es calculada con simulaciones 3D (OpenSolar/SAM) y supervisada por ingenieros eléctricos SEC Clase A.",
      },
      {
        title: "Transparencia de Datos",
        description: "Evaluamos tu potencial solar real desde tu boleta de luz, sin falsas promesas ni sobrestimaciones de ahorro.",
      },
      {
        title: "ADN del Sur de Chile",
        description: "Equipos y fijaciones seleccionados específicamente para soportar lluvia, vientos fuertes y radiación difusa.",
      },
      {
        title: "Acompañamiento Continuo",
        description: "Telemetría en tiempo real y soporte postventa permanente para que tu planta opere siempre en su punto óptimo.",
      },
    ],
  },
  whyUsComparison: [
    {
      feature: "Diseño e Ingeniería de Planta",
      solderio: "Simulación 3D personalizada (OpenSolar/SAM) según sombras e inclinación real de tu techo.",
      traditional: "Kits fotovoltaicos genéricos sin análisis fotométrico ni dimensionamiento de conductores.",
    },
    {
      feature: "Firma y Certificación SEC",
      solderio: "Ingenieros Eléctricos SEC Clase A propios con tramitaciones formales TE-1, TE-4 y TE-6.",
      traditional: "Subcontratación de firmas externas sin responsabilidad técnica ni seguimiento en terreno.",
    },
    {
      feature: "Monitoreo y Postventa",
      solderio: "Telemetría IoT 24/7 con alertas predictivas y soporte técnico directo en la Macrozona Sur.",
      traditional: "Instalación y abandono. Cero visibilidad de rendimiento ni soporte ante fallas del sistema.",
    },
    {
      feature: "Equipamiento y Garantías",
      solderio: "Módulos Tier 1 Monocristalinos N-Type e inversores Huawei con garantía de generación por 25 años.",
      traditional: "Paneles de marcas no reconocidas o sin representación técnica oficial en Chile.",
    },
    {
      feature: "Respaldo ante Emergencias",
      solderio: "Sistemas híbridos con baterías LiFePO4 para autonomía total frente a cortes de red en invierno.",
      traditional: "Inversores on-grid estándar que se apagan por completo cuando se corta la luz de la calle.",
    },
  ],
  founders: [
    {
      name: "Jorge Arriagada",
      role: "Co-Fundador & CEO",
      tagline: "Estrategia, EaaS & Software Solar",
      bio: "Ingeniero Comercial con más de 10 años de liderazgo en la industria de energías renovables. Ex-CMO/CCO en SUNAI (software de monitoreo y O&M para plantas solares en 7 países de Latinoamérica y Europa). Especialista en modelos Energy-as-a-Service, experiencia de usuario y digitalización energética.",
      image: "/images/planta-solar-residencial-valdivia.png",
    },
    {
      name: "Marcos Rojas",
      role: "Co-Fundador & CTO/COO",
      tagline: "Ingeniería de Potencia & Certificación SEC Clase A",
      bio: "Ingeniero Eléctrico con Certificación SEC Clase A y más de 30 años de trayectoria en el sector eléctrico. Fundador de MR Ingeniería Eléctrica, ha diseñado y ejecutado proyectos de media y baja tensión, subestaciones, tableros industriales y plantas de generación de alta complejidad en Chile.",
      image: "/images/planta-solar-empresas-solderio.jpeg",
    },
  ],
  faqs: [
    {
      question: "¿Por qué SoldeRío es diferente a un instalador solar tradicional?",
      answer:
        "No somos meros vendedores de paneles. En SoldeRío fusionamos la ingeniería eléctrica senior (SEC Clase A con 30+ años de experiencia) con software de monitoreo en tiempo real. Realizamos la ingeniería de detalle a la medida de tu boleta y clima local, gestionamos los trámites SEC de principio a fin y te acompañamos durante toda la vida útil de la planta.",
    },
    {
      question: "¿Qué pasa con mis garantías si una empresa instaladora quiebra?",
      answer:
        "En SoldeRío trabajamos exclusivamente con marcas Tier 1 globales (como Huawei, Canadian Solar, LONGi) cuyas garantías de producto (12-15 años) y generación (25 años) son respaldadas directamente por el fabricante y sus representantes oficiales en Chile. Además, entregamos memoria técnica y certificados SEC TE-1/TE-4 para que cualquier técnico certificado pueda operar tu planta sin perder garantías.",
    },
    {
      question: "¿Es realmente rentable la energía solar en el sur de Chile con tanta lluvia?",
      answer:
        "Absolutamente. Los paneles solares modernos de alta eficiencia (N-Type TOPCon) generan energía con radiación difusa incluso en días nublados. En primavera y verano, el sur de Chile cuenta con hasta 15-16 horas diarias de luz solar. Con la ley Net Billing 21.118, los excedentes de verano generan saldos a tu favor en la boleta para compensar los meses de invierno.",
    },
  ],
};

export const PORQUE_SOLAR_DATA = {
  hero: {
    badge: "Energía Solar • El Futuro Hoy",
    title: "Por Qué Elegir Energía Solar",
    subtitle: "Protege tu Economía y Toma el Control de tu Energía",
    description:
      "Frente a las alzas históricas de las tarifas eléctricas en Chile y los cortes de red causados por temporales en el sur, la energía solar fotovoltaica te permite generar tu propia electricidad limpia, reducir hasta un 90% tu boleta y asegurar autonomía continua.",
  },
  pillars: [
    {
      icon: "TrendingDown",
      title: "Protección Contra Alzas Tarifarias",
      tag: "Ahorro Predecible",
      description:
        "Las tarifas eléctricas en Chile acumulan incrementos de más del 50% por el descongelamiento de tarifas. Al generar tu propia energía, fijas tu costo del kWh a costo marginal $0 por los próximos 25 años.",
    },
    {
      icon: "Zap",
      title: "Autonomía y Respaldo ante Cortes",
      tag: "Resiliencia 24/7",
      description:
        "En la Macrozona Sur, las tormentas y vientos provocan cortes de luz prolongados. Con sistemas híbridos y baterías LiFePO4, tu hogar o empresa sigue funcionando sin interrupciones ni ruidos de generadores.",
    },
    {
      icon: "Home",
      title: "Plusvalía y Sostenibilidad Real",
      tag: "Valor Patrimonial",
      description:
        "Una propiedad con planta solar certificada SEC aumenta su valor comercial de inmediato, reduce toneladas de emisiones de CO₂ y cumple con los más altos estándares de eficiencia energética moderna.",
    },
  ],
  netBilling: {
    title: "Cómo Funciona la Ley Net Billing 21.118 en Chile",
    subtitle: "Tus paneles generan, tu hogar consume y tus excedentes pagan tu boleta",
    steps: [
      {
        number: "01",
        title: "Autoconsumo Solar Directo",
        description: "Durante el día, la energía captada por los paneles alimenta directamente tus electrodomésticos, bombas de calor, luces y maquinaria.",
      },
      {
        number: "02",
        title: "Inyección de Excedentes a la Red",
        description: "Toda la energía solar que no consumes se inyecta automáticamente a la red eléctrica a través de un medidor bidireccional certificado.",
      },
      {
        number: "03",
        title: "Descuento en Boleta y Saldos a Favor",
        description: "La empresa distribuidora (Saesa, Crell, Frontel, CGE) valoriza tus kWh inyectados y los descuenta de tu boleta mensual. Los excedentes de verano cubren tu consumo en invierno.",
      },
      {
        number: "04",
        title: "Certificación SEC TE-4 Formal",
        description: "SoldeRío gestiona el 100% de la tramitación legal ante la SEC y la distribuidora para habilitar formalmente tu conexión Net Billing.",
      },
    ],
  },
  mythsVsFacts: [
    {
      myth: "«En el sur de Chile llueve demasiado y los paneles no funcionan.»",
      fact: "FALSO. Los paneles monocristalinos N-Type TOPCon de alta eficiencia captan la radiación difusa y siguen generando en días nublados o con lluvia suave. Además, en primavera y verano el sur tiene hasta 16 horas diarias de sol.",
    },
    {
      myth: "«Si se corta la luz de la red, los paneles me siguen dando energía automáticamente.»",
      fact: "DEPENDE DEL SISTEMA. Un inversor on-grid estándar se apaga por seguridad normativa SEC. Sin embargo, en SoldeRío instalamos sistemas híbridos con inversor inteligente y batería que activan el respaldo en milisegundos.",
    },
    {
      myth: "«Instalar paneles solares daña la techumbre o provoca goteras.»",
      fact: "FALSO. Utilizamos estructuras de montaje de ingeniería en aluminio anodizado con sellados de caucho EPDM y fijaciones estructurales no invasivas, garantizando 100% de estanqueidad sin filtraciones.",
    },
    {
      myth: "«La tramitación legal ante la SEC y la distribuidora es casi imposible de sacar.»",
      fact: "EN SOLDERÍO ES LLAVE EN MANO. Nuestros ingenieros eléctricos SEC Clase A se encargan de todo el proceso documental (TE-1, TE-4, TE-6 y contrato de conexión con la distribuidora). Tú solo disfrutas del ahorro.",
    },
  ],
  faqs: [
    {
      question: "¿Cuánto puedo ahorrar realmente en mi boleta de luz?",
      answer:
        "Dependiendo de tu perfil de consumo y la superficie de tu techumbre, una planta solar bien dimensionada reduce entre un 70% y un 90% el costo de tu boleta eléctrica mensual. El retorno de inversión (Payback) en el sur suele situarse entre los 5 y 7 años, con una vida útil superior a los 25 años.",
    },
    {
      question: "¿Qué mantenimiento requieren los paneles solares en el sur?",
      answer:
        "El mantenimiento es mínimo. En el sur de Chile, las lluvias periódicas limpian naturalmente el polvo y polen de los módulos. Solo se recomienda una inspección visual y limpieza profunda una o dos veces al año, además del monitoreo digital continuo desde nuestra app.",
    },
  ],
};

export const NUESTRA_GARANTIA_DATA = {
  hero: {
    badge: "Garantía Total SoldeRío • Respaldo por 25 Años",
    title: "Nuestra Garantía",
    subtitle: "Tu Inversión Solar 100% Protegida desde el Primer Día",
    description:
      "La energía solar es una inversión a 25 años y tu tranquilidad no puede depender de promesas vacías. Combinamos garantías de producto Tier 1, cobertura total de mano de obra y planes de O&M con monitoreo 24/7 para que tu planta opere siempre en su punto óptimo.",
  },
  protectionLevels: [
    {
      level: "Nivel 01",
      title: "Garantía de Rendimiento Solar (25 Años)",
      subtitle: "Módulos Tier 1 N-Type TOPCon",
      description:
        "Garantizamos por contrato una degradación anual inferior al 0.40%, asegurando que al año 25 tus paneles mantengan al menos el 84.8% de su potencia nominal original, respaldado directamente por fabricantes globales.",
      badge: "25 Años",
    },
    {
      level: "Nivel 02",
      title: "Garantía de Montaje & Estanqueidad (10 Años)",
      subtitle: "Cero Filtraciones en Techumbres",
      description:
        "Estructuras de aluminio anodizado calculadas para soportar vientos de 120+ km/h y sellados herméticos con caucho EPDM. Tu techo queda 100% protegido y libre de filtraciones de lluvia.",
      badge: "10 Años",
    },
    {
      level: "Nivel 03",
      title: "Gestión de Repuestos Express (RMA Inmediato)",
      subtitle: "Bodega Local en el Sur de Chile",
      description:
        "Mantenemos stock de recambio inmediato de inversores y módulos en Valdivia, Osorno y Puerto Varas. Si un componente falla, lo sustituimos de inmediato sin esperar semanas la respuesta de fábrica.",
      badge: "Stock Local",
    },
    {
      level: "Nivel 04",
      title: "Seguro SoldeRío & Continuidad Operativa",
      subtitle: "Protección Climática y Lucro Cesante",
      description:
        "Fondo de contingencia y pólizas contra siniestros graves (caída de árboles, temporales, granizo e incendio) e indemnización por energía no generada durante eventuales reparaciones.",
      badge: "Blindaje Total",
    },
  ],
  plans: [
    {
      id: "essential",
      name: "Essential Care",
      target: "Viviendas y Parcelas",
      price: "0.45 UF/mes",
      period: "($5.4 UF/año)",
      badge: "Básico",
      isFeatured: false,
      features: [
        "Monitoreo App SoldeRío con telemetría en vivo",
        "1 Visita técnica anual (limpieza + reapriete AC/DC)",
        "Diagnóstico de aislamiento DC e inspección visual",
        "Tiempo de respuesta ante fallas < 48 horas hábiles",
        "30% Descuento en mano de obra correctiva",
      ],
      ctaText: "Elegir Essential Care",
    },
    {
      id: "total-guard",
      name: "Total Guard («Seguro SoldeRío»)",
      target: "Parcelas Premium & Familias",
      price: "0.75 UF/mes",
      period: "($9.0 UF/año)",
      badge: "¡1er Año Incluido Gratis!",
      isFeatured: true,
      features: [
        "Todo lo incluido en Essential Care",
        "2 Limpiezas técnicas anuales con agua desmineralizada",
        "Termografía infrarroja de módulos (Norma IEC 62446-3)",
        "Mano de obra correctiva 100% CUBIERTA (Cero costo)",
        "Inversor de respaldo temporal en stock para swap inmediato",
        "Atención de emergencias < 24 horas (incluye fines de semana)",
        "Supervisión del banco de baterías LiFePO4",
      ],
      ctaText: "Incluido en tu Proyecto Solar",
    },
    {
      id: "industrial",
      name: "Industrial Performance",
      target: "Agrícola, Lecherías, Packing & C&I",
      price: "1.2% - 1.8%",
      period: "del CAPEX/año ($18-26 USD/kWp/año)",
      badge: "SLA Crítico <4h",
      isFeatured: false,
      features: [
        "Monitoreo SCADA / Telemetría IoT 24/7/365 en sala de control",
        "Garantía contractual de Performance Ratio (PR ≥ 80.0%)",
        "2 a 4 Visitas anuales con Dron Termográfico radiométrico",
        "Trazado semestral de curvas I-V (Norma IEC 62446-1)",
        "Mantenimiento integral de Transformadores MT/BT y BESS",
        "SLA Crítico < 4 horas para fallas de inyección mayor",
        "Informe ejecutivo mensual para auditorías y gerencia",
      ],
      ctaText: "Cotizar Plan Industrial",
    },
  ],
  mitigation: {
    title: "¿Qué Ocurre si una Empresa Instaladora Quiebra?",
    subtitle: "El 35% de los clientes en Chile quedan desamparados por EPCs informales. Así te blindamos en SoldeRío:",
    points: [
      {
        title: "1. Declaraciones SEC Definitivas a tu Nombre",
        desc: "Entregamos certificados TE-1 y TE-4 formalmente inscritos ante la SEC. Si alguna vez necesitas que otro técnico intervenga tu planta, todo está 100% en norma legal sin bloqueos.",
      },
      {
        title: "2. Garantías Directas de Fabricantes Globales Tier 1",
        desc: "Trabajamos solo con marcas con filial oficial en Chile (Huawei, Canadian Solar, Fronius). La garantía de 25 años sobrevive a cualquier empresa instaladora.",
      },
      {
        title: "3. Memoria Técnica y Planos As-Built Entregados",
        desc: "Recibes el dossier completo: diagramas unilineales, memoria de cálculo y fichas técnicas de cada componente instalado en tu techo.",
      },
      {
        title: "4. Servicio de O&M para Plantas Huérfanas de Terceros",
        desc: "Si tu instalador anterior desapareció y tu planta está botada o fallando, nuestro equipo SEC Clase A audita y rescata tu sistema.",
      },
    ],
  },
  monitoringSteps: [
    {
      step: "01",
      title: "Telemetría en Tiempo Real",
      desc: "Sensores IoT registran generación, consumo, voltaje y temperatura cada segundo.",
    },
    {
      step: "02",
      title: "Análisis de Performance Ratio",
      desc: "Comparamos la generación real contra la irradiancia satelital para detectar micro-mermas.",
    },
    {
      step: "03",
      title: "Alertas Predictivas",
      desc: "Detección automática de ensuciamiento, sombras inesperadas o anomalías en strings DC.",
    },
    {
      step: "04",
      title: "Respuesta Local Inmediata",
      desc: "Solución remota o despacho de técnicos desde nuestras bases en Valdivia, Osorno y Puerto Varas.",
    },
  ],
  faqs: [
    {
      question: "¿Por qué SoldeRío incluye 1 año gratis del plan Total Guard en todas sus instalaciones?",
      answer:
        "Porque creemos que la postventa no debe ser un costo oculto. Al regalar el primer año de Total Guard ('Seguro SoldeRío'), garantizamos que tu planta supere el periodo crítico de asentamiento con 2 limpiezas técnicas, termografía infrarroja y cobertura total de mano de obra sin que pagues un solo peso extra.",
    },
    {
      question: "¿Qué diferencia hay entre la garantía de producto del fabricante y la garantía de SoldeRío?",
      answer:
        "La garantía de fabricante cubre fallas internas del panel o inversor, pero no cubre el costo de que un técnico vaya a tu casa, desmonte el equipo, lo envíe a laboratorio ni revise las conexiones. La Garantía SoldeRío cubre la mano de obra, el reemplazo inmediato con equipo de bodega local y todo el trámite de RMA.",
    },
    {
      question: "¿Qué pasa si un temporal de viento o lluvia extrema daña mi techumbre?",
      answer:
        "Nuestras fijaciones están diseñadas bajo ingeniería eólica para 120+ km/h y selladas con caucho EPDM. Contamos con garantía de estanqueidad de 10 años para techumbres y respaldo de pólizas de daño material para cualquier siniestro de fuerza mayor.",
    },
    {
      question: "¿Puedo contratar el mantenimiento y garantía de SoldeRío si mi planta fue instalada por otra empresa?",
      answer:
        "Sí. A través de nuestro servicio de auditoría técnica y rescate de plantas solares, realizamos una inspección completa con cámara termográfica y megóhmetro para certificar tu planta e integrarla a nuestros planes de O&M con monitoreo 24/7.",
    },
  ],
};




