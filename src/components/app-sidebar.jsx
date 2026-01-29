import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  Blocks,
  BookOpen,
  Building2,
  Command,
  Frame,
  GalleryVerticalEnd,
  Globe,
  HelpCircle,
  Image,
  LayoutGrid,
  Mail,
  Settings,
  Settings2,
  Users,
  Youtube,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavMainReport } from "./nav-main-report";

const NAVIGATION_CONFIG = {
  COMMON: {
    BOM: {
      title: "BOM",
      url: "/popup-list",
      icon: LayoutGrid,
      isActive: false,
    },

    MASTER: {
      title: "Master",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Component",
          url: "/student-testimonial",
          icon: Users,
        },
        {
          title: "Product",
          url: "/student-youtube",
          icon: Users,
        },
      ],
    },
  },

  REPORTS: {
    SETTINGS: {
      title: "Settings",
      url: "/settings",
      icon: Blocks,
      isActive: false,
    },
  },
};

const USER_ROLE_PERMISSIONS = {
  1: {
    navMain: [
      "BOM",
      "MASTER",
      // "SETTINGS",
    ],
    navMainReport: ["BOM", "MASTER", "SETTINGS"],
  },

  2: {
    navMain: [
      "BOM",
      "MASTER",
      // "SETTINGS",
    ],
    navMainReport: ["BOM", "MASTER", "SETTINGS"],
  },

  3: {
    navMain: [
      "BOM",
      "MASTER",
      // "SETTINGS",
    ],
    navMainReport: ["BOM", "MASTER", "SETTINGS"],
  },

  4: {
    navMain: [
      "BOM",
      "MASTER",
      // "SETTINGS",
    ],
    navMainReport: ["BOM", "MASTER", "SETTINGS"],
  },
};

const LIMITED_MASTER_SETTINGS = {
  title: "Master Settings",
  url: "#",
  isActive: false,
  icon: Settings2,
  items: [
    {
      title: "Chapters",
      url: "/master/chapter",
    },
  ],
};

const useNavigationData = (userType) => {
  return useMemo(() => {
    const permissions =
      USER_ROLE_PERMISSIONS[userType] || USER_ROLE_PERMISSIONS[1];

    const buildNavItems = (permissionKeys, config, customItems = {}) => {
      return permissionKeys
        .map((key) => {
          if (key === "MASTER_SETTINGS_LIMITED") {
            return LIMITED_MASTER_SETTINGS;
          }
          return config[key];
        })
        .filter(Boolean);
    };

    const navMain = buildNavItems(
      permissions.navMain,
      // { ...NAVIGATION_CONFIG.COMMON, ...NAVIGATION_CONFIG.MODULES },
      { ...NAVIGATION_CONFIG.COMMON },
      // { MASTER_SETTINGS_LIMITED: LIMITED_MASTER_SETTINGS }
    );

    // const navMainReport = buildNavItems(
    //   permissions.navMainReport,
    //   NAVIGATION_CONFIG.REPORTS
    // );

    return { navMain };
  }, [userType]);
};

const TEAMS_CONFIG = [
  {
    name: "Chair Mangement",
    logo: GalleryVerticalEnd,
    plan: "",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

export function AppSidebar({ ...props }) {
  const [openItem, setOpenItem] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { navMain, navMainReport } = useNavigationData(user?.user_type);
  const initialData = {
    user: {
      name: user?.name || "User",
      email: user?.email || "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: TEAMS_CONFIG,
    navMain,
    navMainReport,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={initialData.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <NavMain
          items={initialData.navMain}
          openItem={openItem}
          setOpenItem={setOpenItem}
        />
        {/* <NavMainReport
          items={initialData.navMainReport}
          openItem={openItem}
          setOpenItem={setOpenItem}
        /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { NAVIGATION_CONFIG, USER_ROLE_PERMISSIONS };
