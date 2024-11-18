import { Body, Container, Head, Heading, Html, Preview, Tailwind } from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"

type ReceiptProps = {
    product: {
        name: string
        imagePath: string
        description: string
    }
    order: {
        id: string
        createdAt: Date
        pricePaidInCents: number
    }
    downloadVerificationId: string
}

const PurchaseReceiptEmail = (data: ReceiptProps) => {
    const { product } = data
    return (
        <Html>
            <Preview>Download {product.name} and view receipt</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w=xl">
                        <Heading>Purchase Receipt</Heading>
                        <OrderInformation {...data}/>
                    </Container>
                </Body>
            </Tailwind>
        </Html>    
    )
}

PurchaseReceiptEmail.PreviewProps = {
    product: {
        name: "Product Name",
        description: "Product description",
        imagePath: "/products/ecc8329b-eb39-4990-b66b-fcc9044647b6-EBOOK1.png"
    },
    order: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 10000
    },
    downloadVerificationId: crypto.randomUUID()

} satisfies ReceiptProps

export default PurchaseReceiptEmail