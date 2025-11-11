import { Column } from "@/components/custom/dataTable";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { Download, Edit, Trash2 } from "lucide-react";

export const TOKEN_COOKIE = "GIS_APP_TOKEN";

export const DASHBOARD_ROUTE = "/"
export const ADD_PROJECT = "/projects/add"
export const PROJECTS_ROUTE = "/projects"
export const MAP_ROUTE = "/map"
export const SETTING_ROUTE = "/settings"
export const UPLOAD_CSV = "/projects/upload"


export type IRoutes = {
  name: string;
  path?: string;
  lightIcon: string;
  darkIcon: string;
  onClick?: () => void;
}

export const ROUTES:IRoutes[] = [
  {
    name: "Dashboard",
    path: DASHBOARD_ROUTE,
    lightIcon: "/icons/dashboardWhite.png",
    darkIcon: "/icons/dashboard.png"
  },
  {
    name: "Add Project",
    path: ADD_PROJECT,
    lightIcon: "/icons/addWhite.png",
    darkIcon: "/icons/add.png"
  },
  {
    name: "Projects",
    path: PROJECTS_ROUTE,
    lightIcon: "/icons/projectsWhite.png",
    darkIcon: "/icons/projects.png"
  },
  {
    name: "Map Interface",
    path: MAP_ROUTE,
    lightIcon: "/icons/mapWhite.png",
    darkIcon: "/icons/map.png"
  },
]

export const SETTING_ROUTES:IRoutes[] = [
  {
    name: "Setting",
    path: SETTING_ROUTE,
    lightIcon: "/icons/settingWhite.png",
    darkIcon: "/icons/setting.png"
  },
  {
    name: "Logout",
    lightIcon: "/icons/logoutWhite.png",
    darkIcon: "/icons/logout.png",
    onClick: () => {}
  },
]

function getLast20Years() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < 20; i++) {
    years.push(currentYear - i);
  }

  return years;
}

export const YEARS_OPTIONS = getLast20Years().map((year) => ({
  label: year.toString(),
  value: year.toString(),
}))

export type Permit = {
  permit: string;
  year: number;
  town: string;
  startDate: string;
  endDate: string;
  restStart: string;
  restEnd: string;
  status: 'Completed' | 'In Progress';
};


export const DUMMY_DATA: Permit[] = [
  {
    permit: 'PRM-0092',
    year: 2023,
    town: 'Brooklyn',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    restStart: '2024-03-15',
    restEnd: '2024-03-15',
    status: 'Completed',
  },
  {
    permit: 'PRM-0092',
    year: 2023,
    town: 'Brooklyn',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    restStart: '2024-03-15',
    restEnd: '2024-03-15',
    status: 'In Progress',
  },
  // add more rows as needed
];

export const COLUMNS: Column<Permit>[] = [
  { key: 'permit', label: 'Permit #' },
  { key: 'year', label: 'Year' },
  { key: 'town', label: 'Town' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'restStart', label: 'Rest. Start Date' },
  { key: 'restEnd', label: 'Rest. End Date' },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <div
        className={cn(
          value === 'Completed' ? 'bg-[#00B69B]' : 'bg-[#FCBE2D]',
          'w-[94px] p-2 rounded-full px-2 py-1 text-center text-sm font-bold text-white transition-colors'
        )}
      >
        {value}
      </div>
    ),
  },
  {
    key: 'actions' as any,
    label: 'Actions',
    render: () => (
      <ButtonGroup className="flex gap-0">
        <Button size="icon" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline">
          <Download className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="text-red-500 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    ),
  },
];