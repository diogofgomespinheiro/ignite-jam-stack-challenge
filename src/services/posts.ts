import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import { QueryOptions } from '@prismicio/client/types/ResolvedApi';

import { getPrismicClient } from './prismic';

class PostsService {
  constructor(private readonly client: DefaultClient) {
    this.client = client;
  }

  async findAll(options?: QueryOptions) {
    const { results, next_page } = await this.client.query(
      Prismic.predicates.at('document.type', 'posts'),
      options
    );

    return { results, next_page };
  }

  async findById(slug: string | string[], options: QueryOptions) {
    return this.client.getByUID('posts', String(slug), options);
  }

  async findPrevious(currentId: string) {
    const { results } = await this.findAll({
      pageSize: 1,
      after: currentId,
      orderings: '[document.first_publication_date desc]',
    });

    return results[0] || null;
  }

  async findNext(currentId: string) {
    const { results } = await this.findAll({
      pageSize: 1,
      after: currentId,
      orderings: '[document.first_publication_date]',
    });

    return results[0] || null;
  }
}

export default new PostsService(getPrismicClient());
