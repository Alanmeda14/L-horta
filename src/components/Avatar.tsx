import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar de usuario', 
  size = 48,
  className = ''
}) => {
  const defaultStyle = {
    width: size,
    height: size,
    backgroundColor: '#e5e7eb', // gris claro
    color: '#4b5563', // gris oscuro
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
  } as React.CSSProperties;

  if (!src) {
    return (
      <div style={defaultStyle} className={className}>
        <User size={size * 0.6} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: '50%',
      }}
      className={className}
    />
  );
};

export default Avatar;
