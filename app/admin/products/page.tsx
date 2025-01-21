import { getAllProducts } from "@/lib/actions/product.actions";

const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const _searchParams = await searchParams;

  const page = Number(_searchParams.page) || 1;
  const searchText = _searchParams.query || "";
  const category = _searchParams.category || "";

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  console.log(products);

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
      </div>
    </div>
  );
};

export default AdminProductsPage;
