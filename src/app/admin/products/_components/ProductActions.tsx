"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { deleteProduct, toggleProductAvailability } from "../../_actions/products"
import { useRouter } from "next/navigation"

type ToggleDropdownProps = {
    id: string,
    isAvailableForPurchase: boolean
}
export const ActiveToggleDropdownItem = ({id, isAvailableForPurchase}: ToggleDropdownProps) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    return <DropdownMenuItem 
    disabled={isPending}
    onClick={() => {
        startTransition(async() => {
            await toggleProductAvailability(id, !isAvailableForPurchase)
            router.refresh()
        })
    }}>
    {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
}
type DeleteDropdownProps = {
    id: string
    disabled: boolean
}
export const DeleteDropdownItem = ({id, disabled}: DeleteDropdownProps) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    return <DropdownMenuItem
    variant="destructive" 
    disabled={isPending || disabled}
    onClick={() => {
        startTransition(async() => {
            await deleteProduct(id)
            router.refresh()
        })
    }}>
    Delete
    </DropdownMenuItem>
}