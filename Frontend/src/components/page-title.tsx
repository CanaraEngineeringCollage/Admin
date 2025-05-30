import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function PageTitle({ title, icon: Icon, action }: PageTitleProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-7 w-7 text-primary" />}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
