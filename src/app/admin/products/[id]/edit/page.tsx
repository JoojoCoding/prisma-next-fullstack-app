import prisma from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm"

type EditProductProps = {
    params: {
        id: string
    }
}
export default async function EditProductPage({params: { id }}: EditProductProps) {
    const product = await prisma.product.findUnique({
        where: { id }
    })
    return (
        <>
        <PageHeader>Edit Product</PageHeader>
        <ProductForm product={product}/>
        </>
    )
}
