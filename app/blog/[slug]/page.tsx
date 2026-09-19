import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui";
import { blogPosts, getBlogPost } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog | FleetHub",
    };
  }

  return {
    title: `${post.title} | FleetHub`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="bg-[#0a0f0b] py-20 text-white">
      <Container className="max-w-4xl">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{post.category}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">{post.title}</h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-white/45">
            {post.date} · {post.readTime}
          </p>
          <div className="mt-8 space-y-6 text-base leading-8 text-white/70">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </Container>
    </section>
  );
}
