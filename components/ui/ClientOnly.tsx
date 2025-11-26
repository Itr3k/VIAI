import React, { useEffect, useState } from 'react';

const ClientOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className={className} />;
  }

  return <>{children}</>;
};

export default ClientOnly;