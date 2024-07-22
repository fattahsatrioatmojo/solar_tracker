import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import supabase from "@/utils/supabase";
import { format } from 'date-fns';

interface DataPoint {
  current: number;
  created_at: number;
}

const SimpleLineChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [animationId, setAnimationId] = useState<number>(0);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("trackerdata")
      .select("current, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching data from Supabase:', error);
    } else {
      const transformedData: DataPoint[] = data.map((item: any) => ({
        current: item.current,
        created_at: new Date(item.created_at).getTime() // Convert to timestamp
      }));
      console.log("Data fetched: ", transformedData); // Log data yang diambil
      setData(transformedData.reverse()); // Reverse to show latest data on the right
      setAnimationId(prev => prev + 1); // Update animationId to trigger animation
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      console.log("Fetching data..."); // Log when polling
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Function to format date and time in UTC
  function formatDateTime(timestamp: number) {
    const date = new Date(timestamp);
    const isoString = date.toISOString(); // Convert to ISO string
    const formattedDate = isoString.split('T')[0]; // Extract date part
    const formattedTime = isoString.split('T')[1].split('.')[0]; // Extract time part
    return `${formattedDate} ${formattedTime}`; // Combine date and time
  }

  // Custom Tooltip Component with Tailwind CSS
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formattedDateTime = formatDateTime(label);

      return (
        <div className="bg-white border border-gray-300 p-2 rounded-lg shadow-md">
          <p className="text-xs font-semibold text-gray-800">{`Date/Time: ${formattedDateTime}`}</p>
          <p className="text-xs text-gray-600">{`Current: ${payload[0].value} mA`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={407}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 2, right: 10, left: 10, bottom: 2 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="1 1" strokeWidth={1} vertical={true} horizontal={true} />
        <XAxis
          dataKey="created_at"
          tick={{ fontSize: 8 }}
          tickFormatter={(tick) => formatDateTime(tick)} // Show date and time in UTC
        />
        <YAxis
          dataKey="current"
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          content={<CustomTooltip />} // Use custom tooltip
          contentStyle={{ fontSize: 12 }}
        />
        <Line 
          type="monotone" 
          dataKey="current" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }}
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
          animationId={animationId} // Use animationId to trigger animation
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleLineChart;
