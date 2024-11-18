import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"
import React from "react"

type OrderHistoryProps = {
    orders: {
        id: string
        pricePaidInCents: number
        createdAt: Date
        downloadVerificationId: string
        product: {
            name: string
            imagePath: string
            description: string
        }
    }[]
    
}

const OrderHistoryEmail = ({ orders }: OrderHistoryProps) => {
    return (
        <Html>
            <Preview>Order History and Downloads</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w=xl">
                        <Heading>Order History</Heading>
                        {orders.map((order, i) => (
                            <React.Fragment key={order.id}>
                                <OrderInformation order={order} product={order.product} downloadVerificationId={order.downloadVerificationId}/>
                                {i < orders.length - 1 && <Hr />}
                            </React.Fragment>
                        ))}
                    </Container>
                </Body>
            </Tailwind>
        </Html>    
    )
}
OrderHistoryEmail.PreviewProps = {
    orders: [
        {
            id: crypto.randomUUID(),
            pricePaidInCents: 10000,
            createdAt: new Date(),
            downloadVerificationId: crypto.randomUUID(),
            product: {
                name: "Product Name",
                description: "Product description",
                imagePath: "/products/ecc8329b-eb39-4990-b66b-fcc9044647b6-EBOOK1.png"
            }
        },
        {
            id: crypto.randomUUID(),
            pricePaidInCents: 10000,
            createdAt: new Date(),
            downloadVerificationId: crypto.randomUUID(),
            product: {
                name: "Product Name",
                description: "Product description",
                imagePath: "/products/ecc8329b-eb39-4990-b66b-fcc9044647b6-EBOOK1.png"
            }
        },
    ]
} satisfies OrderHistoryProps

export default OrderHistoryEmail