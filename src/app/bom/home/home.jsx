import { DASHBOARD } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Package, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import moment from "moment";

const MONTH_OPTIONS = [
  { label: "January 2026", value: "January 2026" },
  { label: "February 2026", value: "February 2026" },
  { label: "March 2026", value: "March 2026" },
  { label: "April 2026", value: "April 2026" },
  { label: "May 2026", value: "May 2026" },
  { label: "June 2026", value: "June 2026" },
  { label: "July 2026", value: "July 2026" },
  { label: "August 2026", value: "August 2026" },
  { label: "September 2026", value: "September 2026" },
  { label: "October 2026", value: "October 2026" },
  { label: "November 2026", value: "November 2026" },
  { label: "December 2026", value: "December 2026" },
];

const PIE_COLORS = ["#3b82f6", "#06b6d4"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(moment().format("MMMM YYYY"));

  const { trigger } = useApiMutation();
  const fetchDashboard = async (selectedMonth) => {
    try {
      const res = await trigger({
        url: DASHBOARD.list,
        method: "post",
        data: { year_month: selectedMonth },
      });

      setData(res.data);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchDashboard(month);
  }, [month]);

  if (!data) return null;
  const computedGraph2 = data.graph2?.map((item) => {
    const opening =
      Number(item.openpurch || 0) +
      Number(item.openproduction || 0) -
      Number(item.dispatchorder || 0);

    const closing =
      opening +
      Number(item.purch || 0) +
      Number(item.production || 0) -
      Number(item.dispatch || 0);

    return {
      ...item,
      opening_stock: opening,
      closing_stock: closing,
    };
  });

  return (
    <div className="min-h-screen p-2">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-500 font-medium">
            Manufacturing Overview & Operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          icon={Package}
          label="Total Products"
          value={data.total_products}
        />
        <MetricCard
          icon={Zap}
          label="Total Components"
          value={data.total_components}
        />
        <MetricCard
          icon={Clock}
          label="Pending"
          value={data.total_pending_orders}
        />
        <MetricCard
          icon={Clock}
          label="In Production"
          value={data.total_in_production_orders}
        />
        <MetricCard
          icon={TrendingUp}
          label="Read For Dispatch"
          value={data.total_ready_for_dispatch_orders || 0}
        />
      </div>
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border p-8">
          <h2 className="text-xl font-semibold mb-6">
            Order Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.graph1}
                dataKey="total"
                nameKey="order_status"
                outerRadius={100}
                label={({ order_status, total }) => `${order_status}: ${total}`}
              >
                {data.graph1.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        

        <div className="bg-white rounded-2xl border p-8 col-span-2">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-6">
              Component Stock Levels
            </h2>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={computedGraph2}
              barCategoryGap={20} // space between categories
              barGap={4} 
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="component_name"
                height={110}
                interval={0} 
                tick={({ x, y, payload }) => {
                  const words = payload.value.split(" ");
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        dy={16}
                        textAnchor="middle"
                        className="fill-slate-700 text-xs"
                      >
                        {words.map((word, index) => (
                          <tspan key={index} x={0} dy={index === 0 ? 0 : 14}>
                            {word}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                }}
              />

              <YAxis />

              <Tooltip formatter={(value) => [value, "Closing Stock"]} />

              <Bar
                dataKey="closing_stock"
                radius={[8, 8, 0, 0]}
                barSize={24} // ✅ smaller bar width
              >
                {computedGraph2.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      Number(entry.closing_stock) <
                      Number(entry.component_mini_stock)
                        ? "#ef4444"
                        : "#6366f1"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TableBlock
          title="Recent Dispatch Orders"
          headers={["Order Ref", "Vendor", "Qty", "Delivery Date"]}
          rows={data.recent_dispatch}
          renderRow={(row) => [
            row.order_ref,
            row.vendor_name,
            row.total_qnty,
            new Date(row.order_delivery_date).toLocaleDateString(),
          ]}
        />

        <TableBlock
          title="Recent Production"
          headers={["Prod Ref", "Product", "Qty", "Status"]}
          rows={data.recent_production}
          renderRow={(row) => [
            row.production_p_ref,
            row.product_name,
            row.production_p_qnty,
            row.production_p_status,
          ]}
        />
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Order Status Distribution
          </h2>

          {/* Chart */}
          <div className="w-full h-[240px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.graph1}
                  dataKey="total"
                  nameKey="order_status"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  labelLine={false}
                  label={({ percent }) =>
                    percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {data.graph1.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {data.graph1.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                  }}
                />
                <span className="text-gray-600">
                  {item.order_status} ({item.total})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border px-2 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="bg-accent/10 p-3 rounded-xl">
          <Icon className="text-accent" size={28} />
        </div>
      </div>
    </div>
  );
}

function TableBlock({ title, headers, rows, renderRow }) {
  return (
    <div className="bg-white rounded-2xl border p-2">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-accent/10">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-sm">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, i) => (
            <tr key={i} className="border-t">
              {renderRow(row).map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
