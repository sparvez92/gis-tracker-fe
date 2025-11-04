export const TOKEN_COOKIE = "GIS_APP_TOKEN";

export const DASHBOARD_ROUTE = "/"
export const ADD_PROJECT = "/projects/add"
export const PROJECTS_ROUTE = "/projects"
export const MAP_ROUTE = "/map"
export const SETTING_ROUTE = "/map"


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