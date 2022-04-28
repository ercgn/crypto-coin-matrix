import React, { useCallback, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DataGrid } from "@mui/x-data-grid";

function App() {
  const [dataRows, setData] = useState<any[]>();
  const [headerRow, setHeaderRow] = useState<string[]>();

  const headerMapping = {
    coins: "Coins",
    type: "Type",
    mechanism: "Mechanism ",
    multiSigHot: "Multi-Sig Hot",
    multiSigCustody: "Multi-Sig Custody",
    tssHot: "TSS Hot",
    tssCustody: "TSS Custody",
    trade: "Trade",
    staking: "Staking",
    ovc: "OVC",
    wrw: "WRW",
    typeOfCoin: "Type of Coin",
    blockchain: "Blockchain",
    testnet: "Testnet\r",
  };

  const columns = [];
  const reverseMap: any = {};
  for (const [key, value] of Object.entries(headerMapping)) {
    reverseMap[value] = key;
    columns.push({
      field: key,
      headerName: value,
      type: "string",
    });
  }

  const fetchCSVText = useCallback(async () => {
    const csvFile = await fetch("./matrix-data.csv");
    const csvRawText = await csvFile.text();
    const csvRows: any[] = [];
    let headerRow: string[] = [];

    csvRawText.split("\n").forEach((rawRow, index) => {
      const rowData = rawRow.split(",");
      if (index === 0) {
        headerRow = rowData;
      } else {
        const csvRow: any = {};
        rowData.forEach((value, idx) => {
          csvRow[reverseMap[headerRow[idx]]] = value;
        });
        csvRow.id = index;
        csvRows.push(csvRow);
      }
    });

    setHeaderRow(headerRow);
    setData(csvRows);
  }, [setHeaderRow, setData, reverseMap]);

  useEffect(() => {
    fetchCSVText();
  }, [fetchCSVText]);

  if (!dataRows) {
    return null;
  }

  console.log(JSON.stringify(headerRow));
  console.log(JSON.stringify(dataRows));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            className="Table"
            rows={dataRows}
            columns={columns}
            checkboxSelection
          />
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
