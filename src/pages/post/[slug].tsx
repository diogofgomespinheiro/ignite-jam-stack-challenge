import { ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { RichText, RichTextBlock } from 'prismic-reactjs';

import Comments from '../../components/Comments';
import TextIcon from '../../components/TextIcon';
import PreviewLink from '../../components/PreviewLink';
import { PostsService } from '../../services';
import { formatDate, calculateEstimatedReadingTime } from '../../utils';

import styles from './post.module.scss';

interface Post {
  uid?: string;
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
  previousPost?: Post;
  nextPost?: Post;
  preview?: boolean;
}

export default function Post({
  post,
  previousPost,
  nextPost,
  preview,
}: PostProps): ReactElement {
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
          <footer className={styles.footerContainer}>
            {(previousPost || nextPost) && (
              <div className={styles.postsLinksContainer}>
                {previousPost && (
                  <div className={styles.postLinkContainer}>
                    <span>{previousPost.data.title}</span>
                    <Link href={`/post/${previousPost.uid}`}>
                      <a>Post anterior</a>
                    </Link>
                  </div>
                )}

                <div className={styles.spacer} />

                {nextPost && (
                  <div className={styles.postLinkContainer}>
                    <span>{nextPost.data.title}</span>
                    <Link href={`/post/${nextPost.uid}`}>
                      <a>Post seguinte</a>
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Comments />
            {preview && <PreviewLink />}
          </footer>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await PostsService.findAll({
    pageSize: 50,
  });

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

  const post = await PostsService.findById(slug, {
    ref: previewData.ref ?? null,
  });

  const previousPost = await PostsService.findPrevious(post.id);
  const nextPost = await PostsService.findNext(post.id);

  return {
    props: {
      post,
      previousPost,
      nextPost,
      preview,
    },
    revalidate: 60 * 60 * 24 * 3, // 3 days
  };
};
