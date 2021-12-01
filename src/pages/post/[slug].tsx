import { ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Prismic from '@prismicio/client';
import { RichText, RichTextBlock } from 'prismic-reactjs';

import Comments from '../../components/Comments';
import TextIcon from '../../components/TextIcon';
import PreviewLink from '../../components/PreviewLink';
import { getPrismicClient } from '../../services';
import { formatDate, calculateEstimatedReadingTime } from '../../utils';

import styles from './post.module.scss';

interface Post {
  first_publication_date?: string;
  last_publication_date?: string;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: RichTextBlock[];
    }[];
  };
}

interface PostProps {
  post: Post;
  preview?: boolean;
}

export default function Post({ post, preview }: PostProps): ReactElement {
  const router = useRouter();
  const { data, first_publication_date, last_publication_date } = post;
  const { banner, title, author, content } = data;
  const estimatedReadingTime = calculateEstimatedReadingTime(content);

  return (
    <>
      <Head>
        <title>{title} | spacetravelling</title>
      </Head>
      <main>
        {router.isFallback && <div>Carregando...</div>}
        <div className={styles.banner}>
          <Image
            src={banner.url}
            alt="banner"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className={styles.postWrapper}>
          <article className={styles.postContainer}>
            <div className={styles.postHeading}>
              <h1>{title}</h1>
              <div>
                <TextIcon
                  icon="calendar"
                  text={formatDate(first_publication_date)}
                />
                <TextIcon icon="user" text={author} />
                <TextIcon icon="clock" text={`${estimatedReadingTime} min`} />
              </div>
              <span className={styles.editedTime}>
                * editado a {formatDate(last_publication_date, 'PPPp')}
              </span>
            </div>
            <div className={styles.postBody}>
              {content.map(item => (
                <div key={item.heading}>
                  <h2>{item.heading} </h2>
                  <RichText render={item.body} />
                </div>
              ))}
            </div>
          </article>
        </div>
        <Comments />
        {preview && <PreviewLink />}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 50,
    }
  );

  const paths = response.results.map(result => ({
    params: { slug: result.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async context => {
  const { slug } = context.params;
  const { preview = false, previewData = {} } = context;

  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(slug), {
    ref: previewData.ref ?? null,
  });

  return {
    props: {
      post,
      preview,
    },
    revalidate: 60 * 60 * 24 * 3, // 3 days
  };
};
