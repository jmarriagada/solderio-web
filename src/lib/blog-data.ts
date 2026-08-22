export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Casos Reales" | "Normativa SEC" | "Tecnología BESS" | "Economía & ROI";
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  content: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "caso-exito-planta-hibrida-puerto-varas-resiliencia",
    title: "Caso de Éxito: Planta Solar Híbrida de 10 kWp en Puerto Varas con Cero Cortes de Luz",
    excerpt: "Analizamos el rendimiento real de una residencia en Puerto Varas durante los temporales de invierno 2025: 85% de ahorro en boleta Saesa y suministro ininterrumpido ante 4 caídas de la red pública.",
    category: "Casos Reales",
    date: "14 Febrero 2026",
    readTime: "6 min de lectura",
    author: {
      name: "Ing. Jorge Matías",
      role: "Director de Ingeniería SEC",
      avatar: "/logos/logo-solderio-lightmode.svg",
    },
    image: "/images/planta-solar-residencial-sur-chile-solderio2.jpeg",
    tags: ["Puerto Varas", "Planta Híbrida", "Baterías LiFePO4", "Resiliencia Saesa"],
    content: `
## Introducción al Proyecto

Ubicada en una parcelación rural en las afueras de **Puerto Varas, Región de Los Lagos**, esta residencia familiar enfrentaba dos grandes desafíos:
1. **Cuentas eléctricas elevadas** debido al uso intensivo de bombas de calor para climatización y bombeo de pozo profundo.
2. **Cortes de suministro recurrentes** durante los temporales invernales, con caídas de poste que dejaban a la propiedad sin electricidad durante 12 a 36 horas continuas.

---

## Solución de Ingeniería Implementada

El equipo de SoldeRío diseñó una **Planta Solar Híbrida Llave en Mano** con los siguientes componentes de clase mundial:
- **Arreglo Fotovoltaico**: 18 módulos monocristalinos N-Type TOPCon de 580W (Potencia peak total: 10.44 kWp).
- **Inversor Híbrido Inteligente**: Inversor trifásico con conmutación estática STS menor a 10ms y protecciones AFCI asistidas por IA.
- **Almacenamiento BESS**: Banco de baterías de litio LiFePO4 de 15 kWh de capacidad neta con BMS celda a celda.
- **Trámite Regulatorio**: Certificado SEC TE-1 y TE-4 bajo Ley Net Billing 21.118 ante Saesa.

---

## Resultados Medidos en 12 Meses

| Indicador Técnico / Económico | Antes de SoldeRío | Con Planta Solar SoldeRío |
| :--- | :--- | :--- |
| **Gasto Eléctrico Anual** | $2.840.000 CLP | **$410.000 CLP** (85.5% de ahorro) |
| **Horas Sin Suministro Eléctrico** | ~74 horas / año | **0 horas (100% de continuidad)** |
| **Autoconsumo Solar Directo** | 0% | **92% en primavera-verano** |
| **Inyecciones Net Billing a Red** | 0 kWh | **+3.420 kWh inyectados a Saesa** |

---

## Conclusión

El sistema no solo amortiza su inversión en un periodo proyectado de 5.2 años, sino que entregó total tranquilidad a la familia al mantener la calefacción, internet y refrigeración 100% operativas durante los mayores temporales del año en el sur de Chile.
    `,
  },
  {
    slug: "guia-ley-netbilling-21118-inyeccion-excedentes-chile",
    title: "Guía Definitiva de la Ley Net Billing 21.118: Cómo Vender tu Energía a Saesa y Crell",
    excerpt: "Todo lo que necesitas saber sobre la valorización de kWh, el medidor bidireccional, los pliegos técnicos RIC de la SEC y cómo cobrar tus saldos a favor.",
    category: "Normativa SEC",
    date: "28 Enero 2026",
    readTime: "8 min de lectura",
    author: {
      name: "Equipo Regulatorio SoldeRío",
      role: "Especialistas SEC & Net Billing",
      avatar: "/logos/logo-solderio-lightmode.svg",
    },
    image: "/images/solderio-ingeniero-electrico.jpg",
    tags: ["Ley 21.118", "Net Billing", "SEC Chile", "Saesa", "Crell"],
    content: `
## ¿Qué es la Ley Net Billing 21.118?

La **Ley N° 21.118** (que modernizó la Ley 20.571 de Generación Distribuida) establece el derecho formal de todos los usuarios residenciales, comerciales e industriales de Chile a instalar plantas solares de hasta **300 kW de potencia** para generar su propia electricidad e inyectar los excedentes no consumidos a la red eléctrica pública.

---

## ¿A qué precio te compra la energía la distribuidora?

A diferencia de sistemas antiguos de "trueque 1 a 1", la ley chilena valoriza el kWh inyectado al **precio de nudo de energía** más las pérdidas evitadas de transmisión. En términos prácticos, si compras electricidad a Saesa a ~$160 CLP/kWh, la empresa te valorizará tus inyecciones solares a aproximadamente ~$95 - $110 CLP/kWh.

### ¿Cómo se refleja en tu boleta?
1. Tu medidor inteligente registra en el Canal 1 la energía extraída de la red.
2. En el Canal 2 registra la energía inyectada desde tus paneles.
3. La distribuidora multiplica los kWh inyectados por la tarifa de compra y aplica un **descuento directo en pesos** sobre el total de tu boleta.

---

## Requisitos Obligatorios para Habilitar el Beneficio

Para que la distribuidora active el descuento legal en tu boleta, la planta debe contar con:
- Memoria de cálculo y planos unilineales firmados por **Ingeniero Eléctrico SEC Clase A**.
- Inversores con protección Anti-Isla bajo **Pliego RIC N°15**.
- Certificado oficial **TE-4 (Generación Distribuida)** emitido por la Superintendencia de Electricidad y Combustibles.
    `,
  },
  {
    slug: "baterias-lifepo4-vs-litio-convencional-clima-frio-sur",
    title: "¿Por Qué Usamos Baterías LiFePO4 en el Sur? Comparativa de Seguridad y Ciclos",
    excerpt: "Descubre por qué la química de Fosfato de Hierro y Litio (LiFePO4) es la única recomendada para climas fríos y húmedos, superando por 3x la vida útil de baterías tradicionales.",
    category: "Tecnología BESS",
    date: "10 Enero 2026",
    readTime: "5 min de lectura",
    author: {
      name: "Ing. Jorge Matías",
      role: "Director de Ingeniería SEC",
      avatar: "/logos/logo-solderio-lightmode.svg",
    },
    image: "/images/inverter-sun2000-5-6-8-10-12k-map0.png",
    tags: ["LiFePO4", "Baterías Litio", "BESS", "Seguridad Eléctrica"],
    content: `
## La Química Detrás del Almacenamiento Solar Seguro

En los proyectos fotovoltaicos residenciales y comerciales de SoldeRío en el sur de Chile, la elección del almacenamiento energético es fundamental. Tras años de evaluación en terreno, instalamos exclusivamente bancos de **Baterías LiFePO4 (Fosfato de Hierro y Litio)**.

---

## 4 Ventajas Decisivas de LiFePO4

### 1. Cero Riesgo de Fuego (Embalamiento Térmico Imposible)
A diferencia del óxido de cobalto (NMC) usado en smartphones o autos eléctricos, el enlace químico fósforo-oxígeno de las celdas LiFePO4 es extraordinariamente fuerte. Incluso ante sobrecargas, cortocircuitos o perforación mecánica, no libera oxígeno y no puede incendiarse.

### 2. +6.000 Ciclos de Vida (+15 Años)
Una batería de plomo-ácido tradicional dura entre 500 y 1.000 ciclos (2 a 3 años). Una batería LiFePO4 con BMS inteligente supera los **6.000 ciclos de descarga al 90% (DoD)**, garantizando más de 15 años de operación continua diaria.

### 3. Comportamiento en Invierno y Bajas Temperaturas
En ciudades como Osorno, Valdivia o Coyhaique, donde las temperaturas invernales caen bajo cero, las baterías LiFePO4 mantienen su eficiencia interna y cuentan con sistemas de autocalentamiento gestionados por el BMS para proteger la vida útil de las celdas.
    `,
  },
  {
    slug: "depreciacion-instantanea-paneles-solares-empresas-chile",
    title: "Cómo Deducir el 100% de tu Planta Solar en Impuestos con la Franquicia SII",
    excerpt: "Estrategia tributaria para gerentes y directores de empresas: recupera el 27% de la inversión vía Impuesto de Primera Categoría y el 19% de IVA en el primer año.",
    category: "Economía & ROI",
    date: "18 Diciembre 2025",
    readTime: "7 min de lectura",
    author: {
      name: "Equipo Comercial & Financiero",
      role: "Consultoría Energética SoldeRío",
      avatar: "/logos/logo-solderio-lightmode.svg",
    },
    image: "/images/solderio-planta-solar-residencial-sur.png",
    tags: ["Impuestos", "Depreciación Instantánea", "Pymes", "Empresas C&I"],
    content: `
## Escudo Fiscal para Empresas de la Macrozona Sur

La inversión en plantas solares fotovoltaicas es hoy uno de los activos con mayor beneficio tributario en la legislación chilena. La **Ley de Modernización Tributaria** permite a las empresas de Primera Categoría acogerse a la **Depreciación Instantánea del 100%**.

---

## Mecánica Financiera de la Inversión

### Paso 1: Gasto Tributario en el Año 1
Al adquirir una planta solar comercial de, por ejemplo, $50.000.000 CLP netos, la empresa imputa el 100% del valor como gasto en el mismo ejercicio comercial. Con una tasa de impuesto corporativo del 27%, la empresa ahorra de forma líquida **$13.500.000 CLP** en su declaración de renta anual (Formulario 22).

### Paso 2: Recuperación de IVA Crédito Fiscal
Los $9.500.000 CLP de IVA pagados en la factura de compra se recuperan íntegramente compensándolos contra el IVA de las ventas mensuales o mediante solicitud formal de devolución de IVA exportador/activo fijo (Art. 27 bis).

### Paso 3: Retorno Real del Capital
Sumando el ahorro tributario de renta + la recuperación de IVA + el ahorro mensual de electricidad en la boleta, el periodo de retorno de inversión (Payback) para empresas en el sur de Chile baja a un rango promedio de **3.2 a 4.5 años**.
    `,
  },
];
