"use client"

import { Provider } from "@src/hooks"
import { CardList } from "./Home/CardList"
import { Form } from "./Home/Form"

export default function Home() {
  return (
    <Provider>
      <Form />
      <CardList />
    </Provider>
  )
}
