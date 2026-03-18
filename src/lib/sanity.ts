// @ts-nocheck
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "9iae1qca",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  // Prefer fresh content so newly published admin posts appear immediately.
  useCdn: (import.meta.env.VITE_SANITY_USE_CDN || "false") === "true",
  perspective: "published",
});

export async function getPosts() {
  const query = `*[
    _type in ["post", "blog", "blogPost"] &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    "author": author->{name, "avatarUrl": avatar.asset->url},
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 ),
    "category": category->title,
    featured
  }`;
  return sanityClient.fetch(query);
}

export async function getPost(slug) {
  const query = `*[
    _type in ["post", "blog", "blogPost"] &&
    slug.current == $slug
  ][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    "author": author->{name, "avatarUrl": avatar.asset->url, bio},
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 ),
    "category": category->{title, slug},
    featured,
    body
  }`;
  return sanityClient.fetch(query, { slug });
}

export async function getCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug
  }`;
  return sanityClient.fetch(query);
}

export async function getFeaturedPost() {
  const query = `*[
    _type in ["post", "blog", "blogPost"] &&
    featured == true &&
    defined(slug.current)
  ][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    "author": author->{name, "avatarUrl": avatar.asset->url},
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 ),
    "category": category->title
  }`;
  return sanityClient.fetch(query);
}

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}
