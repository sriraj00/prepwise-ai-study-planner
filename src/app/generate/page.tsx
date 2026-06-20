"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generatePlanSchema, type GeneratePlanFormData } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function GeneratePlanPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneratePlanFormData>({
    resolver: zodResolver(generatePlanSchema),
  });

  const examDate = watch("examDate");

  const onGenerate = async (data: GeneratePlanFormData) => {
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedPlan(result.plan);
        toast.success("Study plan generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate plan");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSave = async () => {
    if (!generatedPlan) return;

    setIsSaving(true);
    const data = watch();

    try {
      const response = await fetch("/api/save-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: data.subject,
          topics: data.topics,
          examDate: data.examDate,
          generated_plan: generatedPlan,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Plan saved successfully!");
        router.push("/plans");
      } else {
        toast.error(result.error || "Failed to save plan");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Study Plan</h1>
        <p className="text-muted-foreground">Fill in the details below to generate an AI-powered study schedule.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>Provide information about your upcoming exam.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onGenerate)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Advanced Mathematics"
                  {...register("subject")}
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">Topics to Cover</Label>
                <Textarea
                  id="topics"
                  placeholder="e.g. Calculus, Linear Algebra, Differential Equations. Struggle most with Calculus."
                  {...register("topics")}
                  className={cn("min-h-[120px]", errors.topics ? "border-destructive" : "")}
                />
                {errors.topics && <p className="text-sm text-destructive">{errors.topics.message}</p>}
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="examDate">Exam Date</Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      "flex h-10 w-[240px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      !examDate && "text-muted-foreground",
                      errors.examDate && "border-destructive"
                    )}
                  >
                    {examDate ? format(examDate, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={examDate}
                      onSelect={(date) => setValue("examDate", date as Date, { shouldValidate: true })}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
                {errors.examDate && <p className="text-sm text-destructive">{errors.examDate.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate AI Plan
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col h-full max-h-[800px]">
          <CardHeader>
            <CardTitle>Generated Plan</CardTitle>
            <CardDescription>Your AI-generated schedule will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900/50 m-6 mt-0 rounded-lg border p-4">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Analyzing topics and creating the optimal schedule...</p>
              </div>
            ) : generatedPlan ? (
              <div className="whitespace-pre-wrap font-mono text-sm">
                {generatedPlan}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center">
                Fill the form and click generate to create your custom study plan.
              </div>
            )}
          </CardContent>
          {generatedPlan && (
            <CardFooter>
              <Button onClick={onSave} disabled={isSaving} className="w-full gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save This Plan
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
