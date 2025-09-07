import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

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
  const navigate = useNavigate();

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
        <div className="space-y-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="!shadow-0">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {computedBreadcrumb && computedBreadcrumb.length > 0 && (
          <Card className="rounded-md">
            <CardContent className="p-2">
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
                          <BreadcrumbLink href="#" className="flex items-center gap-1">
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
            </CardContent>
          </Card>
        )}
      </div>
      {children}
    </section>
  );
}
