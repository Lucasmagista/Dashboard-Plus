'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { GmailIntegration } from '@/lib/integrations/gmail-sync';

interface EmailAccount {
  id: string;
  provider: 'gmail' | 'outlook';
  email: string;
  connected: boolean;
  lastSync: Date;
  totalEmails: number;
  unreadEmails: number;
}

export function EmailIntegration() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const gmail = new GmailIntegration({
    clientId: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_GMAIL_REDIRECT_URI || '',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly']
  });

  useEffect(() => {
    loadEmailAccounts();
  }, []);

  const loadEmailAccounts = async () => {
    try {
      // Simular carregamento de contas do backend
      const mockAccounts: EmailAccount[] = [
        {
          id: '1',
          provider: 'gmail',
          email: 'user@gmail.com',
          connected: true,
          lastSync: new Date(),
          totalEmails: 1250,
          unreadEmails: 15
        },
        {
          id: '2',
          provider: 'outlook',
          email: 'user@outlook.com',
          connected: false,
          lastSync: new Date(Date.now() - 86400000), // 1 dia atrás
          totalEmails: 0,
          unreadEmails: 0
        }
      ];
      setAccounts(mockAccounts);
    } catch (err) {
      setError('Erro ao carregar contas de email');
    }
  };

  const connectGmail = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      // Simular autenticação
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Gmail conectado com sucesso!');
      await loadEmailAccounts();
    } catch (err) {
      setError('Erro ao conectar Gmail');
    } finally {
      setSyncing(false);
    }
  };

  const connectOutlook = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      // Simular autenticação
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Outlook conectado com sucesso!');
      await loadEmailAccounts();
    } catch (err) {
      setError('Erro ao conectar Outlook');
    } finally {
      setSyncing(false);
    }
  };

  const syncEmails = async (accountId: string) => {
    try {
      setSyncing(true);
      setSyncProgress(0);
      setError(null);

      const account = accounts.find(a => a.id === accountId);
      if (!account) return;

      // Simular progresso de sincronização
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simular sincronização baseada no provider
      if (account.provider === 'gmail') {
        // Simular sincronização do Gmail
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Simular sincronização do Outlook
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setSuccess('Emails sincronizados com sucesso!');
      await loadEmailAccounts();
    } catch (err) {
      setError('Erro ao sincronizar emails');
    } finally {
      setSyncing(false);
      setSyncProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integração de Email</h2>
          <p className="text-muted-foreground">
            Conecte e sincronize suas contas Gmail e Outlook
          </p>
        </div>
        <Mail className="h-8 w-8 text-primary" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Contas Conectadas</TabsTrigger>
          <TabsTrigger value="connect">Conectar Nova Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-sm font-medium">
                    {account.email}
                  </CardTitle>
                  <Badge variant={account.connected ? 'default' : 'secondary'}>
                    {account.provider.toUpperCase()}
                  </Badge>
                </div>
                <Badge variant={account.connected ? 'default' : 'destructive'}>
                  {account.connected ? 'Conectado' : 'Desconectado'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de emails</p>
                    <p className="text-2xl font-bold">{account.totalEmails}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Não lidos</p>
                    <p className="text-2xl font-bold text-orange-600">{account.unreadEmails}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Última sincronização: {account.lastSync.toLocaleString()}
                  </div>
                  <Button
                    onClick={() => syncEmails(account.id)}
                    disabled={syncing || !account.connected}
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar
                  </Button>
                </div>

                {syncing && (
                  <div className="mt-4">
                    <Progress value={syncProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Sincronizando... {syncProgress}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="connect" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Gmail
                </CardTitle>
                <CardDescription>
                  Conecte sua conta Gmail para sincronizar emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectGmail}
                  disabled={syncing}
                  className="w-full"
                >
                  Conectar Gmail
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Outlook
                </CardTitle>
                <CardDescription>
                  Conecte sua conta Outlook para sincronizar emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectOutlook}
                  disabled={syncing}
                  className="w-full"
                >
                  Conectar Outlook
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
