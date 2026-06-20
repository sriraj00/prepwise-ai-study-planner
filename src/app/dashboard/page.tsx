import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Middleware will handle redirect
  }

  const { data: plans, error } = await supabase
    .from("study_plans")
    .select("*")
    .order("created_at", { ascending: false });

  const totalPlans = plans?.length || 0;
  
  // Calculate upcoming exams (exams in the future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingExams = plans?.filter(plan => {
    const examDate = new Date(plan.exam_date);
    return examDate >= today;
  }).length || 0;

  const recentPlans = plans?.slice(0, 3) || [];

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here is an overview of your study plans.</p>
        </div>
        <Link href="/generate">
          <Button>Create New Plan</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Plans Created</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPlans.length} plans</div>
            <p className="text-xs text-muted-foreground">Generated recently</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Recent Plans</h2>
        {recentPlans.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPlans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{plan.subject}</CardTitle>
                  <CardDescription>
                    Exam: {new Date(plan.exam_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {plan.topics}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href={`/plans`}>
                    <Button variant="outline" className="w-full gap-2">
                      View Details <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-xl border-dashed">
            <h3 className="text-lg font-medium mb-2">No plans found</h3>
            <p className="text-muted-foreground mb-4">You haven&apos;t created any study plans yet.</p>
            <Link href="/generate">
              <Button>Create Your First Plan</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
