"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Check, ExternalLink, Layers } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (coords: { lat: number; lng: number; formatted: string }) => void;
  initialComuna?: string;
  initialRegion?: string;
  initialLat?: number | null;
  initialLng?: number | null;
}

// Coordenadas de referencia por comuna para centrado inicial
const COMUNA_COORDINATES: Record<string, [number, number]> = {
  // Los Lagos
  "Puerto Varas": [-41.3195, -72.9854],
  "Puerto Montt": [-41.4693, -72.9424],
  "Osorno": [-40.5739, -73.1335],
  "Frutillar": [-41.1278, -73.0475],
  "Llanquihue": [-41.2558, -73.0076],
  "Calbuco": [-41.7725, -73.1306],
  "Fresia": [-41.1542, -73.4258],
  "Los Muermos": [-41.4019, -73.4839],
  "Maullín": [-41.6167, -73.6000],
  "Cochamó": [-41.4939, -72.3083],
  "Ancud": [-41.8687, -73.8261],
  "Castro": [-42.4721, -73.7732],
  "Chonchi": [-42.6231, -73.7744],
  "Curaco de Vélez": [-42.4419, -73.6022],
  "Dalcahue": [-42.3789, -73.6528],
  "Puqueldón": [-42.5936, -73.6547],
  "Queilén": [-42.8906, -73.4739],
  "Quellón": [-43.1189, -73.6147],
  "Quemchi": [-42.1444, -73.4756],
  "Quinchao": [-42.4833, -73.5000],
  "Puerto Octay": [-40.9744, -72.8872],
  "Purranque": [-40.9167, -73.1667],
  "Puyehue": [-40.6833, -72.6000],
  "Río Negro": [-40.7892, -73.2147],
  "San Juan de la Costa": [-40.5167, -73.5333],
  "San Pablo": [-40.4000, -73.0167],
  "Chaitén": [-42.9167, -72.7083],
  "Futaleufú": [-43.1833, -71.8667],
  "Hualaihué": [-41.9833, -72.7333],
  "Palena": [-43.6167, -71.8000],

  // Los Ríos
  "Valdivia": [-39.8142, -73.2459],
  "Corral": [-39.8833, -73.4333],
  "Lanco": [-39.4500, -72.7833],
  "Los Lagos": [-39.8500, -72.8167],
  "Máfil": [-39.6500, -72.9500],
  "Mariquina": [-39.5167, -72.9667],
  "Paillaco": [-40.0667, -72.9000],
  "Panguipulli": [-39.6436, -72.3328],
  "La Unión": [-40.2922, -73.0817],
  "Futrono": [-40.1333, -72.4000],
  "Lago Ranco": [-40.3167, -72.5000],
  "Río Bueno": [-40.3333, -72.9667],

  // La Araucanía
  "Temuco": [-38.7359, -72.5904],
  "Padre Las Casas": [-38.7619, -72.5997],
  "Villarrica": [-39.2828, -72.2272],
  "Pucón": [-39.2778, -71.9753],
  "Angol": [-37.8000, -72.7167],
  "Carahue": [-38.7000, -73.1667],
  "Cholchol": [-38.6000, -72.8500],
  "Collipulli": [-37.9500, -72.4333],
  "Cunco": [-38.9333, -72.0333],
  "Curacautín": [-38.4333, -71.8833],
  "Curarrehue": [-39.3667, -71.5833],
  "Ercilla": [-38.0500, -72.4833],
  "Freire": [-38.9500, -72.6167],
  "Galvarino": [-38.4000, -72.7833],
  "Gorbea": [-39.1000, -72.6833],
  "Lautaro": [-38.5333, -72.4500],
  "Loncoche": [-39.3667, -72.6333],
  "Lonquimay": [-38.4500, -71.3667],
  "Los Sauces": [-37.9833, -72.8333],
  "Lumaco": [-38.1500, -72.9167],
  "Melipeuco": [-38.8500, -71.7000],
  "Nueva Imperial": [-38.7500, -72.9500],
  "Perquenco": [-38.4167, -72.3833],
  "Pitrufquén": [-38.9833, -72.6500],
  "Purén": [-38.0333, -73.0833],
  "Renaico": [-37.6667, -72.5833],
  "Saavedra": [-38.7833, -73.4000],
  "Teodoro Schmidt": [-39.0333, -73.0500],
  "Toltén": [-39.2167, -73.2167],
  "Traiguén": [-38.2500, -72.6833],
  "Victoria": [-38.2333, -72.3333],
  "Vilcún": [-38.6500, -72.2333],
};

const REGION_COORDINATES: Record<string, [number, number]> = {
  "Región de Los Lagos": [-41.4693, -72.9424],
  "Región de Los Ríos": [-39.8142, -73.2459],
  "Región de La Araucanía": [-38.7359, -72.5904],
};

export function MapLocationPicker({
  isOpen,
  onClose,
  onConfirm,
  initialComuna = "Puerto Varas",
  initialRegion = "Región de Los Lagos",
  initialLat,
  initialLng,
}: MapLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Determinar punto inicial
  const defaultCoords: [number, number] =
    initialLat && initialLng
      ? [initialLat, initialLng]
      : COMUNA_COORDINATES[initialComuna] ||
        REGION_COORDINATES[initialRegion] ||
        [-41.3195, -72.9854];

  const [currentCoords, setCurrentCoords] = useState<[number, number]>(defaultCoords);
  const [mapType, setMapType] = useState<"standard" | "satellite">("satellite");

  useEffect(() => {
    if (!isOpen) return;

    // Resetear coordenadas al punto inicial si se suministran
    if (initialLat && initialLng) {
      setCurrentCoords([initialLat, initialLng]);
    } else if (COMUNA_COORDINATES[initialComuna]) {
      setCurrentCoords(COMUNA_COORDINATES[initialComuna]);
    }

    let isMounted = true;

    // Cargar dinámicamente Leaflet en el cliente
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Limpiar mapa anterior si existía
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const center = currentCoords;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 13,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Capa Satélite (Esri World Imagery) o Calles (OpenStreetMap)
      const tileUrl =
        mapType === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      const attribution =
        mapType === "satellite"
          ? "&copy; Esri &mdash; Earthstar Geographics"
          : "&copy; OpenStreetMap contributors";

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution,
      }).addTo(map);

      // Ícono personalizado SoldeRío Orange Pin
      const customIcon = L.divIcon({
        className: "custom-pin-marker",
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 131, 0, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #FF8300; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(center, {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Evento de arrastre del marcador
      marker.on("dragend", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setCurrentCoords([lat, lng]);
      });

      // Evento de clic en el mapa
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCurrentCoords([lat, lng]);
      });

      // Forzar recálculo de tamaño tras animación de apertura del modal
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, mapType]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const lat = Number(currentCoords[0].toFixed(5));
    const lng = Number(currentCoords[1].toFixed(5));
    const formatted = `${lat}, ${lng}`;
    onConfirm({ lat, lng, formatted });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#181818] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1F1F1F]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FF8300]/15 text-[#FF8300] border border-[#FF8300]/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium text-white">
                  Seleccionar Ubicación en el Mapa
                </h3>
                <p className="text-[11px] text-white/60 font-light">
                  Haz clic en el mapa o arrastra el marcador para fijar el punto exacto.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Map Body */}
          <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-black">
            <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[420px]" />

            {/* Floating Map Controls */}
            <div className="absolute top-3 right-3 z-1000 flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  setMapType((prev) => (prev === "satellite" ? "standard" : "satellite"))
                }
                className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-light shadow-lg flex items-center gap-1.5 hover:bg-black transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#FF8300]" />
                <span>{mapType === "satellite" ? "Vista Calles" : "Vista Satélite"}</span>
              </button>
            </div>

            {/* Floating Live Coordinates Box */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-1000 bg-black/85 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-xl shadow-lg flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-white/50 block font-mono">
                  Coordenadas seleccionadas:
                </span>
                <span className="font-mono text-[#FF8300] font-semibold text-xs sm:text-sm">
                  {currentCoords[0].toFixed(5)}, {currentCoords[1].toFixed(5)}
                </span>
              </div>

              <a
                href={`https://maps.google.com/?q=${currentCoords[0]},${currentCoords[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 underline transition-colors"
                title="Ver en Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-white/50 font-light text-center sm:text-left">
              📍 Útil para parcelas, condominios rurales o lugares sin numeración visible.
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:bg-white/10 text-xs font-light transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-white text-xs font-medium flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Ubicación</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
