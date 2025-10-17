import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/favicon.ico"
      alt="MediSys Logo"
      width={32}
      height={32}
      className="rounded-md"
    />
  );
}
