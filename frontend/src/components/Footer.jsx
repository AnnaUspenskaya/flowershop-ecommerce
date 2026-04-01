function Footer() {
  return (
    <footer className="custom-footer text-white text-center p-4 mt-auto">

      <div className="container">
        <h5>FlowerShop</h5>
        <p>Delivering love with flowers, gifts & sweets </p>

        <div className="mb-2">
          <span className="me-3">📞 (555) 123-4567</span>
          <span>flowershop@email.com</span>
        </div>

        <small>© {new Date().getFullYear()} FlowerShop. All rights reserved.</small>
      </div>

    </footer>
  );
}

export default Footer;