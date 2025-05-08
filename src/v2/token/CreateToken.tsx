import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/v2/providers/WalletProvider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  tokenName: z.string().min(3, {
    message: 'Token name must be at least 3 characters.',
  }),
  tokenSymbol: z.string().min(2, {
    message: 'Token symbol must be at least 2 characters.',
  }).max(10, {
    message: 'Token symbol must not exceed 10 characters.',
  }),
  tokenDecimals: z.coerce.number().int().min(0).max(9),
  tokenDescription: z.string().optional(),
  initialSupply: z.coerce.number().positive({
    message: 'Initial supply must be greater than 0.',
  }),
});

export function TokenCreationForm() {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { createToken, connected } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: '',
      tokenSymbol: '',
      tokenDecimals: 9,
      tokenDescription: '',
      initialSupply: 1000000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Connect your wallet before creating a token.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);

    try {
      await createToken(
        values.tokenName,
        values.tokenSymbol,
        values.tokenDecimals,
        values.initialSupply
      );

      toast({
        title: 'Token Created',
        description: `Your token ${values.tokenName} (${values.tokenSymbol}) has been created successfully.`,
      });

      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Token Creation Failed',
        description: 'There was a problem creating your token.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Token" {...field} />
                </FormControl>
                <FormDescription>
                  The full name of your token
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokenSymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="MTK" {...field} />
                </FormControl>
                <FormDescription>
                  Short abbreviation for your token (2-10 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tokenDecimals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decimals</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Number of decimal places (0-9)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initialSupply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Supply</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Initial token supply to mint
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tokenDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your token's purpose..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of your token
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={isCreating}
        >
          {isCreating && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isCreating ? 'Creating Token...' : 'Create Token'}
        </Button>
      </form>
    </Form>
  );
}
