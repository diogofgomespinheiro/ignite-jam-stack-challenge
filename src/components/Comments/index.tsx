import { useEffect } from 'react';

function Comments() {
  useEffect(() => {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', '');
    script.setAttribute(
      'repo',
      'diogofgomespinheiro/ignite-jam-stack-challenge-utteranc'
    );
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'dark-blue');
    anchor.appendChild(script);
  }, []);

  return <div id="inject-comments-for-uterances" />;
}

export default Comments;
