import styles from "../SiteChrome.module.css";
import { footer, footerLinks, links, navLinks, showrooms } from "../data";
import { productCategories } from "../productsCatalog";
import FooterSection from "../sections/FooterSection";
import HeaderSection from "../sections/HeaderSection";
import ProductsCatalog from "./ProductsCatalog";
import ProductDetail from "./ProductDetail";
import ProductTypeDetail from "./ProductTypeDetail";

/** /productos, /productos/[categoria] y el detalle /productos/[categoria]/[tipo]: mismo header y footer que la home, con el catálogo en el medio. */
export default function ProductsShell({ categoryId, typeSlug, productSlug }) {
  return (
    <main className={styles.page}>
      <HeaderSection navLinks={navLinks} />
      {productSlug ? (
        <ProductDetail categoryId={categoryId} typeSlug={typeSlug} productSlug={productSlug} />
      ) : typeSlug ? (
        <ProductTypeDetail categoryId={categoryId} typeSlug={typeSlug} />
      ) : (
        <ProductsCatalog categories={productCategories} categoryId={categoryId} />
      )}
      <FooterSection
        footer={footer}
        footerLinks={footerLinks}
        showrooms={showrooms}
        instagramHref={links.instagram}
        whatsappHref={links.whatsappGeneral}
      />
    </main>
  );
}
