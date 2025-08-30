import { useRouter } from "next/router";

export default function CategoryPage() {
  const router = useRouter();
  const { category_slug } = router.query;

  return (
    <div>
      <h1>Category: {category_slug}</h1>
      {/* Aquí renderizas los productos que pertenezcan a esta categoría */}
    </div>
  );
}
