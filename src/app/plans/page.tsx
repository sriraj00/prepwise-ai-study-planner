"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Trash2, Edit, Loader2, Calendar as CalendarIcon, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Plan = {
  id: string;
  subject: string;
  topics: string;
  exam_date: string;
  generated_plan: string;
  created_at: string;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_asc");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      const result = await response.json();
      if (result.success) {
        setPlans(result.plans);
      } else {
        toast.error("Failed to load plans");
      }
    } catch (error) {
      toast.error("Error loading plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success("Plan deleted successfully");
        setPlans(plans.filter(p => p.id !== id));
      } else {
        toast.error("Failed to delete plan");
      }
    } catch (error) {
      toast.error("Error deleting plan");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredPlans = plans
    .filter(plan => 
      plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plan.topics.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date_asc") return new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
      if (sortBy === "date_desc") return new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime();
      if (sortBy === "created_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Study Plans</h1>
        <p className="text-muted-foreground">Manage and review all your saved study plans.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search subject or topics..." 
            className="pl-9 bg-white dark:bg-slate-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "date_asc")}>
            <SelectTrigger className="bg-white dark:bg-slate-950">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_asc">Exam Date (Closest)</SelectItem>
              <SelectItem value="date_desc">Exam Date (Furthest)</SelectItem>
              <SelectItem value="created_desc">Recently Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-xl">
          <h3 className="text-lg font-medium mb-2">No plans found</h3>
          <p className="text-muted-foreground">We couldn&apos;t find any study plans matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map(plan => (
            <Card key={plan.id} className="flex flex-col hover:shadow-md transition-shadow group">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="line-clamp-1 flex-1" title={plan.subject}>{plan.subject}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 -mt-2 -mr-2"
                    onClick={() => handleDelete(plan.id)}
                    disabled={isDeleting === plan.id}
                  >
                    {isDeleting === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(plan.exam_date), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {plan.topics}
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <BookOpen className="h-4 w-4" /> View Full Plan
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>{plan.subject}</DialogTitle>
                      <DialogDescription>
                        Exam Date: {format(new Date(plan.exam_date), "PPP")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md border font-mono text-sm whitespace-pre-wrap">
                      {plan.generated_plan}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
