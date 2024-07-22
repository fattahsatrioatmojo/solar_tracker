"use client";
import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DetailRecord from "@/components/DetailRecord";
import ReChart from "@/components/SimpleLineChart";

export default function MainSide() {
  const [data, setData] = useState<any[]>([]);
  const [viewDetail, setViewDetail] = useState(false);

  async function fetchData() {
    const { data: fetchedData } = await supabase
      .from("trackerdata")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    setData(fetchedData || []);
  }

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleExportCSV = async () => {
    try {
      const { data: fetchedData } = await supabase
        .from("trackerdata")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchedData && fetchedData.length > 0) {
        // Membuat header kolom
        const headers = [
          "id",
          "created_at",
          "topleft",
          "topright",
          "bottomleft",
          "bottomright",
          "current",
          "loadvoltage",
          "degrees",
          "position",
          "temperature",
        ];
        // Menyusun data CSV
        const csv =
          headers.join(",") +
          "\n" +
          fetchedData
            .map((item) => {
              return Object.values(item).join(",");
            })
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Data Record.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      console.error("Error exporting CSV:", error.message);
    }
  };

  const toggleView = () => {
    setViewDetail((prev) => !prev); // Toggle the state
  };

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
      <div>
        {data.map((item, index) => (
          <div key={index}>
            <section className="h-auto flex items-center">
              <div className="flex flex-col">
                <div className="lg:grid lg:grid-cols-4 gap-4 mx-4 my-4">
                  <div className="col-span-2">
                    <Card className="flex flex-col p-6 w-full h-auto mx-auto text-center shadow border rounded-xl xl:p-4 mb-4 lg:mb-0">
                      <div className="grid grid-cols-1 gap-2 lg:mb-14">
                        <div className="border-t-[10px] rounded-full border-gray-950 dark:border-white mb-2"></div>
                        <CardHeader className="flex flex-col items-start">
                          <CardTitle className="text-[24px] font-semibold text-left">
                            Arus & Tegangan Solar Panel
                          </CardTitle>
                          <CardDescription className="text-sm text-justify font-light pb-4">
                            Bagian ini menampilkan hasil monitoring dari sensor
                            INA219, yang membaca nilai Arus dan Tegangan baterai
                            penyimpan energi solar panel.
                          </CardDescription>
                          <CardDescription className="text-[11px] font-light tracking-widest">
                            {formatDateTime(item.created_at)}
                          </CardDescription>
                        </CardHeader>
                      </div>
                      <div className="border-t-[1.5px] border-gray-200 my-4"></div>
                      <div className="grid grid-cols-3 gap-4 mb-12">
                        <CardHeader className="flex justify-center items-center">
                          <p className="flex flex-col text-xs">
                            Arus dari Solar Panel{" "}
                            <span className="text-4xl font-semibold mt-8">
                              {item.current} <span className="text-sm">mA</span>
                            </span>
                          </p>
                        </CardHeader>
                        <CardHeader className="flex justify-center items-center">
                          <p className="flex flex-col text-xs">
                            Tegangan dari Solar Panel{" "}
                            <span className="text-4xl font-semibold mt-8">
                              {item.loadvoltage}{" "}
                              <span className="text-sm">Volt</span>
                            </span>
                          </p>
                        </CardHeader>
                        <CardHeader className="flex justify-center items-center">
                          <p className="flex flex-col text-xs">
                            Daya dari Solar Panel{" "}
                            <span className="text-4xl font-semibold mt-8">
                              {item.daya}{" "}
                              <span className="text-sm">Watt</span>
                            </span>
                          </p>
                        </CardHeader>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <CardHeader className="flex flex-col items-start">
                          <ModeToggle />
                        </CardHeader>
                        <CardHeader className="flex flex-col items-start">
                          <Button
                            className="w-full text-[10px] sm:text-[14px]"
                            onClick={handleExportCSV}
                          >
                            Export to .csv
                          </Button>
                        </CardHeader>
                        <CardHeader className="flex items-center">
                          <Button
                            className="w-full text-[10px] sm:text-[14px]"
                            onClick={toggleView}
                          >
                            {viewDetail ? "View Chart" : "View Record"}
                          </Button>
                        </CardHeader>
                      </div>
                    </Card>
                  </div>

                  <div className="col-span-2">
                    <Card className="flex flex-col p-6 w-full h-auto mx-auto xl:p-4 mb-4 lg:mb-0">
                      <CardHeader>
                        {viewDetail ? <DetailRecord /> : <ReChart />}
                      </CardHeader>
                    </Card>
                  </div>
                </div>

                <div className="lg:grid lg:grid-cols-3 gap-4 mx-4">
                  <Card className="flex flex-col p-6 w-full h-auto mx-auto text-center shadow border rounded-xl xl:p-4 mb-4 lg:mb-0">
                    <div className="border-t-[10px] rounded-full border-gray-950 dark:border-white mb-2"></div>
                    <div className="grid grid-cols-1 gap-2">
                      <CardHeader className="flex flex-col items-start">
                        <CardTitle className="text-[24px] font-semibold text-left">
                          Intensitas Cahaya Sensor LDR
                        </CardTitle>
                        <CardDescription className="text-sm text-justify font-light pb-4">
                          Bagian ini menampilkan nilai intensitas cahaya yang
                          dibaca oleh sensor LDR. Terdapat empat sensor yang
                          terpasang.
                        </CardDescription>
                        <CardDescription className="text-[11px] font-light tracking-widest">
                          {formatDateTime(item.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <div className="border-t-[1.5px] border-gray-200 mb-4 mt-20"></div>
                      <div className="flex justify-center items-center">
                        <div className="grid grid-cols-4 gap-10">
                          <div className="flex justify-start items-center">
                            <p className="flex flex-col text-xs">
                              Top Left{" "}
                              <span className="font-semibold mt-2">
                                {item.topleft}
                              </span>
                            </p>
                          </div>
                          <div className="flex justify-start items-center">
                            <p className="flex flex-col text-xs">
                              Top Right{" "}
                              <span className="font-semibold mt-2">
                                {item.topright}
                              </span>
                            </p>
                          </div>
                          <div className="flex justify-end items-center">
                            <p className="flex flex-col text-xs">
                              Bottom Left{" "}
                              <span className="font-semibold mt-2">
                                {item.bottomleft}
                              </span>
                            </p>
                          </div>
                          <div className="flex justify-end items-center">
                            <p className="flex flex-col text-xs">
                              Bottom Right{" "}
                              <span className="font-semibold mt-2">
                                {item.bottomright}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="flex flex-col p-6 w-full h-auto mx-auto text-center shadow border rounded-xl xl:p-4 mb-4 lg:mb-0">
                    <div className="border-t-[10px] rounded-full border-gray-950 dark:border-white mb-2"></div>
                    <div className="grid grid-cols-1 gap-2">
                      <CardHeader className="flex flex-col items-start">
                        <CardTitle className="text-[24px] font-semibold text-left">
                          Derajat & Arah Posisi Panel Surya
                        </CardTitle>
                        <CardDescription className="text-sm text-justify font-light pb-4">
                          Bagian ini menampilkan derajat dan arah posisi dari
                          servo horizontal dan vertikal dengan sensor GY-271 &
                          GY-521.
                        </CardDescription>
                        <CardDescription className="text-[11px] font-light tracking-widest">
                          {formatDateTime(item.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <div className="border-t-[1.5px] border-gray-200 mb-4 mt-20"></div>
                      <div className="flex justify-center items-center">
                        <div className="grid grid-cols-2 gap-32">
                          <div className="flex justify-center items-center gap-16">
                            <p className="flex flex-col text-xs">
                              Derajat Servo{" "}
                              <span className="font-semibold mt-2">
                                {item.degrees}
                              </span>
                            </p>
                          </div>
                          <div className="flex justify-center items-center gap-16">
                            <p className="flex flex-col text-xs">
                              Arah Servo{" "}
                              <span className="font-semibold mt-2">
                                {item.arahKompas}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="flex flex-col p-6 w-full h-auto mx-auto text-center shadow border rounded-xl xl:p-4 mb-4 lg:mb-0">
                    <div className="border-t-[10px] rounded-full border-gray-950 dark:border-white mb-2"></div>
                    <div className="grid grid-cols-1 gap-2">
                      <CardHeader className="flex flex-col items-start">
                        <CardTitle className="text-[24px] font-semibold text-left">
                          Suhu Pusat Kontrol
                        </CardTitle>
                        <CardDescription className="text-sm text-justify font-light pb-4">
                          Bagian ini membaca nilai suhu pada pusat kontrol
                          khususnya ESP32 dengan menggunakan sensor DHT11.
                        </CardDescription>
                        <CardDescription className="text-[11px] font-light tracking-widest">
                          {formatDateTime(item.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <div className="border-t-[1.5px] border-gray-200 mb-4 mt-20"></div>
                      <div className="flex justify-center items-center">
                        <div className="grid grid-cols-1">
                          <div className="flex justify-center items-center gap-16">
                            <p className="flex flex-col text-xs">
                              Suhu Pusat Kontrol{" "}
                              <span className="font-semibold mt-2">
                                {item.temperature} °C
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          </div>
        ))}
      </div>
    </>
  );
}
