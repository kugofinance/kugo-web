import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface YieldChartProps {
  data: {
    day: string;
    withStrategy: number;
    withoutStrategy: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
      <p className="text-gray-200 font-medium mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const YieldChart = ({ data }: YieldChartProps) => (
  <LineChart width={600} height={300} data={data}>
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip
      content={<CustomTooltip />}
      cursor={{ stroke: "#4B5563" }} // Dark gray line for the cursor
    />
    <Legend display={"dark"} />
    <Line
      type="monotone"
      dataKey="withStrategy"
      name="With Strategy"
      stroke="#06b6d4"
    />
    <Line
      type="monotone"
      dataKey="withoutStrategy"
      name="ETH Staking Only"
      stroke="#94a3b8"
    />
  </LineChart>
);
