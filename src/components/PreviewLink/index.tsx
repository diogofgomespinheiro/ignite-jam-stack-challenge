import Link from 'next/link';

import styles from './preview-link.module.scss';

function PreviewLink() {
  return (
    <aside className={styles.container}>
      <Link href="/api/exit-preview">
        <a>Sair do modo Preview</a>
      </Link>
    </aside>
  );
}

export default PreviewLink;
