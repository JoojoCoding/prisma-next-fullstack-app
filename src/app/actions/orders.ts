"use server"

import prisma from "@/db/db"

export const userOrderExist = async(email: string, productId: string) => {
    const order = await prisma.order.findFirst({
        where: {
            user: { email },
            productId
        },
        select: {
            id: true
        }
    })
    return order != null
}