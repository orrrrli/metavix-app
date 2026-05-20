"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Save, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const recordSchema = z.object({
  fastingGlucose: z.coerce.number().min(20, "Value too low").max(600, "Value too high").nullable().optional(),
  postprandial1hGlucose: z.coerce.number().min(20).max(600).nullable().optional(),
  postprandial2hGlucose: z.coerce.number().min(20).max(600).nullable().optional(),
  systolicBP: z.coerce.number().min(50).max(250).nullable().optional(),
  diastolicBP: z.coerce.number().min(30).max(150).nullable().optional(),
  heartRate: z.coerce.number().min(30).max(220).nullable().optional(),
  weightKg: z.coerce.number().min(20).max(300).nullable().optional(),
  notes: z.string().nullable().optional(),
  symptoms: z.string().nullable().optional(),
}).refine(data => {
  return data.fastingGlucose || data.systolicBP || data.heartRate || data.weightKg;
}, {
  message: "Please enter at least one metric to save a record.",
  path: ["root"]
});

type RecordFormValues = z.infer<typeof recordSchema>;

export default function NewRecordPage() {
  const router = useRouter();
  const { userId } = useAuthStore();
  const { addRecord } = useMockDb();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema) as any,
    defaultValues: {
      fastingGlucose: undefined,
      postprandial1hGlucose: undefined,
      postprandial2hGlucose: undefined,
      systolicBP: undefined,
      diastolicBP: undefined,
      heartRate: undefined,
      weightKg: undefined,
      notes: "",
      symptoms: ""
    }
  });

  const onSubmit = async (data: RecordFormValues) => {
    if (!userId) return;
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    addRecord({
      id: `rec-${Date.now()}`,
      patientId: userId,
      timestamp: new Date().toISOString(),
      fastingGlucose: data.fastingGlucose || null,
      postprandial1hGlucose: data.postprandial1hGlucose || null,
      postprandial2hGlucose: data.postprandial2hGlucose || null,
      systolicBP: data.systolicBP || null,
      diastolicBP: data.diastolicBP || null,
      heartRate: data.heartRate || null,
      hba1c: null,
      ldl: null,
      triglycerides: null,
      weightKg: data.weightKg || null,
      notes: data.notes || null,
      symptoms: data.symptoms || null,
      medicationComments: null,
    });

    setIsSubmitting(false);
    toast.success("Health record saved successfully!");
    router.push("/patient/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Log New Reading</h2>
        <p className="text-muted-foreground mt-1">Enter your latest clinical metrics. Only fill out what you have measured today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg flex items-center mb-6">
            <AlertCircle className="size-4 mr-2" />
            {errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Glucose (mg/dL)</CardTitle>
              <CardDescription>Blood sugar measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fastingGlucose">Fasting Glucose</Label>
                <Input id="fastingGlucose" type="number" step="0.1" placeholder="e.g. 105" {...register("fastingGlucose")} />
                {errors.fastingGlucose && <p className="text-sm text-destructive">{errors.fastingGlucose.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postprandial1hGlucose">1-Hour Postprandial</Label>
                <Input id="postprandial1hGlucose" type="number" step="0.1" placeholder="e.g. 140" {...register("postprandial1hGlucose")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postprandial2hGlucose">2-Hour Postprandial</Label>
                <Input id="postprandial2hGlucose" type="number" step="0.1" placeholder="e.g. 120" {...register("postprandial2hGlucose")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cardiovascular</CardTitle>
              <CardDescription>Blood pressure and heart rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolicBP">Systolic (mmHg)</Label>
                  <Input id="systolicBP" type="number" placeholder="120" {...register("systolicBP")} />
                  {errors.systolicBP && <p className="text-sm text-destructive">{errors.systolicBP.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolicBP">Diastolic (mmHg)</Label>
                  <Input id="diastolicBP" type="number" placeholder="80" {...register("diastolicBP")} />
                  {errors.diastolicBP && <p className="text-sm text-destructive">{errors.diastolicBP.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input id="heartRate" type="number" placeholder="e.g. 72" {...register("heartRate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input id="weightKg" type="number" step="0.1" placeholder="e.g. 75.5" {...register("weightKg")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms (comma separated)</Label>
              <Input id="symptoms" placeholder="e.g. Dizziness, Thirsty, Headache" {...register("symptoms")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Input id="notes" placeholder="Any comments for your doctor?" {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Saving..." : "Save Record"}
            {!isSubmitting && <Save className="ml-2 size-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
