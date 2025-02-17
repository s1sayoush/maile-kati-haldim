"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Line, Doughnut } from "recharts";
import { Trophy, Code, Timer, Star } from "lucide-react";
import { useUser } from "@/providers/UserContext";
import NotificationBanner from "./NotificationBanner";

// const ComingSoonOverlay = ({ children }: any) => (
//   <div className="relative group">
//     <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-90">
//       <Badge variant="outline" className="bg-background/50">
//         Coming Soon
//       </Badge>
//     </div>
//     <div className="opacity-50">{children}</div>
//   </div>
// );
const DashboardHome = () => {
  const { userDetails, loading } = useUser();
  console.log("userDetails", JSON.stringify(userDetails, null, 2));

  const profileComplelted = userDetails?.profileCompleted;

  // Sample data for multiple children
  const childrenProgress = [
    {
      id: 1,
      name: "Emma",
      age: 10,
      currentCourse: "Python Basics",
      coursesCompleted: 3,
      projectsCompleted: 8,
      weeklyProgress: [2, 3, 4, 3, 5, 4, 6],
      skills: {
        logic: 75,
        creativity: 85,
        problemSolving: 70,
        collaboration: 80,
      },
      achievements: ["First Code", "Bug Hunter", "Team Player"],
    },
    {
      id: 2,
      name: "Lucas",
      age: 8,
      currentCourse: "Scratch Adventures",
      coursesCompleted: 2,
      projectsCompleted: 5,
      weeklyProgress: [1, 2, 3, 4, 3, 5, 4],
      skills: {
        logic: 65,
        creativity: 90,
        problemSolving: 60,
        collaboration: 85,
      },
      achievements: ["Creative Coder", "Perfect Attendance"],
    },
  ];

  const recentActivities = [
    {
      id: 1,
      childName: "Emma",
      activity: "Completed 'Functions & Loops' lesson",
      date: "2 hours ago",
    },
    {
      id: 2,
      childName: "Lucas",
      activity: "Created a new Scratch game",
      date: "Yesterday",
    },
    {
      id: 3,
      childName: "Emma",
      activity: "Earned 'Bug Hunter' badge",
      date: "2 days ago",
    },
  ];

  const ChildProgressCard = ({ child }) => (
    <Card className="w-full">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{child.name}&apos;s Progress</h3>
          <Badge variant="secondary">{child.age} years old</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span className="text-sm">
              Currently learning: {child.currentCourse}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">{child.coursesCompleted}</p>
                <p className="text-xs text-muted-foreground">
                  Courses Complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{child.projectsCompleted}</p>
                <p className="text-xs text-muted-foreground">Projects Built</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Skills Progress</p>
            {Object.entries(child.skills).map(([skill, value]) => (
              <div key={skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize">{skill}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-3 sm:p-6 space-y-6 bg-background min-h-screen relative">
      {!profileComplelted && !loading && (
        <NotificationBanner
          variant="secondary"
          message="Welcome to our new platform! Complete your profile"
          link="/dashboard/profile"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {childrenProgress.map((child) => (
          <ChildProgressCard key={child.id} child={child} />
        ))}
      </div>

      <Card className="w-full">
        <CardHeader className="p-4">
          <h3 className="text-lg font-medium">Recent Activities</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ul className="space-y-3">
            {recentActivities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-accent/50"
              >
                <div>
                  <span className="font-medium text-sm">
                    {activity.childName}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {activity.activity}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.date}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="p-4">
          <h3 className="text-lg font-medium">Upcoming Classes</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">
                    Python: Functions Deep Dive
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Emma&apos;s next class
                  </p>
                </div>
              </div>
              <Badge>Tomorrow 4:00 PM</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Scratch: Game Design</p>
                  <p className="text-xs text-muted-foreground">
                    Lucas&apos;s next class
                  </p>
                </div>
              </div>
              <Badge>Thursday 3:30 PM</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
