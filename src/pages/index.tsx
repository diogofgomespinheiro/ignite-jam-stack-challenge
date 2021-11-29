import { ReactElement, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

import TextIcon from '../components/TextIcon';
import { getPrismicClient, fetcher } from '../services';
import { formatDate } from '../utils';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [{ next_page, results }, setPostsPagination] =
    useState(postsPagination);

  async function loadMorePosts(): Promise<void> {
    const response = await fetcher<ApiSearchResponse>(next_page);

    const mappedResults: Post[] = response.results.map<Post>(
      ({ uid, first_publication_date, data }) => ({
        uid,
        first_publication_date,
        data: {
          title: data.title,
          subtitle: data.subtitle,
          author: data.author,
        },
      })
    );

    setPostsPagination(prevState => ({
      next_page: response.next_page,
      results: [...prevState.results, ...mappedResults],
    }));
  }

  return (
    <>
      <Head>
        <title>Home | spacetravelling</title>
      </Head>
      <main className={styles.wrapper}>
        <div className={styles.container}>
          {results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <div className={styles.postContent}>
                  <h4>{post.data.title}</h4>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.infoContainer}>
                    <TextIcon
                      icon="calendar"
                      text={formatDate(post.first_publication_date)}
                    />
                    <TextIcon icon="user" text={post.data.author} />
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {next_page && (
            <button type="button" onClick={loadMorePosts}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { results, next_page } = await getPrismicClient().query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 20,
    }
  );

  const mappedResults: Post[] = results.map<Post>(
    ({ uid, first_publication_date, data }) => ({
      uid,
      first_publication_date,
      data: {
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
      },
    })
  );

  return {
    props: {
      postsPagination: {
        next_page,
        results: mappedResults,
      },
    },
  };
};
