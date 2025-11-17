'use client';
import { Sparkles } from 'lucide-react';
import ProjectCard from './ProjectCard';

const projects = [
    {
      title: 'Adicorp',
      description: 'A comprehensive Human Resource Management System (HRMS) designed to streamline and automate critical HR processes including employee management, attendance tracking, and salary calculation. Built for efficiency and scalability.',
      image: '/projects/adicorp.png',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      github: 'https://github.com/adilmunawar/Adicorp',
      live: 'https://adicorp.vercel.app',
      mermaidCode: `
        flowchart TB
            subgraph "UI Layer" 
                direction TB
                subgraph "Pages (src/pages)"
                    direction TB
                    Index["Index.tsx"]:::ui
                    AuthPage["Auth.tsx"]:::ui
                    DashboardPage["Dashboard.tsx"]:::ui
                    AttendancePage["Attendance.tsx"]:::ui
                    EmployeesPage["Employees.tsx"]:::ui
                    ReportsPage["Reports.tsx"]:::ui
                    SalaryPage["Salary.tsx"]:::ui
                    SettingsPage["Settings.tsx"]:::ui
                    NotFoundPage["NotFound.tsx"]:::ui
                end
                subgraph "Domain Components (src/components)"
                    direction TB
                    AuthForm["AuthForm.tsx"]:::ui
                    AttendanceTable["AttendanceTable.tsx"]:::ui
                    CompanySetupForm["CompanySetupForm.tsx"]:::ui
                    CompanySetupModal["CompanySetupModal.tsx"]:::ui
                    EmployeeList["EmployeeList.tsx"]:::ui
                    EmployeeForm["EmployeeForm.tsx"]:::ui
                    Header["Header.tsx"]:::ui
                    Sidebar["Sidebar.tsx"]:::ui
                    DashboardLayout["Dashboard.tsx"]:::ui
                    PrivateRouteGuard["PrivateRoute.tsx"]:::ui
                end
                subgraph "UI Primitives (src/components/ui)"
                    direction TB
                    UIPrimitives["UI Primitives"]:::ui
                end
            end

            subgraph "State & Services" 
                direction TB
                AuthContext["AuthContext.tsx"]:::svc
                subgraph "Hooks (src/hooks)"
                    direction TB
                    UseMobile["use-mobile.tsx"]:::svc
                    UseToast["use-toast.ts"]:::svc
                end
                subgraph "Utils"
                    direction TB
                    GeneralUtils["utils.ts"]:::svc
                    CacheUtils["cache.ts"]:::svc
                    SalaryUtils["salaryCalculations.ts"]:::svc
                end
            end

            subgraph "Data Integration (Orange)" 
                direction TB
                SupabaseClient["client.ts"]:::int
                SupabaseTypes["types.ts"]:::int
                SharedTypes["supabase.ts"]:::int
            end

            subgraph "Build & Static Assets"
                direction TB
                MainTSX["main.tsx"]:::build
                ViteConfig["vite.config.ts"]:::build
                TailwindConfig["tailwind.config.ts"]:::build
                IndexHTML["index.html"]:::build
                PublicAssets["public/"]:::build
            end

            subgraph "External Services"
                direction TB
                Supabase["Supabase"]:::ext
            end

            %% Relationships
            Index -->|renders| AuthForm
            AuthPage -->|renders| AuthForm
            DashboardPage -->|renders| DashboardLayout
            AttendancePage -->|renders| AttendanceTable
            EmployeesPage -->|renders| EmployeeList
            ReportsPage -->|uses| UIPrimitives
            SalaryPage -->|uses| UIPrimitives
            SettingsPage -->|uses| UIPrimitives

            AuthForm -->|uses| UIPrimitives
            AttendanceTable -->|uses| UIPrimitives
            CompanySetupForm -->|uses| UIPrimitives
            CompanySetupModal -->|uses| UIPrimitives
            EmployeeList -->|uses| UIPrimitives
            EmployeeForm -->|uses| UIPrimitives
            Header -->|uses| UIPrimitives
            Sidebar -->|uses| UIPrimitives
            DashboardLayout -->|uses| UIPrimitives
            PrivateRouteGuard -->|uses| UIPrimitives
            

            AuthForm -->|reads/writes| AuthContext
            PrivateRouteGuard -->|reads| AuthContext

            DashboardLayout -->|calls| SupabaseClient
            AuthContext -->|calls| SupabaseClient
            AttendanceTable -->|calls| SupabaseClient
            EmployeeList -->|calls| SupabaseClient

            SupabaseClient -->|API calls| Supabase

            %% Click Events
            click Index "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Index.tsx" _blank
            click AuthPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Auth.tsx" _blank
            click DashboardPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Dashboard.tsx" _blank
            click AttendancePage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Attendance.tsx" _blank
            click EmployeesPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Employees.tsx" _blank
            click ReportsPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Reports.tsx" _blank
            click SalaryPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Salary.tsx" _blank
            click SettingsPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/Settings.tsx" _blank
            click NotFoundPage "https://github.com/adilmunawar/adicorp/blob/main/src/pages/NotFound.tsx" _blank

            click AuthForm "https://github.com/adilmunawar/adicorp/blob/main/src/components/auth/AuthForm.tsx" _blank
            click AttendanceTable "https://github.com/adilmunawar/adicorp/blob/main/src/components/attendance/AttendanceTable.tsx" _blank
            click CompanySetupForm "https://github.com/adilmunawar/adicorp/blob/main/src/components/company/CompanySetupForm.tsx" _blank
            click CompanySetupModal "https://github.com/adilmunawar/adicorp/blob/main/src/components/company/CompanySetupModal.tsx" _blank
            click EmployeeList "https://github.com/adilmunawar/adicorp/blob/main/src/components/employees/EmployeeList.tsx" _blank
            click EmployeeForm "https://github.com/adilmunawar/adicorp/blob/main/src/components/employees/EmployeeForm.tsx" _blank
            click Header "https://github.com/adilmunawar/adicorp/blob/main/src/components/layout/Header.tsx" _blank
            click Sidebar "https://github.com/adilmunawar/adicorp/blob/main/src/components/layout/Sidebar.tsx" _blank
            click DashboardLayout "https://github.com/adilmunawar/adicorp/blob/main/src/components/layout/Dashboard.tsx" _blank
            click PrivateRouteGuard "https://github.com/adilmunawar/adicorp/blob/main/src/components/layout/PrivateRoute.tsx" _blank

            click UIPrimitives "https://github.com/adilmunawar/adicorp/tree/main/src/components/ui" _blank

            click AuthContext "https://github.com/adilmunawar/adicorp/blob/main/src/context/AuthContext.tsx" _blank
            click UseMobile "https://github.com/adilmunawar/adicorp/blob/main/src/hooks/use-mobile.tsx" _blank
            click UseToast "https://github.com/adilmunawar/adicorp/blob/main/src/hooks/use-toast.ts" _blank

            click GeneralUtils "https://github.com/adilmunawar/adicorp/blob/main/src/lib/utils.ts" _blank
            click CacheUtils "https://github.com/adilmunawar/adicorp/blob/main/src/utils/cache.ts" _blank
            click SalaryUtils "https://github.com/adilmunawar/adicorp/blob/main/src/utils/salaryCalculations.ts" _blank

            click SupabaseClient "https://github.com/adilmunawar/adicorp/blob/main/src/integrations/supabase/client.ts" _blank
            click SupabaseTypes "https://github.com/adilmunawar/adicorp/blob/main/src/integrations/supabase/types.ts" _blank
            click SharedTypes "https://github.com/adilmunawar/adicorp/blob/main/src/types/supabase.ts" _blank

            click MainTSX "https://github.com/adilmunawar/adicorp/blob/main/src/main.tsx" _blank
            click ViteConfig "https://github.com/adilmunawar/adicorp/blob/main/vite.config.ts" _blank
            click TailwindConfig "https://github.com/adilmunawar/adicorp/blob/main/tailwind.config.ts" _blank
            click IndexHTML "https://github.com/adilmunawar/adicorp/blob/main/index.html" _blank
            click PublicAssets "https://github.com/adilmunawar/adicorp/tree/main/public/" _blank

            classDef ui fill:#D0E8FF,stroke:#0366d6,color:#000,stroke-width:2px;
            classDef svc fill:#e0f7e0,stroke:#2e7d32,color:#000,stroke-width:2px;
            classDef int fill:#ffe0b2,stroke:#ef6c00,color:#000,stroke-width:2px;
            classDef ext fill:#e1bee7,stroke:#6a1b9a,color:#000,stroke-width:2px;
            classDef build fill:#f0f0f0,stroke:#888,color:#000,stroke-width:2px;
      `,
      animationOrder: [
        'AuthPage', 'AuthForm', 'AuthContext', 'SupabaseClient', 'Supabase'
      ],
    },
    {
      title: 'AdiNox',
      description: 'An open-source Android authenticator app supporting TOTP and HOTP algorithms. It features a high-quality, animated UI for a seamless and secure user experience.',
      image: '/projects/adinox.png',
      tech: ['Android', 'Java', '2FA', 'Security'],
      github: 'https://github.com/adilmunawar/adinox',
      live: 'https://adinox.vercel.app',
      mermaidCode: null,
      animationOrder: [],
    },
    {
      title: 'AdiGon',
      description: 'An advanced AI assistant with a specialized \'developer mode\' and multi-file format capabilities. It can understand and respond to multiple file formats, making it a versatile tool.',
      image: '/projects/adigon.png',
      tech: ['Python', 'AI', 'Gemini API', 'Next.js'],
      github: 'https://github.com/adilmunawar/adigon',
      live: 'https://adigon.vercel.app',
      mermaidCode: null,
      animationOrder: [],
    },
    {
      title: 'AdiFlux',
      description: 'An AI-powered web application for generating high-quality images from text prompts. It allows users to create new, unique images directly from text, opening up endless creative possibilities.',
      image: '/projects/adiflux.png',
      tech: ['Next.js', 'AI', 'Image Generation', 'Vercel'],
      github: 'https://github.com/adilmunawar/adiflux',
      live: 'https://adiflux.vercel.app',
      mermaidCode: null,
      animationOrder: [],
    },
    {
      title: 'AdiTron (AditronDev)',
      description: 'A modern social chatting application built with TypeScript. It focuses on a high-standard UI/UX and sophisticated features for seamless, real-time social interaction.',
      image: '/projects/aditron.png',
      tech: ['TypeScript', 'React', 'WebSockets', 'UI/UX'],
      github: 'https://github.com/adilmunawar/aditron',
      live: 'https://aditron.vercel.app',
      mermaidCode: null,
      animationOrder: [],
    },
    {
      title: 'Adify',
      description: 'An intelligent resume builder that leverages the Gemini API to help users create professional, polished resumes. It can assist with wording, formatting, and tailoring your resume to specific job descriptions.',
      image: '/projects/adify.png',
      tech: ['Gemini API', 'AI', 'Resume', 'React'],
      github: 'https://github.com/adilmunawar/adify',
      live: 'https://adify.vercel.app',
      mermaidCode: null,
      animationOrder: [],
    }
  ];

const ProjectsSection = () => {
  return (
    <section id="projects" className="min-h-screen py-20 px-4 relative bg-cyber-dark">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-8">
            <span className="text-gray-400 text-sm font-semibold tracking-widest uppercase bg-cyber-purple/5 px-6 py-3 rounded-full border border-cyber-purple/20 backdrop-blur-sm animate-pulse-slow">
              <Sparkles className="inline w-4 h-4 mr-2 text-cyber-purple animate-pulse" />
              Featured Work
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow drop-shadow-2xl">
            My Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Explore my latest creations showcasing modern web technologies, 
            <span className="text-gray-300 font-semibold"> innovative solutions</span>, and 
            cutting-edge design principles
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
