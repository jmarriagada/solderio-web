import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://solderio.cl";

  const staticRoutes = [
    "",
    "/hogar",
    "/empresas",
    "/cotizacion",
    "/acerca-de",
    "/garantia",
    "/porque-solar",
    "/incentivos",
    "/seguros",
    "/aprender",
    "/preguntas-frecuentes",
    "/trabaja-con-nosotros",
    "/blog",
    "/politicas-de-privacidad",
    "/terminos",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
