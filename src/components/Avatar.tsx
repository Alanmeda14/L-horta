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
  alt = 'User avatar', 
  size = 48,
  className = ''
}) => {
  const defaultAvatarStyle = {
    width: size,
    height: size,
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  };

  if (!src) {
    return (
      <div style={defaultAvatarStyle} className={className}>
        <User size={size * 0.6} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%' }}
      className={className}
    />
  );
};

export default Avatar;