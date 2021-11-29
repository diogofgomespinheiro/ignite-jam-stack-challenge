import { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): ReactElement {
  return (
    <header className={styles.container}>
      <nav className={styles.content}>
        <Link href="/">
          <a>
            <Image src="/assets/logo.svg" alt="logo" height={27} width={239} />
          </a>
        </Link>
      </nav>
    </header>
  );
}
