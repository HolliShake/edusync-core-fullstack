import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { cn } from '@/lib/utils';
import ROUTES from '@/routes';
import type { Route } from '@/types/types';
import { ChevronLeft } from 'lucide-react';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';

type SideBarProps = {
  isCollapsed: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
};

export default function SideBar({
  isCollapsed,
  setIsCollapsed = undefined,
}: SideBarProps): React.ReactNode {
  const [expandedRoutes, setExpandedRoutes] = useState<Set<number>>(new Set());
  const location = useLocation();
  const user = useAuth();

  const isActiveRoute = useCallback(
    (routePath: string) => {
      return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
    },
    [location]
  );

  const computedRoutes = useMemo(() => {
    return ROUTES.filter((route) => route.sidebar === true || route.sidebar === undefined).filter(
      (route) => (route.roles ?? []).some((role) => user?.session?.roles?.some((r) => r === role))
    );
  }, [user]);

  const toggleRouteExpansion = (index: number) => {
    setExpandedRoutes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRouteClick = (route: Route, index: number, event: React.MouseEvent) => {
    const hasChildren = route.children && route.children.length > 0;

    if (hasChildren && !isCollapsed) {
      // If route has children and sidebar is not collapsed, toggle expansion and prevent navigation
      event.preventDefault();
      event.stopPropagation();
      toggleRouteExpansion(index);
    }
    // If no children or sidebar is collapsed, let the Link handle navigation normally
  };

  const toggleSidebar = () => {
    setIsCollapsed?.(!isCollapsed);
    // Close all expanded routes when collapsing
    if (!isCollapsed) {
      setExpandedRoutes(new Set());
    }
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 bg-card border-r border-border shadow-sm transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col',
        isCollapsed ? 'translate-x-0' : '-translate-x-full',
        isCollapsed ? 'lg:w-16 w-64' : 'w-64'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center h-[64px] bg-sidebar border-b border-sidebar-border flex-shrink-0',
          isCollapsed ? 'lg:justify-center lg:px-2 px-4 justify-between' : 'justify-between px-4'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-300 ease-in-out',
            isCollapsed && 'lg:max-w-0 lg:opacity-0 lg:overflow-hidden lg:px-0 lg:m-0 lg:gap-0'
          )}
        >
          <div className="transition-all duration-300">
            <h2 className="text-base font-bold text-sidebar-foreground tracking-tight">
              EduPortal
            </h2>
            <p className="text-[10px] font-medium text-sidebar-accent-foreground tracking-wide">
              Learning Management System
            </p>
          </div>
        </div>
        {/* Toggle button - hidden on mobile */}
        <div className={cn('flex justify-center', !isCollapsed && 'lg:block')}>
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={cn(
              'shadow-sm hidden lg:flex rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-all duration-200',
              isCollapsed ? 'w-7 h-7' : 'w-7 h-7'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={cn(
                'w-3.5 h-3.5 transition-transform duration-200',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          'p-2 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent',
          isCollapsed && 'lg:px-1'
        )}
      >
        {computedRoutes.map((route: Route, index: number) => {
          const isActive = isActiveRoute(route.path);
          const hasChildren = route.children && route.children.length > 0;
          const isExpanded = expandedRoutes.has(index) && !isCollapsed;
          const isLabel = route.type === 'label';

          // If it's a label, render it differently
          if (isLabel) {
            return (
              <div
                key={index}
                className={cn(
                  'px-2.5 py-2 transition-all duration-300 ease-in-out pointer-events-none select-none',
                  isCollapsed && 'lg:px-1.5 lg:py-2 lg:flex lg:justify-center'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider',
                    isCollapsed && 'lg:text-center'
                  )}
                >
                  {isCollapsed ? route.title.charAt(0) : route.title}
                </span>
              </div>
            );
          }

          return (
            <div key={index} className="space-y-1">
              <div className="relative">
                <Link
                  to={route.path}
                  onClick={(event) => handleRouteClick(route, index, event)}
                  className={cn(
                    'flex items-center rounded-md transition-all duration-200 cursor-pointer relative overflow-hidden group',
                    isCollapsed ? 'lg:px-1.5 lg:py-2 lg:justify-center px-2.5 py-2' : 'px-2.5 py-2',
                    isActive
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                      : 'bg-transparent text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    hasChildren && !isCollapsed && 'pr-8'
                  )}
                  title={isCollapsed ? route.title : undefined}
                >
                  {route.icon && (
                    <div
                      className={cn(
                        'flex items-center justify-center w-7 h-7 flex-shrink-0 rounded-md transition-all duration-200',
                        isCollapsed ? 'lg:mr-0 mr-2' : 'mr-2',
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground shadow-sm'
                          : 'bg-accent text-accent-foreground group-hover:bg-warning/20 group-hover:text-warning group-hover:shadow-md group-hover:scale-105'
                      )}
                    >
                      <span
                        className={cn(
                          'text-current transition-all duration-200 text-sm',
                          !isActive && 'group-hover:scale-110'
                        )}
                      >
                        {route.icon}
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'flex-1 min-w-0 transition-all duration-300 ease-in-out',
                      isCollapsed && 'lg:max-w-0 lg:opacity-0 lg:overflow-hidden lg:px-0 lg:m-0'
                    )}
                  >
                    <span
                      className={cn(
                        'block text-xs font-semibold truncate tracking-wide transition-all duration-200',
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground group-hover:font-bold'
                      )}
                    >
                      {route.title}
                    </span>
                  </div>

                  {/* Expandable indicator for routes with children */}
                  {hasChildren && !isCollapsed && (
                    <div className="absolute right-2 flex items-center justify-center w-4 h-4 transition-all duration-200">
                      <svg
                        className={cn(
                          'w-3 h-3 transition-transform duration-200',
                          isActive
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
                          isExpanded && 'rotate-90'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </Link>
              </div>

              {/* Children routes with enhanced UI - hidden when collapsed */}
              {hasChildren && !isCollapsed && (
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="ml-4 pl-3 pt-1 pb-1 border-l border-sidebar-border relative space-y-1">
                    {route.children
                      ?.filter((data) => data.sidebar === true || data.sidebar === undefined)
                      .map((child: Route, childIndex: number) => {
                        const isChildActive = isActiveRoute(child.path);

                        return (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className={cn(
                              'flex items-center px-2.5 py-2 rounded-md transition-all duration-200 relative overflow-hidden group',
                              isChildActive
                                ? 'bg-primary/15 text-primary shadow-sm'
                                : 'bg-transparent text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                            )}
                          >
                            {child.icon && (
                              <div
                                className={cn(
                                  'flex items-center justify-center w-6 h-6 mr-2.5 flex-shrink-0 rounded-md transition-all duration-200',
                                  isChildActive
                                    ? 'bg-primary/20 text-primary shadow-sm'
                                    : 'bg-accent/50 text-accent-foreground group-hover:bg-success/20 group-hover:text-success group-hover:shadow-sm group-hover:scale-105'
                                )}
                              >
                                <span
                                  className={cn(
                                    'text-current text-xs transition-all duration-200',
                                    !isChildActive && 'group-hover:scale-110'
                                  )}
                                >
                                  {child.icon}
                                </span>
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <span
                                className={cn(
                                  'block text-xs truncate tracking-wide transition-all duration-200',
                                  isChildActive
                                    ? 'font-semibold text-primary'
                                    : 'font-medium text-sidebar-foreground/80 group-hover:text-sidebar-accent-foreground group-hover:font-semibold'
                                )}
                              >
                                {child.title}
                              </span>
                            </div>

                            {/* Active indicator badge */}
                            {isChildActive && (
                              <div className="ml-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer - smoothly animate visibility when collapsing */}
      <div
        className={cn(
          'bg-card border-t border-border overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0',
          isCollapsed ? 'max-h-0 opacity-0 p-0' : 'max-h-16 opacity-100 p-3'
        )}
      >
        <div className="text-xs text-muted-foreground text-center">
          <p className="font-medium text-foreground text-[11px]">EduPortal Platform</p>
          <p className="text-[9px] mt-0.5 opacity-70">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
