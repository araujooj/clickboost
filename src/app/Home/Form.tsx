import { zodResolver } from "@hookform/resolvers/zod"
import { Product, useProducts } from "@src/hooks/useProducts"
import { useForm } from "react-hook-form"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, { message: "Required field" }),
  bottomClickPrice: z.string().min(1, { message: "Required field" }),
  topClickPrice: z.string().min(1, { message: "Required field" }),
  commission: z.string().min(1, { message: "Required field" }),
})

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
  })

  const { createProduct } = useProducts()

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-neutral-900">
      <form
        className="flex w-4/5 max-w-lg flex-col gap-3"
        onSubmit={handleSubmit(createProduct)}
      >
        <input
          className="rounded-lg border border-gray-600 px-3 py-2 placeholder-slate-300 focus:border-blue-500 focus:outline-none"
          type="text"
          placeholder="Name of the product"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
        <input
          className="rounded-lg border border-gray-600 px-3 py-2 placeholder-slate-300 focus:border-blue-500 focus:outline-none"
          type="text"
          placeholder="Bottom click price"
          {...register("bottomClickPrice")}
        />
        {errors.bottomClickPrice && (
          <p className="text-sm text-red-500">
            {errors.bottomClickPrice.message}
          </p>
        )}
        <input
          className="rounded-lg border border-gray-600 px-3 py-2 placeholder-slate-300 focus:border-blue-500 focus:outline-none"
          type="text"
          placeholder="Top click price"
          {...register("topClickPrice")}
        />
        {errors.topClickPrice && (
          <p className="text-sm text-red-500">{errors.topClickPrice.message}</p>
        )}
        <input
          className="rounded-lg border border-gray-600 px-3 py-2 placeholder-slate-300 focus:border-blue-500 focus:outline-none"
          type="text"
          placeholder="Commission (USD)"
          {...register("commission")}
        />
        {errors.commission && (
          <p className="text-sm text-red-500">{errors.commission.message}</p>
        )}
        <button className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none">
          Submit
        </button>
      </form>
    </main>
  )
}
