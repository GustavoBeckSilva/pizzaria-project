import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <div className="container">
        <span className="text-muted">&copy; {new Date().getFullYear()} Pizzaria. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}

