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
import QuizLobby from "@/pages/QuizLobby";
import QuizPlay from "@/pages/QuizPlay";
import QuizResult from "@/pages/QuizResult";
import QuizTake from "@/pages/QuizTake";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import AITools from "@/pages/AITools";
import DiagnosisHelper from "@/pages/DiagnosisHelper";
import MedicalStatistics from "@/pages/MedicalStatistics";
import LiteratureSearch from "@/pages/LiteratureSearch";
import ResearchServices from "@/pages/ResearchServices";
import Masterclasses from "@/pages/Masterclasses";
import MasterclassDetail from "@/pages/MasterclassDetail";
import UserDashboard from "@/pages/UserDashboard";
import CourseLearning from "@/pages/CourseLearning";
import Certificates from "@/pages/Certificates";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminDoctors from "@/pages/admin/AdminDoctors";
import AdminHospitals from "@/pages/admin/AdminHospitals";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminCourseModules from "@/pages/admin/AdminCourseModules";
import AdminQuizzes from "@/pages/admin/AdminQuizzes";
import AdminMasterclasses from "@/pages/admin/AdminMasterclasses";
import AdminJobs from "@/pages/admin/AdminJobs";
import AdminAITools from "@/pages/admin/AdminAITools";
import AdminResearch from "@/pages/admin/AdminResearch";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminMessaging from "@/pages/admin/AdminMessaging";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminSettings from "@/pages/admin/AdminSettings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/dashboard/courses/:id" component={CourseLearning} />
      <Route path="/dashboard/certificates" component={Certificates} />
      <Route path="/directory" component={DoctorDirectory} />
      <Route path="/doctor/:id/edit" component={DoctorProfileEdit} />
      <Route path="/doctor/:id" component={DoctorProfile} />
      <Route path="/courses" component={Courses} />
      <Route path="/course/:id" component={CourseDetail} />
      <Route path="/quizzes" component={Quizzes} />
      <Route path="/quiz/:id/lobby" component={QuizLobby} />
      <Route path="/quiz/:id/play" component={QuizPlay} />
      <Route path="/quiz/:id/result" component={QuizResult} />
      <Route path="/quiz/:id" component={QuizTake} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/job/:id" component={JobDetail} />
      <Route path="/ai-tools" component={AITools} />
      <Route path="/ai-tools/diagnosis-helper" component={DiagnosisHelper} />
      <Route path="/ai-tools/medical-statistics" component={MedicalStatistics} />
      <Route path="/ai-tools/literature-search" component={LiteratureSearch} />
      <Route path="/research-services" component={ResearchServices} />
      <Route path="/masterclasses" component={Masterclasses} />
      <Route path="/masterclass/:id" component={MasterclassDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/doctors" component={AdminDoctors} />
      <Route path="/admin/hospitals" component={AdminHospitals} />
      <Route path="/admin/courses" component={AdminCourses} />
      <Route path="/admin/courses/:courseId/modules" component={AdminCourseModules} />
      <Route path="/admin/quizzes" component={AdminQuizzes} />
      <Route path="/admin/masterclasses" component={AdminMasterclasses} />
      <Route path="/admin/jobs" component={AdminJobs} />
      <Route path="/admin/ai-tools" component={AdminAITools} />
      <Route path="/admin/research" component={AdminResearch} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/messaging" component={AdminMessaging} />
      <Route path="/admin/payments" component={AdminPayments} />
      <Route path="/admin/settings" component={AdminSettings} />
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
