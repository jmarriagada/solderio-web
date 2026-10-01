"use client";

import { useEffect, useRef, useState } from "react";

// Clave oficial de prueba de Cloudflare Turnstile (pasa automáticamente)
const CLOUDFLARE_TEST_SITE_KEY = "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (error: any) => void;
          "expired-callback"?: () => void;
          theme?: "dark" | "light" | "auto";
          size?: "normal" | "compact" | "flexible";
          language?: string;
          appearance?: "always" | "execute" | "interaction-only";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  theme?: "dark" | "light" | "auto";
  size?: "normal" | "compact" | "flexible";
  className?: string;
}

export function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
  theme = "dark",
  size = "normal",
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Mantener callbacks en refs estables para no provocar re-renderizados/destrucciones del widget
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;
  });

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || CLOUDFLARE_TEST_SITE_KEY;

  // 1. Cargar el script de Turnstile si no existe
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.turnstile) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = "cloudflare-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      // Si el script ya existe en el DOM, esperar a que window.turnstile esté disponible
      if (window.turnstile) {
        setIsScriptLoaded(true);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            setIsScriptLoaded(true);
            clearInterval(interval);
          }
        }, 50);
        return () => clearInterval(interval);
      }
    }
  }, []);

  // 2. Renderizar el widget una vez que el script y el contenedor estén listos
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !window.turnstile) return;

    let activeWidgetId: string | null = null;

    // Si ya existe un widget montado, lo removemos antes de renderizar
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (e) {
        // Ignorar si ya fue removido
      }
      widgetIdRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    try {
      activeWidgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        language: "es",
        callback: (token: string) => {
          onSuccessRef.current?.(token);
        },
        "error-callback": (err: any) => {
          console.warn("[Turnstile Widget Error]:", err);
          onErrorRef.current?.(err);
        },
        "expired-callback": () => {
          onExpireRef.current?.();
        },
      });
      widgetIdRef.current = activeWidgetId;
    } catch (err) {
      console.warn("[Turnstile Render Exception]:", err);
    }

    return () => {
      if (activeWidgetId && window.turnstile) {
        try {
          window.turnstile.remove(activeWidgetId);
        } catch (e) {
          // Cleanup seguro
        }
        if (widgetIdRef.current === activeWidgetId) {
          widgetIdRef.current = null;
        }
      }
    };
  }, [isScriptLoaded, siteKey, theme, size]);

  return (
    <div className={`turnstile-wrapper my-2 flex justify-center ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
