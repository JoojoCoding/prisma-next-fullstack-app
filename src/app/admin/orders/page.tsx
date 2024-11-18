import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import prisma from "@/db/db"
import { PageHeader } from "../_components/PageHeader"
import { formatCurrency } from "@/lib/formatters"
import { MoreVertical } from "lucide-react"
import { DeleteDropdownItem } from "./_components/OrderActions"


const getOrders = () => {
    return prisma.order.findMany({
        select: {
            id: true,
            pricePaidInCents: true,
            product: {
                select: {
                    name: true,
                }
            },
            user: {
                select: {
                    email: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}
  
const OrdersPage = () => {
    return (
        <>
            <PageHeader>Sales</PageHeader>
            <OrdersTable />
        </>
    )
}

const OrdersTable = async() => {
    const orders = await getOrders()

    if(orders.length === 0) return <p>No sales found</p> 

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Price Paid</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map(order => (
                    <TableRow key={order.id}>
                        <TableCell>{order.product.name}</TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>{formatCurrency(order.pricePaidInCents / 100)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical />
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <DeleteDropdownItem id={order.id}/>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ) 
}

export default OrdersPage