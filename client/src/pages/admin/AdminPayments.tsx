import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, CreditCard, RefreshCw, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

type PaymentStats = {
  totalRevenue: number;
  totalPaid: number;
  totalFree: number;
  totalRefunded: number;
  recentTransactions: Array<{
    id: number;
    userId: number;
    courseId: number;
    courseTitle: string;
    userName: string;
    paymentStatus: string;
    paymentId: string | null;
    enrolledAt: string;
    coursePrice: number;
  }>;
  revenueByStatus: {
    paid: number;
    free: number;
    refunded: number;
  };
};

export default function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: stats, isLoading } = useQuery<PaymentStats>({
    queryKey: ['/api/admin/payments/stats'],
  });

  const filteredTransactions = stats?.recentTransactions?.filter(t => 
    statusFilter === 'all' || t.paymentStatus === statusFilter
  ) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payment Reports</h1>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading payment data...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-revenue">
                  ₹{stats ? stats.totalRevenue.toLocaleString() : '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From paid enrollments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Enrollments</CardTitle>
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-paid-count">
                  {stats ? stats.totalPaid : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Successful payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Free Enrollments</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-free-count">
                  {stats ? stats.totalFree : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  No payment required
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Refunded</CardTitle>
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-refunded-count">
                  {stats ? stats.totalRefunded : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Payment reversed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">User</th>
                      <th className="p-2 text-left">Course</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t">
                        <td className="p-2">
                          {format(new Date(transaction.enrolledAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="p-2">{transaction.userName}</td>
                        <td className="p-2">{transaction.courseTitle}</td>
                        <td className="p-2">
                          {transaction.paymentStatus === 'paid' ? `₹${transaction.coursePrice.toLocaleString()}` : '₹0'}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.paymentStatus === 'refunded'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.paymentStatus}
                          </span>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {transaction.paymentId || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
