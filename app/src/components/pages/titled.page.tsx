import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useMemo } from 'react';
import { useLocation } from 'react-router';

interface TitledPagedProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbProps[];
  children: React.ReactNode;
}

interface BreadcrumbProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
}

export default function TitledPage({
  children,
  title,
  description,
  breadcrumb,
}: TitledPagedProps): React.ReactNode {
  const location = useLocation();

  const computedBreadcrumb = useMemo(() => {
    let source: BreadcrumbProps[] = [];
    if (breadcrumb?.length) {
      source = breadcrumb;
    } else {
      source = location.pathname
        .split('/')
        .filter((item) => item !== '')
        .map((item, index, array) => {
          return {
            label: item.charAt(0).toUpperCase() + item.slice(1),
            href: '/' + array.slice(0, index + 1).join('/'),
          };
        });
    }

    return source?.map((item) => {
      return {
        ...item,
        href: item.href || location.pathname,
      };
    });
  }, [breadcrumb, location]);

  return (
    <section className="space-y-4">
      <div className="flex flex-row flex-wrap w-full items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {computedBreadcrumb && computedBreadcrumb.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {computedBreadcrumb.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    {index === computedBreadcrumb.length - 1 ? (
                      <BreadcrumbPage className="flex items-center gap-1">
                        {item.icon}
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href} className="flex items-center gap-1">
                        {item.icon}
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < computedBreadcrumb.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      {children}
    </section>
  );
}
