import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import DoctorDirectory from "@/pages/DoctorDirectory";
import DoctorProfile from "@/pages/DoctorProfile";
import DoctorProfileEdit from "@/pages/DoctorProfileEdit";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Quizzes from "@/pages/Quizzes";
import QuizTake from "@/pages/QuizTake";
import Jobs from "@/pages/Jobs";
import AITools from "@/pages/AITools";
import ResearchServices from "@/pages/ResearchServices";
import Masterclasses from "@/pages/Masterclasses";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/directory" component={DoctorDirectory} />
      <Route path="/doctor/:id/edit" component={DoctorProfileEdit} />
      <Route path="/doctor/:id" component={DoctorProfile} />
      <Route path="/courses" component={Courses} />
      <Route path="/course/:id" component={CourseDetail} />
      <Route path="/quizzes" component={Quizzes} />
      <Route path="/quiz/:id" component={QuizTake} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/ai-tools" component={AITools} />
      <Route path="/research-services" component={ResearchServices} />
      <Route path="/masterclasses" component={Masterclasses} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
