import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ComponentType } from 'react';

interface WalletCardProps {
  name: string;
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  onClick: () => void;
  className?: string;
}

export function WalletCard({
  name,
  Icon,
  description,
  onClick,
  className,
}: WalletCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-primary/50 hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-4">
      <div className="relative h-10 w-10 rounded-full ">
  <Icon className="absolute h-8 w-8 inset-0 m-auto" />
</div>
        <div>
          <CardTitle className="text-base">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}