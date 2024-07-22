"use client";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Detail() {
  const [data, setData] = useState<any[]>([]);

  async function fetchData() {
    const { data: fetchedData } = await supabase
      .from("trackerdata")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    setData(fetchedData || []);
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  function formatDateTime(timestamp: string) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('id-ID', { timeZone: 'UTC' });
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    });
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <>
      <div className="">
        <div className="block w-full rounded-lg">
          <div className="relative overflow-x-auto rounded-lg">
            <Table className="w-full text-sm text-left rtl:text-right">
              <TableHeader className="text-[10px] uppercase">
                <TableRow>
                  <TableHead scope="col" className="px-6 py-3">
                    Datetime
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Top Left
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Top Right
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Bottom Left
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Bottom Right
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Current
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Load Voltage
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Degrees
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Position
                  </TableHead>
                  <TableHead scope="col" className="px-6 py-3">
                    Temperature
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index} className="border-b text-xs">
                    <TableCell className="px-6 py-4">{formatDateTime(item.created_at)}</TableCell>
                    <TableCell className="px-6 py-4">{item.topleft}</TableCell>
                    <TableCell className="px-6 py-4">{item.topright}</TableCell>
                    <TableCell className="px-6 py-4">{item.bottomleft}</TableCell>
                    <TableCell className="px-6 py-4">{item.bottomright}</TableCell>
                    <TableCell className="px-6 py-4">{item.current} Volt</TableCell>
                    <TableCell className="px-6 py-4">{item.loadvoltage} mA</TableCell>
                    <TableCell className="px-6 py-4">{item.degrees} °</TableCell>
                    <TableCell className="px-6 py-4">{item.position}</TableCell>
                    <TableCell className="px-6 py-4">{item.temperature} °C</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
