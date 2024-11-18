"use server"

import prisma from "@/db/db"
import { notFound } from "next/navigation"

export const deleteUser = async(id: string) => {
    const user = await prisma.user.delete({
        where: { id }
    })
    if(user == null) return notFound()
    return user
}