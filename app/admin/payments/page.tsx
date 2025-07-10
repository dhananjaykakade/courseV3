"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "@/components/ui/use-toast";

interface PaymentRow {
  order_id: string;
  payment_id: string;
  amount: number;
  status: string;
  created_at: string;
  user: { id: string; email: string; name: string };
  course: { id: string; title: string };
}

export default function PaymentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/home");
      return;
    }
    fetchData();
  }, [user, loading]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/payments", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
        setTotal(data.totalAmount);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to load payments", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="p-4">Loading…</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payments
              <Badge variant="secondary">Total ₹{total.toLocaleString()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Payment ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.order_id}>
                    <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                    <TableCell>{p.user?.email}</TableCell>
                    <TableCell>{p.course?.title}</TableCell>
                    <TableCell>{p.amount}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "success" ? "secondary" : "destructive"}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{p.order_id}</TableCell>
                    <TableCell className="text-xs">{p.payment_id ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
