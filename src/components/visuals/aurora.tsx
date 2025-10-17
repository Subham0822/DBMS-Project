'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function AuroraBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative transition-bg',
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            pointer-events-none
            absolute -inset-[10px] opacity-50 
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            `,
            '[[--aurora:repeating-linear-gradient(100deg,var(--primary)_0%,var(--purple-300)_15%,var(--blue-300)_30%,var(--green-300)_45%,var(--yellow-300)_60%,var(--orange-300)_75%,var(--red-300)_90%,var(--primary)_100%)]]'
          )}
        ></div>
      </div>
      {children}
    </div>
  );
}
