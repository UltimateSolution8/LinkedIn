// @ts-nocheck
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "9iae1qca",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    "author": author->{name, avatar},
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 ),
    "category": category->title,
    featured
  }`;
  return sanityClient.fetch(query);
}

export async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    "author": author->{name, avatar, bio},
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
  const query = `*[_type == "post" && featured == true][0] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    "author": author->{name, avatar},
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
