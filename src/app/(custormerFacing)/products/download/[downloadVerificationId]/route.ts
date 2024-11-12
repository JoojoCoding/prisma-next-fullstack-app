import prisma from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"

type paramsProps = {
    params: {
        downloadVerificationId: string
    }
}
export async function GET(req: NextRequest, { params }: paramsProps) {
    const { downloadVerificationId } = await params
    const data = await prisma.downloadVerification.findUnique({
        where: {
            id: downloadVerificationId,
            expiresAt: { gt: new Date() }
        },
        select: {
            product: {
                select: {
                    filePath: true,
                    name: true
                }
            }
        }
    })

    console.log("dane: " + data)
    if(data == null) return NextResponse.redirect(new URL("/products/download/expired", req.url))
    
    const { size } = await fs.stat(data.product.filePath)
    const file = await fs.readFile(data.product.filePath)
    const extension = data.product.filePath.split(".").pop()

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
            "Content-Length": size.toString()
        }
    })
}