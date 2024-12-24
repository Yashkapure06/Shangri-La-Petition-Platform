import React from "react";
import CardMenu from "../../../../components/card/CardMenu";
import Card from "../../../../components/card";
import Progress from "../../../../components/progress";
import { MdCancel, MdCheckCircle, MdOutlineError } from "react-icons/md";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable(props) {
  const { tableData, isAdmin } = props;
  // console.log("tableData", tableData);
  const [sorting, setSorting] = React.useState([]);
  let defaultData = tableData;
  const columns = [
    columnHelper.accessor("title", {
      id: "title",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Petition Title
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),

    columnHelper.accessor("description", {
      id: "description",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Petition Description
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),

    columnHelper.accessor("signatures", {
      id: "signatures",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Signatures
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p className="text-sm font-bold text-navy-700 dark:text-white">0/5</p>
        </div>
      ),
    }),

    columnHelper.accessor("progress", {
      id: "progress",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Progress
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <Progress width="w-[108px]" value={info.getValue()} />
        </div>
      ),
    }),
    // status
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Status
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            Open/Close
          </p>
        </div>
      ),
    }),

    ...(!isAdmin
      ? [
          columnHelper.accessor("actions", {
            id: "actions",
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Actions
              </p>
            ),
            cell: (info) => (
              <div className="flex ">
                <button
                  className="text-black linear rounded-xl  bg-gray-100 px-4 py-2 text-center text-base font-medium transition duration-200 
                    hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white
                    flex items-center justify-center me-2"
                  onClick={() => console.log("I am Signed => " + info.row.id)}
                >
                  Sign
                  <MdCheckCircle className="text-green-500 me-1 ml-4 dark:text-green-300" />
                </button>
              </div>
            ),
          }),
        ]
      : []),
  ];
  // eslint-disable-next-line
  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  // TODO: Check the flow of the data to be added in the table
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          All Petitions
        </div>
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup?.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table?.data?.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="border-b-[1px] border-gray-200 dark:border-gray-600"
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="pt-4 pb-4 pr-4 text-sm text-gray-800 dark:text-white"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
