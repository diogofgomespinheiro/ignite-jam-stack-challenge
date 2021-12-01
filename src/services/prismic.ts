import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import { Document } from '@prismicio/client/types/documents';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}

export function linkResolver(document: Document): string {
  switch (document.type) {
    case 'posts':
      return `/post/${document.uid}`;
    default:
      return '/';
  }
}
