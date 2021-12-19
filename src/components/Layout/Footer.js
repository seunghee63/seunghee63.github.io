import React from 'react';

import { rhythm } from 'utils/typography';

function Footer() {
  return (
    <footer
      style={{
        marginTop: rhythm(2.5),
        paddingTop: rhythm(1),
        textAlign: 'center',
      }}
    >
      <p>
        Made of{' '}
        <a
          href="https://github.com/seunghee63"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--textLink)' }}
        >
          song2
        </a>
      </p>
    </footer>
  );
}

export default Footer;
