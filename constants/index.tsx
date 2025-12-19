import { Column } from '@/components/custom/dataTable';

import { cn, formatMMDDYYYY } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Enum_Project_Project_Status, Enum_Project_Project_Type, Project } from '@/types';

export const TOKEN_COOKIE = 'jwtToken';

export const DASHBOARD_ROUTE = '/';
export const ADD_PROJECT = '/projects/add';
export const PROJECTS_ROUTE = '/projects';
export const MAP_ROUTE = '/map';
export const SETTING_ROUTE = '/settings';
export const UPLOAD_CSV = '/projects/upload';

export type IRoutes = {
  name: string;
  path?: string;
  lightIcon: string;
  darkIcon: string;
  onClick?: () => void;
};

export const ROUTES: IRoutes[] = [
  {
    name: 'Dashboard',
    path: DASHBOARD_ROUTE,
    lightIcon: '/icons/dashboardWhite.png',
    darkIcon: '/icons/dashboard.png',
  },
  {
    name: 'Add Project',
    path: ADD_PROJECT,
    lightIcon: '/icons/addWhite.png',
    darkIcon: '/icons/add.png',
  },
  {
    name: 'Projects',
    path: PROJECTS_ROUTE,
    lightIcon: '/icons/projectsWhite.png',
    darkIcon: '/icons/projects.png',
  },
  {
    name: 'Map Interface',
    path: MAP_ROUTE,
    lightIcon: '/icons/mapWhite.png',
    darkIcon: '/icons/map.png',
  },
];

export const SETTING_ROUTES: IRoutes[] = [
  {
    name: 'Logout',
    lightIcon: '/icons/logoutWhite.png',
    darkIcon: '/icons/logout.png',
    onClick: () => {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    },
  },
];

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
}));

export type Permit = {
  permit: string;
  layout: string;
  year: number;
  town: string;
  startDate: string;
  endDate: string;
  restStart: string;
  restEnd: string;
  isPermitClosed?: boolean;
  status: 'Completed' | 'In Progress';
};

export const BASEMAPS: Record<
  string,
  { label: string; url: string; subdomains?: string[]; image: string }
> = {
  osm: {
    label: 'OpenStreetMap',
    // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    url: `https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    subdomains: ['a', 'b', 'c'],
    image: '/icons/basemap.png',
  },
  satellite: {
    label: 'Satellite (Esri)',
    url: `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    image: '/icons/basemap.png',
  },
  light: {
    label: 'Carto Light',
    url: `https://api.maptiler.com/maps/dataviz-v4/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
    image: '/icons/basemap.png',
    subdomains: ['a', 'b', 'c', 'd'],
  },
  // dark: {
  //   label: 'Stadia Dark',
  //   url: 'https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=jlgiCktjQfACiPClmjOR',
  //   image: '/icons/basemap.png',
  // },
} as const;

export type BaseMapKey = keyof typeof BASEMAPS;

export interface LegendItem {
  abbreviation: string;
  fullName: string;
}

// Assume these are your column definitions
export const defaultLegends: LegendItem[] = [
  { abbreviation: 'CSD', fullName: 'Construction Start Date' },
  { abbreviation: 'CED', fullName: 'Construction End Date' },
  { abbreviation: 'RSD', fullName: 'Restoration Start Date' },
  { abbreviation: 'RED', fullName: 'Restoration End Date' },
  { abbreviation: 'PCO', fullName: 'Permit Close Out' },
];

export const projectStatusOptions = [
  { label: 'Completed', value: Enum_Project_Project_Status.Completed },
  { label: 'In Progress', value: Enum_Project_Project_Status.InProgress },
];

export const projectTypeOptions = [
  { label: 'Electric Emergency', value: Enum_Project_Project_Type.ElectricEmergency },
  { label: 'Gas Emergency', value: Enum_Project_Project_Type.GasEmergency },
  { label: 'Permit', value: Enum_Project_Project_Type.Permit },
];

export const dateFormatter = (dateString: string) => {
  return dateString ? dateString.split('T')[0] : null;
};

export const ALERT_TYPES = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

export type IAlertType = (typeof ALERT_TYPES)[keyof typeof ALERT_TYPES];

export const COLUMNS: Column<Project>[] = [
  {
    key: 'permit_no',
    label: 'Permit #',
    render: (value: Project['permit_no']) => {
      return value ? value.slice(-4) : '-';
    },
  },
  {
    key: 'layout_no',
    label: 'Layout #',
    render: (value: Project['layout_no']) => {
      return value ? value.slice(-4) : '-';
    },
  },
  { key: 'year', label: 'Year' },
  { key: 'town', label: 'Town' },
  {
    key: 'const_start_date',
    label: 'CSD',
    render: (value) => {
      return value ? formatMMDDYYYY(value) : '-';
    },
  },
  {
    key: 'const_end_date',
    label: 'CED',
    render: (value) => {
      return value ? formatMMDDYYYY(value) : '-';
    },
  },
  {
    key: 'rest_start_date',
    label: 'RSD',
    render: (value) => {
      return value ? formatMMDDYYYY(value) : '-';
    },
  },
  {
    key: 'rest_end_date',
    label: 'RED',
    render: (value) => {
      return value ? formatMMDDYYYY(value) : '-';
    },
  },
  {
    key: 'project_status',
    label: 'Status',
    render: (
      value: Enum_Project_Project_Status.Completed | Enum_Project_Project_Status.InProgress
    ) => {
      const projectStatus = projectStatusOptions.find((r) => r.value === value);
      return (
        <div
          className={cn(
            projectStatus?.value === Enum_Project_Project_Status.Completed
              ? 'bg-[#00B69B]'
              : 'bg-[#FCBE2D]',
            'w-[94px] rounded-full p-2 px-2 py-1 text-center text-sm font-bold text-white transition-colors'
          )}
        >
          {projectStatus?.label}
        </div>
      );
    },
  },
  { key: 'comments', label: 'Comments',  render: (value) => {
    return (
      <span className='max-w-[100px] text-wrap'>
        {value || "-"}
      </span>
    );
  }, },
  {
    key: 'permit_close_out',
    label: 'PCO',
    render: (value) => <div className={cn()}>{value ? 'Yes' : 'No'}</div>,
  },
];

export type IProjectFilters = {
  search: string;
  year: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  restStartDate: Date | undefined;
  restEndDate: Date | undefined;
};
