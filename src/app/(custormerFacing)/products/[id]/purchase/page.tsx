import prisma from '@/db/db'
import { notFound } from 'next/navigation'
import Stripe from "stripe"
import CheckoutForm from './_components/CheckoutForm'

type PurchasePageProps = {
    params: {
        id: string
    }
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export default async function PurchasePage({params}: PurchasePageProps) {
    const { id } = await params
    const product = await prisma.product.findUnique({
        where: { id }
    })
    if(product == null) return notFound()
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceInCents,
        currency: "USD",
        metadata: { productId: product.id }
    })
    if(paymentIntent.client_secret == null) {
        throw Error("Payment intent creation error!")
    }

    return (
        <CheckoutForm product={product} clientSecret={paymentIntent.client_secret} />
    )
}
