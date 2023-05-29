import React, { PropsWithChildren } from 'react';
import Link from 'next/link';

interface Props extends PropsWithChildren<React.ComponentProps<typeof Link> & { href: string }> {
  active?: boolean;
}

export const NavLink: React.FC<Props> = ({ active, ...props }) => (
  <Link
    style={{
      color: active ? '#e41a4a' : '#5A5B6A',
      textDecoration: active ? 'underline' : 'none',
      ...props.style,
    }}
    {...props}
  />
);
