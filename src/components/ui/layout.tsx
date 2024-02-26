import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <main>
      <nav className="flex items-center gap-8 p-4 min-h-10 bg-primary text-secondary">
        <Link className="flex-1 text-4xl font-black" to={"/"}>
          Home
        </Link>
        <Link className="text-xl font-semibold" to={"/articles"}>
          Articles
        </Link>
        <Link className="text-xl font-semibold" to={"/about"}>
          About
        </Link>
      </nav>
      <div className="p-4 mt-4">{children}</div>
    </main>
  );
}

export default Layout;
