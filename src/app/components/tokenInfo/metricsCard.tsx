import { DataList } from "@radix-ui/themes";

interface MetricsCardProps {
  title: string;
  value: string;
}

export function MetricsCard({ title, value }: MetricsCardProps) {
  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.Label className="text-sm font-medium text-gray-500">
          {title}
        </DataList.Label>
        <DataList.Value className="text-2xl font-semibold text-gray-900">
          {value}
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
}
