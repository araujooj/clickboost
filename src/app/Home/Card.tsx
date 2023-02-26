import { Product } from "@src/hooks/useProducts"

interface CardProps {
  product: Product
}

export const Card = ({ product }: CardProps) => {
  return (
    <section className="flex h-screen flex-col items-center justify-center bg-neutral-900">
      <div className="w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="mt-2 text-gray-600">{product.topClickPrice}</p>
          <p className="mt-2 text-gray-600">{product.bottomClickPrice}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xl font-bold text-gray-700">
              {product.formattedCommission}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
