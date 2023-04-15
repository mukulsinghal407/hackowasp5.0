import React from "react";

import {
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@mui/material";

const TableCompo = (props) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Blood Group : </strong>
            </TableCell>
            {props.headings.map((heading, index) => {
              return (
                <TableCell key={index}>
                  <strong>{heading}</strong>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <strong>Quantity : </strong>
            </TableCell>
            {props.item.map((e, index) => {
              return <TableCell key={index}>{e}</TableCell>;
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableCompo;
