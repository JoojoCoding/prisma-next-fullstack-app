import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";
  


export default function AdminProductsPage() {
  return (
    <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Product</PageHeader>
        <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
        </Button>
    </div>
    <ProductsTable />
    </>
    
  )
}

const ProductsTable = async() => {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            _count: {
                select: {
                    orders: true
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    })

    if(products.length === 0) return <p>No products found</p> 

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only">Available For Purchase</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(prod => (
                <TableRow key={prod.id}>
                    <TableCell>
                        {prod.isAvailableForPurchase ? (
                            <>
                                <span className="sr-only">Available</span>
                                <CheckCircle2 />
                            </>
                        ) : (
                            <>
                                <span className="sr-only">Unavailable</span>
                                <XCircle className="stroke-destructive"/>
                            </>
                        )}
                    </TableCell>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>{formatCurrency(prod.priceInCents / 100)}</TableCell>
                    <TableCell>{formatNumber(prod._count.orders)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <a download href={`/admin/products/${prod.id}/download`}>Download</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/${prod.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem id={prod.id} isAvailableForPurchase={prod.isAvailableForPurchase}/>
                                <DropdownMenuSeparator />
                                <DeleteDropdownItem id={prod.id} disabled={prod._count.orders > 0}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>

                </TableRow>
            ))}
        </TableBody>
    </Table>
}