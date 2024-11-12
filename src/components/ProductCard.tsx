import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  
import { formatCurrency } from "@/lib/formatters"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"


type ProductCardProps = {
    id: string
    name: string
    priceInCents: number
    description: string
    imagePath: string
}
export function ProductCard({ id, name, priceInCents, description, imagePath }: ProductCardProps) {
  return (
    <Card className="flex overflow-hidden flex-col">
        <div className="relative w-full h-auto aspect-video">
            <img src={imagePath} alt={name} className="" />
        </div>
        <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <div className="line-clamp-4">{description}</div>
        </CardContent>
        <CardFooter>
            <Button asChild size="lg" className="w-full">
                <Link href={`/products/${id}/purchase`}>Purchase</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton(){
    return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
        <Skeleton className="w-full aspect-video bg-gray-300"/>
        <CardHeader>
            <CardTitle>
                <Skeleton className="w-3/4 h-6 rounded-full bg-gray-300" />
            </CardTitle>
            <div className="text-sm text-muted-foreground">
                <Skeleton className="w-1/2 h-4 rounded-full bg-gray-300" />
            </div>
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="w-full h-4 rounded-full bg-gray-300" />
            <Skeleton className="w-full h-4 rounded-full bg-gray-300" />
            <Skeleton className="w-3/4 h-4 rounded-full bg-gray-300" />
        </CardContent>
        <CardFooter>
            <Button className="w-full" disabled size="lg"></Button>
        </CardFooter>
    </Card>
    )
}