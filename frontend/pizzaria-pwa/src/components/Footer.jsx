import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span className="mb-2 mb-md-0">
          &copy; {new Date().getFullYear()} Pizzaria. Todos os direitos reservados.
        </span>
        <div className="d-flex gap-3">
          <a href="/home" className="text-white text-decoration-none">Home</a>
          <a href="https://github.com/GustavoBeckSilva/pizzaria-project" className="text-white text-decoration-none">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
