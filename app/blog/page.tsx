import type { Metadata } from "next";
import Link from "next/link";

import { Container, SectionHeading } from "@/components/ui";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | TAXI FLOTA",
  description:
    "Blog TAXI FLOTA s korisnim tekstovima za vozače, prijavu za rad preko Uber i Bolt platformi i najam vozila.",
};

export default function BlogPage() {
  return (
    <section className="bg-[#f3f5f3] py-20 text-black">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Savjeti, vodiči i korisne informacije za vozače"
          description="Blog služi kao dodatni izvor informacija za kandidate koji žele bolje razumjeti prijavu, rad kroz flotu i najam vozila."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[1.8rem] border border-black/10 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-accent"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentDark">{post.category}</p>
              <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-black/65">{post.excerpt}</p>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                {post.date} · {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
