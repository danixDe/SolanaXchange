import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WalletCardProps {
  name: string;
  icon: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export function WalletCard({
  name,
  icon,
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <CardTitle className="text-base">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}