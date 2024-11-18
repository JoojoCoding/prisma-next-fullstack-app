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
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { MoreVertical } from "lucide-react"
import { DeleteDropdownItem } from "./_components/UserActions"


const getUsers = () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            orders: {
                select: {
                    pricePaidInCents: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}
  
const UsersPage = () => {
    return (
        <>
            <PageHeader>Customers</PageHeader>
            <UsersTable />
        </>
    )
}


const UsersTable = async() => {
    const users = await getUsers()

    if(users.length === 0) return <p>No customers found</p> 

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map(user => (
                <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatNumber(user.orders.length)}</TableCell>
                    <TableCell>{formatCurrency(user.orders.reduce((sum, o) => o.pricePaidInCents + sum, 0) / 100)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                               <DeleteDropdownItem id={user.id}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>

                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default UsersPage