// @ts-nocheck
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL || "";
const USE_BACKEND_PROXY = (import.meta.env.VITE_SANITY_USE_BACKEND_PROXY || "false") === "true";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "9iae1qca",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  // Prefer fresh content so newly published admin posts appear immediately.
  useCdn: (import.meta.env.VITE_SANITY_USE_CDN || "false") === "true",
  perspective: "published",
});

async function fetchFromBackend(endpoint: string) {
  if (!USE_BACKEND_PROXY || !RIXLY_API_BASE_URL) return null;

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/public/${endpoint}`, {
      credentials: "include",
    });

    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.warn(`Backend proxy fetch failed for ${endpoint}:`, error);
    return null;
  }
}

export async function getPosts() {
  const proxied = await fetchFromBackend("blog-posts");
  if (Array.isArray(proxied)) {
    return proxied;
  }

  const query = `*[
    _type in ["post", "blog", "blogPost"] &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImageUrl": coalesce(featuredImage.asset->url, coverImage.asset->url, mainImage.asset->url, image.asset->url),
    "coverImage": coalesce(featuredImage, coverImage, mainImage, image),
    "author": author->{name, "avatarUrl": avatar.asset->url},
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 ),
    "category": category->title,
    featured,
    body
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
    "coverImageUrl": coalesce(featuredImage.asset->url, coverImage.asset->url, mainImage.asset->url, image.asset->url),
    "coverImage": coalesce(featuredImage, coverImage, mainImage, image),
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
  const proxied = await fetchFromBackend("blog-categories");
  if (Array.isArray(proxied)) {
    return proxied;
  }

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
    "coverImageUrl": coalesce(featuredImage.asset->url, coverImage.asset->url, mainImage.asset->url, image.asset->url),
    "coverImage": coalesce(featuredImage, coverImage, mainImage, image),
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
