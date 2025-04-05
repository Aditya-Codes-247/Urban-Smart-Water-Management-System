"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { generateSensorData, formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function BillingPage({ params }: { params: { role: string } }) {
  const { role } = params
  const { toast } = useToast()
  const [billingData, setBillingData] = useState<any[]>([])
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  useEffect(() => {
    // Generate simulated billing data
    setBillingData(generateSensorData("billing", 6))
  }, [])

  const handlePayBill = (billId: string) => {
    setIsPaymentProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setBillingData((prev) => prev.map((bill) => (bill.id === billId ? { ...bill, status: "Paid" } : bill)))

      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      })

      setIsPaymentProcessing(false)
    }, 2000)
  }

  const handleDownloadInvoice = (billId: string) => {
    toast({
      title: "Invoice downloaded",
      description: "Your invoice has been downloaded successfully.",
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Billing & Payments</h1>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Bill</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Billing Period</CardTitle>
              <CardDescription>
                {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                    <p className="text-4xl font-bold">{formatCurrency(role === "industrial" ? 1284.7 : 42.7)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <p className="text-xl">
                      {new Date(new Date().setDate(new Date().getDate() + 15)).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                      <p className="text-yellow-500 font-medium">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Consumption Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Water Usage</p>
                      <p className="text-lg font-medium">{role === "industrial" ? "12,847" : "427"} gallons</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rate</p>
                      <p className="text-lg font-medium">${role === "industrial" ? "0.10" : "0.08"} per gallon</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Base Fee</p>
                      <p className="text-lg font-medium">${role === "industrial" ? "50.00" : "15.00"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxes & Fees</p>
                      <p className="text-lg font-medium">${role === "industrial" ? "150.00" : "8.54"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => handlePayBill("current")}
                disabled={isPaymentProcessing}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isPaymentProcessing ? "Processing..." : "Pay Now"}
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleDownloadInvoice("current")}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your past water bills and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Period</th>
                      <th className="p-2 text-left font-medium">Amount</th>
                      <th className="p-2 text-left font-medium">Consumption</th>
                      <th className="p-2 text-left font-medium">Due Date</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingData.map((bill) => (
                      <tr key={bill.id} className="border-b">
                        <td className="p-2">{bill.period}</td>
                        <td className="p-2">{formatCurrency(bill.amount)}</td>
                        <td className="p-2">{bill.consumption} gallons</td>
                        <td className="p-2">{new Date(bill.dueDate).toLocaleDateString()}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            {bill.status === "Paid" ? (
                              <>
                                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Paid</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Unpaid</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          {bill.status === "Unpaid" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePayBill(bill.id)}
                              disabled={isPaymentProcessing}
                            >
                              Pay Now
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(bill.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Methods</AlertTitle>
          <AlertDescription>
            We accept credit/debit cards, bank transfers, and online payment services. All transactions are secure and
            encrypted.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

