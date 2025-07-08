'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShoppingCart, RefreshCw, CheckCircle, AlertCircle, TrendingUp, Package } from 'lucide-react';

interface EcommerceStore {
  id: string;
  platform: 'shopify' | 'woocommerce';
  storeName: string;
  domain: string;
  connected: boolean;
  lastSync: Date;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}

interface SyncStats {
  products: number;
  orders: number;
  customers: number;
  categories: number;
}

export function EcommerceIntegration() {
  const [stores, setStores] = useState<EcommerceStore[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      // Simular carregamento de lojas do backend
      const mockStores: EcommerceStore[] = [
        {
          id: '1',
          platform: 'shopify',
          storeName: 'Minha Loja Shopify',
          domain: 'minhaloja.myshopify.com',
          connected: true,
          lastSync: new Date(),
          totalProducts: 250,
          totalOrders: 1450,
          revenue: 125000
        },
        {
          id: '2',
          platform: 'woocommerce',
          storeName: 'WooCommerce Store',
          domain: 'loja.example.com',
          connected: false,
          lastSync: new Date(Date.now() - 86400000),
          totalProducts: 0,
          totalOrders: 0,
          revenue: 0
        }
      ];
      setStores(mockStores);
    } catch (err) {
      setError('Erro ao carregar lojas');
    }
  };

  const connectShopify = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Shopify conectado com sucesso!');
      await loadStores();
    } catch (err) {
      setError('Erro ao conectar Shopify');
    } finally {
      setSyncing(false);
    }
  };

  const connectWooCommerce = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('WooCommerce conectado com sucesso!');
      await loadStores();
    } catch (err) {
      setError('Erro ao conectar WooCommerce');
    } finally {
      setSyncing(false);
    }
  };

  const syncStore = async (storeId: string) => {
    try {
      setSyncing(true);
      setSyncProgress(0);
      setSyncStats(null);
      setError(null);

      const store = stores.find(s => s.id === storeId);
      if (!store) return;

      // Simular progresso de sincronização
      const steps = [
        { name: 'Produtos', value: 25 },
        { name: 'Pedidos', value: 50 },
        { name: 'Clientes', value: 75 },
        { name: 'Categorias', value: 100 }
      ];

      for (const step of steps) {
        setSyncProgress(step.value);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simular estatísticas de sincronização
      setSyncStats({
        products: Math.floor(Math.random() * 100) + 50,
        orders: Math.floor(Math.random() * 50) + 20,
        customers: Math.floor(Math.random() * 200) + 100,
        categories: Math.floor(Math.random() * 20) + 10
      });

      setSuccess('Loja sincronizada com sucesso!');
      await loadStores();
    } catch (err) {
      setError('Erro ao sincronizar loja');
    } finally {
      setSyncing(false);
      setSyncProgress(0);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integração E-commerce</h2>
          <p className="text-muted-foreground">
            Conecte suas lojas Shopify e WooCommerce
          </p>
        </div>
        <ShoppingCart className="h-8 w-8 text-primary" />
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

      <Tabs defaultValue="stores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stores">Lojas Conectadas</TabsTrigger>
          <TabsTrigger value="connect">Conectar Nova Loja</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          {stores.map((store) => (
            <Card key={store.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-sm font-medium">
                    {store.storeName}
                  </CardTitle>
                  <Badge variant={store.platform === 'shopify' ? 'default' : 'secondary'}>
                    {store.platform.toUpperCase()}
                  </Badge>
                </div>
                <Badge variant={store.connected ? 'default' : 'destructive'}>
                  {store.connected ? 'Conectada' : 'Desconectada'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {store.domain}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Produtos</p>
                    <p className="text-2xl font-bold">{store.totalProducts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pedidos</p>
                    <p className="text-2xl font-bold">{store.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Receita</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(store.revenue)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Última sincronização: {store.lastSync.toLocaleString()}
                  </div>
                  <Button
                    onClick={() => syncStore(store.id)}
                    disabled={syncing || !store.connected}
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar
                  </Button>
                </div>

                {syncing && (
                  <div className="mt-4 space-y-2">
                    <Progress value={syncProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Sincronizando... {syncProgress}%
                    </p>
                    {syncStats && (
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <Package className="h-4 w-4 mx-auto mb-1" />
                          <p>{syncStats.products} produtos</p>
                        </div>
                        <div className="text-center">
                          <ShoppingCart className="h-4 w-4 mx-auto mb-1" />
                          <p>{syncStats.orders} pedidos</p>
                        </div>
                        <div className="text-center">
                          <TrendingUp className="h-4 w-4 mx-auto mb-1" />
                          <p>{syncStats.customers} clientes</p>
                        </div>
                        <div className="text-center">
                          <Package className="h-4 w-4 mx-auto mb-1" />
                          <p>{syncStats.categories} categorias</p>
                        </div>
                      </div>
                    )}
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
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shopify
                </CardTitle>
                <CardDescription>
                  Conecte sua loja Shopify para sincronizar produtos e pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectShopify}
                  disabled={syncing}
                  className="w-full"
                >
                  Conectar Shopify
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  WooCommerce
                </CardTitle>
                <CardDescription>
                  Conecte sua loja WooCommerce para sincronizar dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectWooCommerce}
                  disabled={syncing}
                  className="w-full"
                >
                  Conectar WooCommerce
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
