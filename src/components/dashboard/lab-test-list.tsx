'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';
import type { LabTest } from '@/lib/types';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const getStatusVariant = (status: LabTest['status']) => {
  switch (status) {
    case 'Completed':
      return 'secondary';
    case 'Pending':
      return 'default';
    default:
      return 'outline';
  }
};

export function LabTestList() {
  const { labTests, role, user } = useAppContext();

  const filteredTests = labTests
    .filter(test => {
        if (role === 'admin') return true;
        // In a real app, doctor would see tests for their patients only
        if (role === 'doctor') return true; 
        if (role === 'patient' && test.patientName === user.name) return true;
        return false;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row justify-between items-center">
        <div>
            <CardTitle>Lab Test Records</CardTitle>
            <CardDescription>A log of all requested and completed lab tests.</CardDescription>
        </div>
        {role === 'patient' && (
             <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Request New Test
            </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              {role !== 'patient' && <TableHead>Patient</TableHead>}
              <TableHead>Test Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.id.toUpperCase()}</TableCell>
                  {role !== 'patient' && <TableCell>{test.patientName}</TableCell>}
                  <TableCell>{test.testName}</TableCell>
                  <TableCell>{new Date(test.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(test.status)}>{test.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {role === 'admin' || role === 'doctor' ? (
                            <>
                                <DropdownMenuItem disabled={test.status === 'Completed'}>Mark as Completed</DropdownMenuItem>
                                <DropdownMenuItem>Update Result</DropdownMenuItem>
                            </>
                        ) : null}
                        {test.status === 'Completed' && <DropdownMenuItem>View Result</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={role === 'patient' ? 5 : 6} className="h-24 text-center">
                  No lab tests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
