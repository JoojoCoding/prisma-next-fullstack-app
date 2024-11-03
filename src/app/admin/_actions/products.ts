"use server"
import prisma from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const fileSchema = z.instanceof(File, {message: "Required"})
const imageSchema = fileSchema.refine(
    file => file.size === 0 || file.type.startsWith("image/")
)
const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required"),
})

export const addProduct = async(prev: unknown, formData: FormData) => {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!result.success){
        return result.error.formErrors.fieldErrors
    }
    const data = result.data

    await fs.mkdir("products", {recursive: true})
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", {recursive: true})
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await prisma.product.create({
    data: {
        isAvailableForPurchase: false,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath
    }
})
    revalidatePath("/")
    revalidatePath("/products")

    redirect("/admin/products")
}
const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})
export const updateProduct = async(id:string, prev: unknown, formData: FormData) => {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!result.success){
        return result.error.formErrors.fieldErrors
    }
    const data = result.data
    const product = await prisma.product.findUnique({
        where: { id }
    })
    if(product == null) return notFound()
    
    let filePath = product.filePath
    if(data.file != null && data.file.size > 0){
        await fs.unlink(product.filePath)
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    }
    let imagePath = product.imagePath
    if(data.image != null && data.image.size > 0){
        await fs.unlink(`public${product.imagePath}`)
        const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }
    
    await prisma.product.update({
    where: { id },
    data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath
    }
})
    revalidatePath("/")
    revalidatePath("/products")

    redirect("/admin/products")
}

export const toggleProductAvailability = async(
    id: string,
    isAvailableForPurchase: boolean
) => {
    await prisma.product.update({
        where: { id },
        data: { isAvailableForPurchase }
    })
    revalidatePath("/")
    revalidatePath("/products")
}
export const deleteProduct = async(id: string) => {
    const product = await prisma.product.delete({
        where: { id }
    })
    if(product == null) return notFound()
    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.imagePath}`)
}