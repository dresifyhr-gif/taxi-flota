import type { Metadata } from "next";
import Link from "next/link";

import { Container, SectionHeading } from "@/components/ui";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | FleetHub",
  description:
    "FleetHub blog s korisnim tekstovima za vozače, prijavu za rad preko Uber i Bolt platformi i najam vozila.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <section className="bg-[#0e1512] py-20 text-white">
      <Container>
        <SectionHeading
          invert
          eyebrow="Blog"
          title="Savjeti, vodiči i korisne informacije za vozače"
          description="Blog služi kao dodatni izvor informacija za kandidate koji žele bolje razumjeti prijavu, rad kroz flotu i najam vozila."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{post.category}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/60">{post.excerpt}</p>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                {post.date} · {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
