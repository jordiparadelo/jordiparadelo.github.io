import React from 'react';
import Link from 'next/link';
import LogoIcon from '@/assets/logo.svg';

interface LogoProps {
  href?: string;
}

const Logo: React.FC<LogoProps> = ({ href = '/' }) => {
  return (
    <Link href={href}>
      <LogoIcon style={{ width: '100%', height: '32px' }} />
    </Link>
  );
};

export default Logo;