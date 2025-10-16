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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";

export function MedicalHistory({ patientId }: { patientId: string }) {
  const { medicalRecords, addMedicalRecord, user } = useAppContext();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const patientRecords = medicalRecords
    .filter((r) => r.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>
            Past diagnoses, prescriptions and consultation notes.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Medical Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Diagnosis</label>
                <Input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prescription</label>
                <Input
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter prescription"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter consultation notes"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (!diagnosis) return;
                    addMedicalRecord({
                      patientId,
                      diagnosis,
                      notes,
                      doctorName: user.name,
                      prescription,
                    });
                    setDiagnosis("");
                    setPrescription("");
                    setNotes("");
                    setOpen(false);
                    toast({
                      title: "Record Added",
                      description: "New medical record has been saved.",
                    });
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Prescription</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientRecords.length > 0 ? (
              patientRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.diagnosis}
                  </TableCell>
                  <TableCell>{record.doctorName}</TableCell>
                  <TableCell>{record.prescription}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.notes}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No medical records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
