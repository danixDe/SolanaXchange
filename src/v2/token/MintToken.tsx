import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useWallet } from '../providers/WalletProvider';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  tokenAddress: z.string().min(1, {
    message: 'Token address is required.',
  }),
  amount: z.coerce.number().positive({
    message: 'Amount must be greater than 0.',
  }),
  recipientAddress: z.string().min(1, {
    message: 'Recipient address is required.',
  }),
});

export function TokenMintingForm() {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { mintToken, createdTokens, connected } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenAddress: '',
      amount: 100,
      recipientAddress: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Connect your wallet before minting tokens.',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(true);
    try {
      await mintToken(
        values.tokenAddress,
        values.amount,
        values.recipientAddress
      );
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Minting Failed',
        description: 'There was a problem minting your token.',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="tokenAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {createdTokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.name} ({token.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Number of tokens to mint
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="recipientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter Solana address" {...field} />
              </FormControl>
              <FormDescription>
                Wallet address to receive the tokens
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full rounded-full"
          disabled={isMinting}
        >
          {isMinting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isMinting ? 'Minting Tokens...' : 'Mint Tokens'}
        </Button>
      </form>
    </Form>
  );
}