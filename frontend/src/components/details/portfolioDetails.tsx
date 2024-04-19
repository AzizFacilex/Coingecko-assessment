import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  IconButton,
  Input,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePortfolioEntry, getAllPortfolioEntries, updatePortfolioEntry } from "../../services/backendApi";
import { CoinName, PortfolioData } from "../../lib/types";
import { usePortfolioContext } from "../../context/portfolioContext";
import { Cancel, CheckCircle } from "@mui/icons-material";
import GppBadIcon from "@mui/icons-material/GppBad";

const PortfolioDetails: React.FC = () => {
  const { totalBalance, updateTotalBalance } = usePortfolioContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string>("currency");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [portfolioEntries, setPortfolioEntries] = useState<any[]>([]);
  const [totalBitcoinBalance, setTotalBitcoinBalance] = useState(0);
  const [totalEthereumBalance, setTotalEthereumBalance] = useState(0);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedData, setEditedData] = useState<{ [key: number]: any }>({}); // State to track edited data
  const [error, setError] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const handleTimeout = () => {
      const timer = setTimeout(() => {
        setError(false);
        setValidationError("");
        setDeletionSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    };
  
    if (error || deletionSuccess) {
      handleTimeout();
    }
  }, [error, deletionSuccess]);

  const toggleEditMode = (id: number) => {
    setEditMode((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    setEditedData({})
  };
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPortfolioEntries();
        const formattedEntries: PortfolioData[] = response.data.map((entry: any) => ({
          ...entry,
          amount: parseFloat(entry.amount),
          purchasePrice: parseFloat(entry.purchasePrice),
        }));
        setPortfolioEntries(formattedEntries);

        setLoading(false);
      } catch (error) {
        console.debug("Error fetching portfolio data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [totalBalance]);

  useEffect(() => {
    updateTotalBalance();
    const bitcoinBalance = portfolioEntries
      .filter((entry) => entry.currency === CoinName.Bitcoin)
      .reduce((total, entry) => total + entry.purchasePrice * entry.amount, 0);
    const ethereumBalance = portfolioEntries
      .filter((entry) => entry.currency === CoinName.Ethereum)
      .reduce((total, entry) => total + entry.purchasePrice * entry.amount, 0);
    setTotalBitcoinBalance(bitcoinBalance);
    setTotalEthereumBalance(ethereumBalance);
  }, [portfolioEntries, updateTotalBalance]);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedPortfolioEntries = portfolioEntries.slice().sort((a, b) => {
    const aValue = orderBy === "date" ? a.purchaseTime : a.purchaseTime;
    const bValue = orderBy === "date" ? b.purchaseTime : b.purchaseTime;
    return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  async function handleDelete(id: number) {
    await deletePortfolioEntry(id)
      .then((result) => {
        setPortfolioEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
        setDeletionSuccess(true);
      })
      .catch((error) => {
        setError(true);
        setValidationError("Error deleting portfolio entry!");
        console.debug("Error deleting portfolio entry:", error);
      });
  }

  const handleInputChange = (id: number, field: string, value: any) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: number) => {
    try {
      const editedEntry = editedData[id];
      if (!editedEntry) {
        toggleEditMode(id);
        return;
      }
      const oldEntryIndex = portfolioEntries.findIndex((entry) => entry.id === id);
      if (oldEntryIndex === -1) {
        toggleEditMode(id);
        return;
      }
      const oldEntry = portfolioEntries[oldEntryIndex];
      const updatedEntry = {
        ...oldEntry,
        ...editedEntry,
      };
      const updatedData = await updatePortfolioEntry(id, updatedEntry);
      setPortfolioEntries((prevEntries) => {
        const updatedEntries = [...prevEntries];
        updatedEntries[oldEntryIndex] = updatedData.data;
        return updatedEntries;
      });
      toggleEditMode(id);
    } catch (error) {
      setError(true);
      setValidationError("Error updating portfolio entry!");
      console.debug("Error updating portfolio entry:", error);
    }
  };
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border p-4 rounded-md">
              <p className="font-semibold text-xl mb-2">{CoinName.Bitcoin}</p>
              <p className="text-gray-700">Total Balance in EUR: €{totalBitcoinBalance.toFixed(4)}</p>
            </div>
            <div className="border p-4 rounded-md">
              <p className="font-semibold text-xl mb-2">{CoinName.Ethereum}</p>
              <p className="text-gray-700">Total Balance in EUR: €{totalEthereumBalance.toFixed(4)}</p>
            </div>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "currency"}
                        direction={orderBy === "currency" ? order : "asc"}
                        onClick={() => handleSort("currency")}
                      >
                        Currency
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "amount"}
                        direction={orderBy === "amount" ? order : "asc"}
                        onClick={() => handleSort("amount")}
                      >
                        Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "purchasePrice"}
                        direction={orderBy === "purchasePrice" ? order : "asc"}
                        onClick={() => handleSort("purchasePrice")}
                      >
                        Purchase Price (EUR)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "purchaseTime"}
                        direction={orderBy === "purchaseTime" ? order : "asc"}
                        onClick={() => handleSort("purchaseTime")}
                      >
                        Purchase Time
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPortfolioEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {editMode[entry.id] ? (
                          <Input
                            type="text"
                            value={editedData[entry.id]?.currency || entry.currency}
                            onChange={(e) => handleInputChange(entry.id, "currency", e.target.value)}
                            style={{ width: `${(editedData[entry.id]?.currency || entry.currency).length * 12}px` }}
                          />
                        ) : (
                          entry.currency
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode[entry.id] ? (
                          <Input
                            type="number"
                            value={editedData[entry.id]?.amount || entry.amount}
                            onChange={(e) => handleInputChange(entry.id, "amount", e.target.value)}
                          />
                        ) : (
                          entry.amount.toFixed(6)
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode[entry.id] ? (
                          <Input
                            type="number"
                            value={editedData[entry.id]?.purchasePrice || entry.purchasePrice}
                            onChange={(e) => handleInputChange(entry.id, "purchasePrice", e.target.value)}
                          />
                        ) : (
                          `€${entry.purchasePrice}`
                        )}
                      </TableCell>
                      <TableCell>{new Date(entry.purchaseTime).toLocaleString()}</TableCell>
                      <TableCell>
                        {editMode[entry.id] ? (
                          <>
                            <IconButton onClick={() => handleSave(entry.id)} aria-label="save">
                              <CheckCircle />
                            </IconButton>
                            <IconButton onClick={() => toggleEditMode(entry.id)} aria-label="save">
                              <Cancel></Cancel>
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => toggleEditMode(entry.id)} aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(entry.id)} aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {error && (
              <div className="flex justify-end">
                <p className="bg-red-500 text-white rounded-xl p-2 w-fit m-2">
                  <GppBadIcon fontSize="small" className="text-white" aria-hidden="true" />
                  {validationError}
                </p>
              </div>
            )}
            {deletionSuccess && (
              <div className="flex justify-end">
                <p className="bg-green-500 text-white rounded-xl p-2 w-fit m-2">
                  <GppBadIcon fontSize="small" className="text-white" aria-hidden="true" />
                  Entry has been deleted!
                </p>
              </div>
            )}

            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={sortedPortfolioEntries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showLastButton
              showFirstButton
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioDetails;
