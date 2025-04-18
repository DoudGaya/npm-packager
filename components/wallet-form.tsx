"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { addCredits, getWalletBalance, getTransactions } from "@/app/actions/wallet/add-credits"
import { formatDate } from "@/lib/utils"

const walletFormSchema = z.object({
  amount: z.number().min(5, "Minimum amount is $5"),
  provider: z.enum(["STRIPE", "PAYPAL"]),
})

export function WalletForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [credits, setCredits] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const form = useForm<z.infer<typeof walletFormSchema>>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      amount: 10,
      provider: "STRIPE",
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        const balanceResult = await getWalletBalance()
        if (balanceResult.credits !== undefined) {
          setCredits(balanceResult.credits)
        }

        const transactionsResult = await getTransactions()
        if (transactionsResult.transactions) {
          setTransactions(transactionsResult.transactions)
        }
      } catch (error) {
        console.error("Error loading wallet data:", error)
        toast({
          title: "Error",
          description: "Failed to load wallet data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (values: z.infer<typeof walletFormSchema>) => {
    try {
      setIsLoading(true)

      // Calculate credits based on amount (1 credit = $0.05)
      const creditsToAdd = Math.floor(values.amount / 0.05)

      const result = await addCredits({
        amount: values.amount,
        // @ts-ignore
        credits: creditsToAdd,
        provider: values.provider,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
        return
      }

      toast({
        title: "Success",
        description: "Credits added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>Your current credit balance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-4xl font-bold">{credits} credits</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Credits</CardTitle>
          <CardDescription>Purchase credits to use for AI package generation</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        step={5}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      ${field.value} will add approximately {Math.floor(field.value / 0.05)} credits to your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="STRIPE" id="stripe" />
                          <Label htmlFor="stripe" className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            Credit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PAYPAL" id="paypal" />
                          <Label htmlFor="paypal" className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17.5 7H20.5C21.3 7 22 7.7 22 8.5C22 9.3 21.3 10 20.5 10H17.5C16.7 10 16 9.3 16 8.5C16 7.7 16.7 7 17.5 7Z" />
                              <path d="M2 16.5C2 15.7 2.7 15 3.5 15H14.5C15.3 15 16 15.7 16 16.5C16 17.3 15.3 18 14.5 18H3.5C2.7 18 2 17.3 2 16.5Z" />
                              <path d="M2 8.5C2 7.7 2.7 7 3.5 7H14.5C15.3 7 16 7.7 16 8.5C16 9.3 15.3 10 14.5 10H3.5C2.7 10 2 9.3 2 8.5Z" />
                            </svg>
                            PayPal
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Credits
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">
                      {transaction.type === "CREDIT_PURCHASE" ? "Credit Purchase" : "Subscription Payment"}
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.status === "completed" ? (
                        <span className="text-green-500">Completed</span>
                      ) : transaction.status === "pending" ? (
                        <span className="text-yellow-500">Pending</span>
                      ) : (
                        <span className="text-red-500">Failed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import type { User, Wallet, Transaction } from "@prisma/client"
// import { Loader2, CreditCard } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { toast } from "@/components/ui/use-toast"
// import { addCredits } from "@/app/actions/wallet/add-credits"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { formatDate } from "@/lib/utils"

// const addCreditsSchema = z.object({
//   amount: z.coerce.number().min(5, "Minimum amount is $5"),
//   provider: z.enum(["STRIPE", "PAYPAL"]),
// })

// interface WalletFormProps {
//   user: Pick<User, "id">
//   wallet: Wallet | null
//   transactions: Transaction[]
// }

// export function WalletForm({ user, wallet, transactions }: WalletFormProps) {
//   const [isLoading, setIsLoading] = useState(false)

//   const form = useForm<z.infer<typeof addCreditsSchema>>({
//     resolver: zodResolver(addCreditsSchema),
//     defaultValues: {
//       amount: 10,
//       provider: "STRIPE",
//     },
//   })

//   const onSubmit = async (values: z.infer<typeof addCreditsSchema>) => {
//     try {
//       setIsLoading(true)

//       const result = await addCredits(values)

//       if (result.error) {
//         toast({
//           title: "Error",
//           description: result.error,
//           variant: "destructive",
//         })
//         return
//       }

//       if (result.checkoutUrl) {
//         window.location.href = result.checkoutUrl
//         return
//       }

//       toast({
//         title: "Success",
//         description: "Credits added successfully",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add credits",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Wallet</CardTitle>
//           <CardDescription>Manage your credits and add funds to your wallet</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6">
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{wallet?.credits || 0}</div>
//                   <p className="text-xs text-muted-foreground">
//                     Credits are used for AI generations and package publishing
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">Balance</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">${wallet?.balance.toFixed(2) || "0.00"}</div>
//                   <p className="text-xs text-muted-foreground">Your current wallet balance</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="amount"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Amount</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min={5}
//                           step={5}
//                           placeholder="10"
//                           {...field}
//                           onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="provider"
//                   render={({ field }) => (
//                     <FormItem className="space-y-3">
//                       <FormLabel>Payment Method</FormLabel>
//                       <FormControl>
//                         <RadioGroup
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                           className="flex flex-col space-y-1"
//                         >
//                           <FormItem className="flex items-center space-x-3 space-y-0">
//                             <FormControl>
//                               <RadioGroupItem value="STRIPE" />
//                             </FormControl>
//                             <FormLabel className="font-normal flex items-center">
//                               <CreditCard className="mr-2 h-4 w-4" />
//                               Credit Card
//                             </FormLabel>
//                           </FormItem>
//                           <FormItem className="flex items-center space-x-3 space-y-0">
//                             <FormControl>
//                               <RadioGroupItem value="PAYPAL" />
//                             </FormControl>
//                             <FormLabel className="font-normal flex items-center">
//                               <svg
//                                 className="mr-2 h-4 w-4"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="24"
//                                 height="24"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M17.5 7H20.5C21.3 7 22 7.7 22 8.5C22 9.3 21.3 10 20.5 10H17.5C16.7 10 16 9.3 16 8.5C16 7.7 16.7 7 17.5 7Z" />
//                                 <path d="M2 16.5C2 15.7 2.7 15 3.5 15H14.5C15.3 15 16 15.7 16 16.5C16 17.3 15.3 18 14.5 18H3.5C2.7 18 2 17.3 2 16.5Z" />
//                                 <path d="M2 8.5C2 7.7 2.7 7 3.5 7H14.5C15.3 7 16 7.7 16 8.5C16 9.3 15.3 10 14.5 10H3.5C2.7 10 2 9.3 2 8.5Z" />
//                               </svg>
//                               PayPal
//                             </FormLabel>
//                           </FormItem>
//                         </RadioGroup>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Add Credits
//                 </Button>
//               </form>
//             </Form>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Transaction History</CardTitle>
//           <CardDescription>Your recent transactions</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {transactions.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Credits</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {transactions.map((transaction) => (
//                   <TableRow key={transaction.id}>
//                     <TableCell>{formatDate(transaction.createdAt)}</TableCell>
//                     <TableCell>{transaction.description}</TableCell>
//                     <TableCell>${transaction.amount.toFixed(2)}</TableCell>
//                     <TableCell>{transaction.credits}</TableCell>
//                     <TableCell>
//                       <span
//                         className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                           transaction.status === "completed"
//                             ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                             : transaction.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//                               : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
//                         }`}
//                       >
//                         {transaction.status}
//                       </span>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
//               <p className="text-sm text-muted-foreground">No transactions found</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
