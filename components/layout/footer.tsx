export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="flex justify-between items-center px-4 md:px-8 flex-col md:flex-row">

        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-lg font-bold">Mi E-commerce</h2>
          <p>© 2025 Todos los derechos reservados.</p>
        </div>

        <div className="flex space-x-6">
          <a href="/" className="text-sm hover:underline">
            Sobre Nosotros
          </a>
          <a href="/" className="text-sm hover:underline">
            Contacto
          </a>
          <a href="/" className="text-sm hover:underline">
            Términos y Condiciones
          </a>
          <a href="/" className="text-sm hover:underline">
            Política de Privacidad
          </a>
        </div>

      </div>
    </footer>
  )
}