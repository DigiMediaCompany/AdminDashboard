import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
    UserCircleIcon,
    ChevronDownIcon,
    HorizontaLDots,
    GridIcon,
    PieChartIcon,
    BoxCubeIcon,
    CalenderIcon,
    ListIcon,
    PageIcon,
    TableIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
    UserGroupIcon
} from "@heroicons/react/24/outline";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

type Section = {
    title: string;
    items: NavItem[];
};

const sidebarSections: Section[] = [
    {
        title: "Home",
        items: [
            { icon: <GridIcon />, name: "Dashboard", path: "/" },
            { icon: <UserCircleIcon />, name: "Profile", path: "/profile" },
        ],
    },
    {
        title: "Manage",
        items: [
            {
                name: "Admin",
                icon: <UserGroupIcon />,
                subItems: [
                    { name: "Users", path: "/admin/users" },
                    // { name: "Roles", path: "/admin/roles" },
                    { name: "Permissions", path: "/admin/permissions" },
                ]
            },
            // {
            //     name: "Usagag Video",
            //     icon: <VideoIcon />,
            //     subItems: [{ name: "Videos", path: "/usagag-videos" }],
            // },
            // {
            //     name: "Youtube Article",
            //     icon: <PlayCircleIcon />,
            //     subItems: [
            //         { name: "Job", path: "/youtube-article/jobs" },
            //         { name: "Series", path: "/youtube-article/series" },
            //         { name: "Categories", path: "/youtube-article/categories" },
            //     ],
            // },
            // {
            //     name: "PostFunny",
            //     icon: <FaceSmileIcon />,
            //     subItems: [
            //         { name: "Info", path: "/post-funny/info" },
            //         { name: "Quizzes", path: "/post-funny/quizzes" },
            //         { name: "Ads", path: "/post-funny/ads" },
            //     ],
            // },
            // {
            //     name: "FreeApk",
            //     icon: <FolderArrowDownIcon />,
            //     subItems: [
            //         { name: "Info", path: "/free-apk/info" },
            //         { name: "Ads", path: "/free-apk/ads" },
            //     ],
            // },
            // {
            //     name: "GonoGame",
            //     icon: <PuzzlePieceIcon />,
            //     subItems: [
            //         { name: "Info", path: "/gono-game/info" },
            //         { name: "Ads", path: "/gono-game/ads" },
            //     ],
            // },
            // {
            //     name: "MzGenz",
            //     icon: <PuzzlePieceIcon />,
            //     subItems: [
            //         { name: "Info", path: "/mz-genz/info" },
            //         { name: "Ads", path: "/mz-genz/ads" },
            //     ],
            // },
            // {
            //     name: "TikGame",
            //     icon: <PuzzlePieceIcon />,
            //     subItems: [
            //         { name: "Info", path: "/tik-game/info" },
            //         { name: "Ads", path: "/tik-game/ads" },
            //     ],
            // },

        ],
    },
    {
        title: "Showcase",
        items: [
            {
                icon: <PieChartIcon />,
                name: "Charts",
                subItems: [
                    { name: "Line Chart", path: "/line-chart" },
                    { name: "Bar Chart", path: "/bar-chart" },
                ],
            },
            {
                icon: <BoxCubeIcon />,
                name: "UI Elements",
                subItems: [
                    { name: "Alerts", path: "/alerts" },
                    { name: "Buttons", path: "/buttons" },
                    { name: "Avatar", path: "/avatars" },
                    { name: "Badge", path: "/badge" },
                    { name: "Images", path: "/images" },
                    { name: "Videos", path: "/videos" }
                ],
            },
            {
                icon: <CalenderIcon />, name: "Calendar", path: "/calendar"
            },
            {
                name: "Tables",
                icon: <TableIcon />,
                path: "/basic-tables"
            },
            {
                name: "Pages",
                icon: <PageIcon />,
                subItems: [
                    { name: "Blank Page", path: "/blank" },
                    { name: "404 Error", path: "/error-404" },
                ],
            },
            {
                name: "Forms",
                icon: <ListIcon />,
                path: "/form-elements"
            },
            {
                name: "Dashboard",
                icon: <GridIcon />,
                path: "/dashboard"
            },
            {
                name: "User Profile",
                icon: <UserCircleIcon />,
                path: "/profile"
            },
        ],
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState<{ section: number; index: number } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    // Auto-open submenu if URL matches
    useEffect(() => {
        let matched = false;
        sidebarSections.forEach((section, sIndex) => {
            section.items.forEach((nav, index) => {
                nav.subItems?.forEach((sub) => {
                    if (isActive(sub.path)) {
                        setOpenSubmenu({ section: sIndex, index });
                        matched = true;
                    }
                });
            });
        });
        if (!matched) setOpenSubmenu(null);
    }, [location, isActive]);

    // Measure submenu height
    useEffect(() => {
        if (openSubmenu) {
            const key = `${openSubmenu.section}-${openSubmenu.index}`;
            const el = subMenuRefs.current[key];
            if (el) {
                setSubMenuHeight((prev) => ({
                    ...prev,
                    [key]: el.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const toggleSubmenu = (section: number, index: number) => {
        setOpenSubmenu((prev) =>
            prev && prev.section === section && prev.index === index ? null : { section, index }
        );
    };

    
    
    const renderItems = (items: NavItem[], sectionIndex: number) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => toggleSubmenu(sectionIndex, index)}
                            className={`menu-item group ${
                                openSubmenu?.section === sectionIndex && openSubmenu?.index === index
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                            } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                        >
                            <span className="menu-item-icon-size">{nav.icon}</span>
                            {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                        openSubmenu?.section === sectionIndex && openSubmenu?.index === index
                                            ? "rotate-180 text-brand-500"
                                            : ""
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                to={nav.path}
                                className={`menu-item group ${
                                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                }`}
                            >
                                <span className="menu-item-icon-size">{nav.icon}</span>
                                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => (subMenuRefs.current[`${sectionIndex}-${index}`] = el)}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.section === sectionIndex && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${sectionIndex}-${index}`]}px`
                                        : "0px",
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((sub) => (
                                    <li key={sub.name}>
                                        <Link
                                            to={sub.path}
                                            className={`menu-dropdown-item ${
                                                isActive(sub.path)
                                                    ? "menu-dropdown-item-active"
                                                    : "menu-dropdown-item-inactive"
                                            }`}
                                        >
                                            {sub.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 text-gray-900 h-screen border-r border-gray-200 transition-all duration-300 z-50 
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                <Link to="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <img src="/images/logo/logo.svg" alt="Logo" width={150} height={40} className="dark:hidden" />
                            <img src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} className="hidden dark:block" />
                        </>
                    ) : (
                        <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>

            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-8">
                        {sidebarSections.map((section, sectionIndex) => (
                            <div key={section.title}>
                                <h2
                                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                        !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                                    }`}
                                >
                                    {isExpanded || isHovered || isMobileOpen ? (
                                        section.title
                                    ) : (
                                        <HorizontaLDots className="size-6" />
                                    )}
                                </h2>
                                {renderItems(section.items, sectionIndex)}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
