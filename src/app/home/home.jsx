import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Package, 
  Cpu, 
  AlertTriangle, 
  ShoppingCart, 
  Factory, 
  Truck, 
  BarChart3, 
  PieChart, 
  RefreshCcw, 
  MoreVertical,
} from 'lucide-react';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, registerables } from 'chart.js';

import moment from 'moment';
import { DASHBOARD_DATA } from '@/api';

Chart.register(ArcElement, ...registerables);

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <Card className="hover:shadow-md transition-all duration-200 border">
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-xl font-bold text-gray-900">
            {typeof value === 'number' ? value?.toLocaleString() : value}
          </h3>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${color} shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const LowStockItem = ({ component_name, component_code, current_stock, minimum_stock }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200">
    <div className="flex items-center gap-2 flex-1">
      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-3 h-3 text-red-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 text-sm">{component_name}</p>
        <p className="text-xs text-gray-500">{component_code}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-red-600">{current_stock}</p>
      <p className="text-xs text-gray-500">Min: {minimum_stock}</p>
    </div>
  </div>
);

const DispatchItem = ({ order_number, product_name, dispatch_date }) => (
  <div className="group p-2 rounded border hover:border-gray-300 hover:bg-gray-50 transition-all">
    <div className="flex justify-between items-start gap-1 mb-1">
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">
          {order_number}
        </h4>
        <p className="text-gray-600 text-xs mt-0.5">
          {product_name}
        </p>
      </div>
      <Badge 
        variant="outline" 
        className="text-xs px-1.5 py-0 h-5"
      >
        Dispatched
      </Badge>
    </div>
    <div className="flex justify-between items-center mt-1">
      <span className="text-xs text-gray-500">
        {moment(dispatch_date).format('MMM DD, YYYY')}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        View
      </Button>
    </div>
  </div>
);

const Home = () => {
  const token = Cookies.get('token');
  const [refreshing, setRefreshing] = useState(false);

  const { 
    data: dashboardData, 
    isLoading: loadingDashboardData,
    isFetching: fetchingDashboardData,
    refetch: refetchDashboard 
  } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      const response = await axios.get(`${DASHBOARD_DATA}`, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const result = dashboardData || {};
  const cards = result.cards || {};
  const orderStatus = result.order_status_distribution || [];
  const componentsByCategory = result.components_by_category || [];
  const lowStockItems = result.low_stock_items || [];
  const recentDispatches = result.recent_dispatches || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchDashboard();
      toast.success('Dashboard updated');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const cardConfig = [
    {
      title: 'Total Products',
      value: cards.total_products || 0,
      icon: Package,
      color: 'bg-blue-600',
      description: 'Active products in catalog'
    },
    {
      title: 'Components',
      value: cards.total_components || 0,
      icon: Cpu,
      color: 'bg-green-600',
      description: 'Different components'
    },
    {
      title: 'Low Stock Alerts',
      value: cards.low_stock_alerts || 0,
      icon: AlertTriangle,
      color: 'bg-amber-600',
      description: 'Components needing restock'
    },
    {
      title: 'Pending Orders',
      value: cards.pending_orders || 0,
      icon: ShoppingCart,
      color: 'bg-purple-600',
      description: 'Orders to be processed'
    },
    {
      title: 'In Production',
      value: cards.in_production || 0,
      icon: Factory,
      color: 'bg-indigo-600',
      description: 'Currently in production'
    },
    {
      title: 'Ready to Dispatch',
      value: cards.ready_to_dispatch || 0,
      icon: Truck,
      color: 'bg-emerald-600',
      description: 'Awaiting dispatch'
    },
  ];

  const orderStatusChartData = orderStatus.length > 0 ? {
    labels: orderStatus.map((item) => item.status),
    datasets: [
      {
        data: orderStatus.map((item) => item.count),
        backgroundColor: [
          '#3b82f6', 
          '#10b981', 
          '#f59e0b', 
          '#8b5cf6', 
        ],
        hoverBackgroundColor: [
          '#2563eb', 
          '#059669',
          '#d97706', 
          '#7c3aed', 
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  } : null;

  const componentsChartData = componentsByCategory.length > 0 ? {
    labels: componentsByCategory.map((item) => item.category),
    datasets: [
      {
        data: componentsByCategory.map((item) => item.total),
        backgroundColor: [
          '#6366f1', 
          '#f97316', 
          '#14b8a6', 
        ],
        hoverBackgroundColor: [
          '#4f46e5',
          '#ea580c', 
          '#0d9488', 
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  } : null;

  if (loadingDashboardData) {
    return (
      <div className="min-h-screen p-3 space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-12" />
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-2 w-16" />
                </div>
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full rounded" />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded" />
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 space-y-3 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manufacturing Dashboard</h1>
          <p className="text-xs text-gray-600">Production and inventory overview</p>
        </div>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="outline"
          className="h-8"
          disabled={fetchingDashboardData || refreshing}
        >
          {(fetchingDashboardData || refreshing) ? (
            <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <RefreshCcw className="h-3 w-3 mr-1" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
        {cardConfig.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            description={card.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-3 space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Low Stock Alerts</CardTitle>
                  <CardDescription className="text-xs">Components needing immediate attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1.5">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item, index) => (
                    <LowStockItem
                      key={index}
                      component_name={item.component_name}
                      component_code={item.component_code}
                      current_stock={item.current_stock}
                      minimum_stock={item.minimum_stock}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-gray-500 text-xs">All components are sufficiently stocked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                  <Truck className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Recent Dispatches</CardTitle>
                  <CardDescription className="text-xs">Latest dispatched orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {recentDispatches.length > 0 ? (
                  recentDispatches.map((dispatch, index) => (
                    <DispatchItem
                      key={index}
                      order_number={dispatch.order_number}
                      product_name={dispatch.product_name}
                      dispatch_date={dispatch.dispatch_date}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Truck className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                    <p className="text-gray-500 text-xs">No recent dispatches</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center">
                  <PieChart className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Order Status</CardTitle>
                  <CardDescription className="text-xs">Distribution by status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {orderStatusChartData ? (
                <div className="h-48">
                  <Doughnut
                    data={orderStatusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 10,
                            font: {
                              size: 10
                            },
                            padding: 12
                          }
                        },
                      },
                      cutout: '55%',
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-xs">
                  No order data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Components by Category</CardTitle>
                  <CardDescription className="text-xs">Inventory distribution</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {componentsChartData ? (
                <div className="h-48">
                  <Doughnut
                    data={componentsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 10,
                            font: {
                              size: 10
                            },
                            padding: 12
                          }
                        },
                      },
                      cutout: '55%',
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-xs">
                  No component data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;