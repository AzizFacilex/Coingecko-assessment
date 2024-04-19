import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format, subDays } from "date-fns";
import { Select, MenuItem, TextField, SelectChangeEvent } from "@mui/material";
import { PriceData } from "../../../lib/types";

interface PriceHistoryChartProps {
  currency: string;
  priceData: PriceData[];
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ currency, priceData }) => {
  const [filteredPriceData, setFilteredPriceData] = useState<PriceData[]>([]);
  const [selectedRange, setSelectedRange] = useState<number>(7);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);
  useEffect(() => {
    if (selectedRange !== 0) {
      const fromDate = subDays(new Date(), selectedRange);
      const filteredData = priceData.filter((item) => item.date >= fromDate);
      setFilteredPriceData(filteredData);
      updateYAxisDomain(filteredData);
    }
  }, [selectedRange, priceData]);

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const filteredData = priceData.filter((item) => item.date >= date);
      setFilteredPriceData(filteredData);
      updateYAxisDomain(filteredData);
      setSelectedRange(0);
    }
  }, [selectedDate, priceData]);

  const updateYAxisDomain = (data: PriceData[]) => {
    const prices = data.map((item) => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const margin = 0.1;
    const priceRange = maxPrice - minPrice;
    const minDomain = Math.floor(minPrice - margin * priceRange);
    const maxDomain = Math.ceil(maxPrice + margin * priceRange);

    setYAxisDomain([minDomain, maxDomain]);
  };

  const handleRangeChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    setSelectedRange(event.target.value as number);
    setSelectedDate(null);
  };
  // useEffect(() => {
  //   if (chartContainerRef.current) {
  //     console.log(chartContainerRef.current)
  //     setChartWidth(chartContainerRef.current.offsetWidth);
  //   }
  // }, [filteredPriceData]);
  useEffect(() => {
    if (chartContainerRef.current) {
      setChartWidth(chartContainerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full md:w-fit">
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }} className=" flex justify-between">
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            id="goto-date"
            label="Go to Date"
            type="date"
            value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: "16px" }}
          />
        </div>
        <Select value={selectedRange} onChange={handleRangeChange} variant="outlined">
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={14}>Last 14 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
          <MenuItem value={365}>Last Year</MenuItem>
          <MenuItem value={0}>Custom Date</MenuItem>
        </Select>
      </div>

      <div className="hidden md:block" style={{ width: "100%", overflowX: "auto" }}>
        <LineChart width={800} height={400} data={filteredPriceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickMargin={10} tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          <YAxis domain={yAxisDomain} unit="€" />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} />
          <Legend formatter={() => `${currency} Price`} />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 6 }}  />
        </LineChart>
      </div>
      <div className="md:hidden" ref={chartContainerRef} style={{ width: "100%", overflowX: "auto" }}>
        <LineChart width={chartWidth} height={chartWidth} data={filteredPriceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          <YAxis domain={yAxisDomain} />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} />
          <Legend  formatter={() => `${currency} Price`} />

          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
