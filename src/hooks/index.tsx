import { ProductProvider } from "./useProducts"

export const Provider = ({ children }: any) => (
  <ProductProvider>{children}</ProductProvider>
)
