import { useProducts } from "@src/hooks/useProducts"
import { Card } from "./Card"

export const CardList = () => {
  const { products } = useProducts()

  return (
    <div className="flex overflow-x-auto whitespace-nowrap">
      {products.map((product) => (
        <Card key={product.name} product={product} />
      ))}
    </div>
  )
}
