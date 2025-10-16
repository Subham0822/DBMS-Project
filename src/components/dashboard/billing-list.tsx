"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import type { Bill } from "@/lib/types";
import { MoreHorizontal, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const getStatusVariant = (status: Bill["status"]) => {
  switch (status) {
    case "Paid":
      return "secondary";
    case "Pending":
      return "default";
    case "Overdue":
      return "destructive";
    default:
      return "outline";
  }
};

export function BillingList() {
  const { bills, role, user, generateBill, payBill } = useAppContext();
  const { toast } = useToast();

  const filteredBills = bills
    .filter((b) => role === "admin" || b.patientName === user.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>A record of your medical bills.</CardDescription>
        </div>
        {role === "admin" && (
          <Button
            size="sm"
            onClick={() => {
              generateBill({
                patientName: user.name,
                amount: Math.round(Math.random() * 300 + 50),
              });
              toast({
                title: "Bill Generated",
                description: "A new bill has been added.",
              });
            }}
          >
            Generate Bill
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              {role === "admin" && <TableHead>Patient</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">
                    {bill.id.toUpperCase()}
                  </TableCell>
                  {role === "admin" && (
                    <TableCell>{bill.patientName}</TableCell>
                  )}
                  <TableCell>
                    {format(new Date(bill.date), "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        {bill.status === "Pending" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              payBill(bill.id);
                              toast({
                                title: "Payment Successful",
                                description: `Bill ${bill.id.toUpperCase()} marked as Paid.`,
                              });
                            }}
                          >
                            Pay Now
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={role === "admin" ? 6 : 5}
                  className="h-24 text-center"
                >
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
