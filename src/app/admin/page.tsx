import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import React from 'react'

const getSalesData = async() => {
    const data = await prisma.order.aggregate({
        _sum: {pricePaidInCents: true},
        _count: true
    })
    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}
const getUserData = async() => {
    const [userCount, orderData] = await Promise.all([
        prisma.user.count(),
        prisma.order.aggregate({
        _sum: {pricePaidInCents: true},
    })
    ])
    return {
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
    }
}
const getProductData = async() => {
    const [activeCount, inactiveCount] = await Promise.all([
        prisma.product.count({where: {isAvailableForPurchase: true}}),
        prisma.product.count({where: {isAvailableForPurchase: false}})
    ])
    return {activeCount, inactiveCount}
}
export default async function AdminDashboardPage() {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
            title='Sales'
            subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
            body={formatCurrency(salesData.amount)}
        />
        <DashboardCard
            title='Customer'
            subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`}
            body={formatNumber(userData.userCount)}
        />
        <DashboardCard
            title='Active Products'
            subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
            body={formatNumber(productData.activeCount)}
        />
    </div>
  )
}
type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
}
const DashboardCard = ({title, subtitle, body}: DashboardCardProps) => {
    return (
      <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>{body}</p>
        </CardContent>
      </Card>
    )
}