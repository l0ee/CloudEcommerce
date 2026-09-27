import React from 'react';
import { ShoppingCart } from 'lucide-react';

export function Logo({ onHome }) {
  return (
    <button className="brand" type="button" aria-label="CYBERSHOP home" onClick={onHome}>
      <span className="brand-mark" aria-hidden="true">
        <ShoppingCart size={21} strokeWidth={2.2} />
        <i />
        <b />
      </span>
      <span>CYBERSHOP</span>
    </button>
  );
}

export default Logo;
