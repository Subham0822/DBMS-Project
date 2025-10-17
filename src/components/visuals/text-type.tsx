'use client';

import React, { useEffect, useState } from 'react';

export function TextType({
  words,
  speed = 80,
  pause = 1200,
  className,
}: {
  words: string[];
  speed?: number;
  pause?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index % words.length];
    if (!deleting && subIndex === currentWord.length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex(i => (i + 1) % words.length);
      return;
    }
    const timeout = setTimeout(
      () => {
        setSubIndex(s => s + (deleting ? -1 : 1));
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, speed, pause]);

  return (
    <span className={className}>
      {words[index % words.length].substring(0, subIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}
