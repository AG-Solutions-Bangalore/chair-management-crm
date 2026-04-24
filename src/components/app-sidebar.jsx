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
  Command,
  GalleryVerticalEnd,
  Settings,
  Settings2,
  LayoutDashboard,
  Boxes,
  Package,
  Layers,
  Truck,
  ShoppingCart,
  Wrench,
  ClipboardList,
  Factory,
  BarChart3,
  PackageCheck,
  FileDown,
  Cog,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const NAVIGATION_CONFIG = {
  COMMON: {
    DASHBOARD: {
      title: "Dashboard",
      url: "/home",
      icon: LayoutDashboard,
    },
    MASTER: {
      title: "Master",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Component",
          url: "/component",
          icon: Wrench,
        },
        {
          title: "Product",
          url: "/product",
          icon: Package,
        },

        {
          title: "BOM",
          url: "/bom",
          icon: Layers,
        },
        {
          title: "Vendor",
          url: "/vendor",
          icon: Truck,
        },
      ],
    },
    PURCHASE: {
      title: "Purchase",
      url: "#1",
      icon: ShoppingCart,
      items: [
        {
          title: "Product",
          url: "/purchase-product",
          icon: Package,
        },
        {
          title: "Component",
          url: "/purchase-component",
          icon: Wrench,
        },
      ],
    },

    ORDER: {
      title: "Order",
      url: "/order",
      icon: ClipboardList,
    },
    RETURN_ORDER: {
      title: "Return Order",
      url: "/return-order",
      icon: ClipboardList,
    },
    PRODUCTION: {
      title: "Production",
      url: "/production",
      icon: Factory,
    },
    REPORT: {
      title: "Report",
      url: "#2",
      icon: BarChart3,
      items: [
        {
          title: "Finished Stock",
          url: "/report/productstock",
          icon: PackageCheck,
        },
        {
          title: "Component Stock",
          url: "/report/componentstock",
          icon: Boxes,
        },
        {
          title: "Purchase Product",
          url: "/report/purchaseproduct",
          icon: FileDown,
        },
        {
          title: "Purchase Component",
          url: "/report/purchasecomponent",
          icon: FileDown,
        },
        {
          title: "Order",
          url: "/report/order",
          icon: ClipboardList,
        },
        {
          title: "Return Order",
          url: "/report/return-order",
          icon: Truck,
        },
      ],
    },
    SETTINGS: {
      title: "Settings",
      url: "/settings",
      icon: Cog,
    },
  },
};

const USER_ROLE_PERMISSIONS = {
  1: {
    navMain: [
      "DASHBOARD",
      "MASTER",
      "PURCHASE",
      "ORDER",
      "RETURN_ORDER",
      "PRODUCTION",
      "REPORT",
      "SETTINGS",
    ],
    navMainReport: ["DASHBOARD", "MASTER", "SETTINGS"],
  },

  2: {
    navMain: [
      "DASHBOARD",
      "MASTER",
      "PURCHASE",
      "ORDER",
      "RETURN_ORDER",
      "PRODUCTION",
      "REPORT",
      "SETTINGS",
    ],
    navMainReport: ["DASHBOARD", "MASTER", "SETTINGS"],
  },

  3: {
    navMain: [
      "DASHBOARD",
      "MASTER",
      "PURCHASE",
      "ORDER",
      "RETURN_ORDER",
      "PRODUCTION",
      "REPORT",
      "SETTINGS",
    ],
    navMainReport: ["DASHBOARD", "MASTER", "SETTINGS"],
  },

  4: {
    navMain: [
      "DASHBOARD",
      "MASTER",
      "PURCHASE",
      "ORDER",
      "RETURN_ORDER",
      "PRODUCTION",
      "REPORT",
      "SETTINGS",
    ],
    navMainReport: ["DASHBOARD", "MASTER", "SETTINGS"],
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

const Logo = ({ className }) => (
  <img src="/chair-fevicon.png" alt="Logo" className={className} />
);

const TEAMS_CONFIG = [
  {
    name: "Chair Management",
    logo: Logo,
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
