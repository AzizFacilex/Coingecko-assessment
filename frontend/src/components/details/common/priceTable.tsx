import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { PriceData } from "../../../lib/types";

interface PriceTableProps {
  currency: string;
  priceData: PriceData[];
}

const PriceTable: React.FC<PriceTableProps> = ({ currency, priceData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string>("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [gotoDate, setGotoDate] = useState<Date | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  const sortedData = priceData.slice().sort((a, b) => {
    const aValue = orderBy === "date" ? a.date.getTime() : a.price;
    const bValue = orderBy === "date" ? b.date.getTime() : b.price;
    return order === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  useEffect(() => {
    setOrderBy("date");
    setOrder("desc");
    const index = sortedData.findIndex((row) => row.date.toDateString() === gotoDate?.toDateString());
    if (index !== -1) {
      const page = Math.floor(index / rowsPerPage);
      const rowIndex = index % rowsPerPage;
      setPage(page);
      setHighlightedRow(rowIndex);
      setTimeout(() => {
        setHighlightedRow(null);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gotoDate]);

  const slicedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const calculatePreviousPrice = (row: PriceData, dataIndex: number, sortedData: PriceData[]): number | null => {
    return dataIndex < sortedData.length - 1 ? sortedData[dataIndex + 1].price : null;
  };

  const calculatePriceChange = (row: PriceData, previousPrice: number | null): number | null => {
    return previousPrice !== null ? ((row.price - previousPrice) / previousPrice) * 100 : null;
  };

  const getPriceColor = (priceChange: number | null): string => {
    return priceChange !== null ? (priceChange > 0 ? "text-green-400" : "text-red-400") : "inherit";
  };

  const getPriceChangeText = (priceChange: number | null): string => {
    return priceChange !== null
      ? priceChange > 0
        ? `(+${priceChange.toFixed(2)}%)`
        : `(${priceChange.toFixed(2)}%)`
      : "";
  };

  return (
    <div className="w-fit md:w-3/4">
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          id="goto-date"
          label="Go to Date"
          type="date"
          value={gotoDate ? format(gotoDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setGotoDate(new Date(e.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginRight: "16px" }}
        />
      </div>
      <TableContainer  component={Paper}>
      <h2 className="text-3xl font-bold text-center mb-8">Price History Table</h2>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ width: "50%" }}>
                Change (7d)
              </TableCell>
              <TableCell align="right" style={{ width: "50%" }}>
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? order : "asc"}
                  onClick={() => handleSort("price")}
                >
                  {currency} Price (EUR) Compared to Previous Day
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((row, index) => {
              const dataIndex = page * rowsPerPage + index;
              const previousPrice = calculatePreviousPrice(row, dataIndex, sortedData);
              const priceChange = calculatePriceChange(row, previousPrice);
              const priceColor = getPriceColor(priceChange);
              const priceChangeText = getPriceChangeText(priceChange);

              const priceChangeLastWeek = calculatePriceChange(row, sortedData[dataIndex + 7].price);
              const priceColorLastWeek = getPriceColor(priceChangeLastWeek);
              const priceChangeLastWeekText = getPriceChangeText(priceChangeLastWeek);
              return (
                <TableRow key={index} className={highlightedRow === index ? "highlighted" : ""}>
                  <TableCell>{format(row.date, "yyyy-MM-dd")}</TableCell>
                  <TableCell align="right">
                    <span className={priceColorLastWeek}>
                      {(row.price - sortedData[dataIndex + 7].price).toFixed(2)}
                    </span>{" "}
                    <span className={priceColorLastWeek}>{priceChangeLastWeekText}</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className={priceColor}>{row.price}</span>{" "}
                    <span className={priceColor}>{priceChangeText}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={priceData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showLastButton
        showFirstButton
      />
    </div>
  );
};

export default PriceTable;
