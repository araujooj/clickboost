import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

export interface Product {
  name: string
  bottomClickPrice: number
  topClickPrice: number
  commission: number
  formattedCommission: string
}

interface ProductContextProps {
  products: Product[]
  createProduct: (product: Product) => void
}

interface ProductProviderProps {
  children: ReactNode
}

export const ProductContext = createContext<ProductContextProps>({
  products: [],
  createProduct: () => {},
})

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([])

  const createProduct = useCallback((data: Product) => {
    const product = {
      ...data,
      bottomClickPrice: +data.bottomClickPrice,
      topClickPrice: +data.topClickPrice,
      commission: +data.commission,
      formattedCommission: Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(+data.commission),
    }

    setProducts((products) => [...products, product])
  }, [])

  const value = useMemo(
    () => ({ products, createProduct }),
    [products, createProduct]
  )
  console.log(products)

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
