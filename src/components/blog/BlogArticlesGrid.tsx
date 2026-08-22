"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";

export function BlogArticlesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const categories = ["Todas", "Casos Reales", "Normativa SEC", "Tecnología BESS", "Economía & ROI"];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === "Todas") return true;
    return post.category === selectedCategory;
  });

  return (
    <section className="bg-transparent py-20 md:py-32 relative overflow-hidden">
      <div className="w-full px-3 md:px-5 box-border">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-light transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#FF8300] text-white shadow-md font-normal"
                    : "bg-[#F7F8FA] border border-black/5 text-[#6B7280] hover:text-black hover:bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 md:p-8 rounded-[28px] bg-[#F7F8FA] border border-black/5 hover:border-[#FF8300]/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link href={`/blog/${post.slug}`} className="block relative w-full aspect-[16/9] mb-6 rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  {/* Date and Read Time */}
                  <div className="flex items-center gap-4 text-xs text-[#6B7280] font-light mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF8300]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-normal text-[#1F1F1F] mb-3 leading-snug group-hover:text-[#FF8300] transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-[#6B7280] font-light leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <span className="text-xs font-semibold text-[#1F1F1F] block">{post.author.name}</span>
                      <span className="text-[10px] text-[#6B7280] font-light">{post.author.role}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF8300] hover:text-[#e07400] uppercase tracking-wider group-hover:translate-x-1 transition-all"
                  >
                    <span>Leer Artículo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
