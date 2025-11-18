// Define the structure for a single legend item

import { defaultLegends, LegendItem } from "@/constants";
import Section from "./Section";

 
interface TableLegendsProps {
  legends?: LegendItem[];
}

const TableLegends: React.FC<TableLegendsProps> = ({ legends = defaultLegends }) => {
  return (
    <Section className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800 max-w-[350px] ml-auto"
    showShadow>
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 border-b pb-1 border-gray-200 dark:border-gray-700">
        Legends
      </h4>
      <div className="flex text-sm flex-col gap-y-1">
        {legends.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="font-bold text-primary min-w-[50px]">
              {item.abbreviation}:
            </span>
            <span className="text-primary">
              {item.fullName}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default TableLegends;