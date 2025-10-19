import Providers from '@/components/providers';
import type React from 'react';

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps): React.ReactNode {
  return (
    <Providers>
      <div className="w-screen">{children}</div>
    </Providers>
  );
}
