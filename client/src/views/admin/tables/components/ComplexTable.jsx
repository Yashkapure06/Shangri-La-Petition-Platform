import React, { useEffect, useState } from "react";
import Card from "../../../../components/card";
import Progress from "../../../../components/progress";
import { MdCheckCircle } from "react-icons/md";
import { BASE_URL } from "../../../../config";
import axios from "axios";
import { toast } from "react-toastify";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const { tableData, isAdmin, userId, threshold, getAllPetitions } = props;
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(false);

  let currentUser = userId;

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
      cell: (info) => {
        const row = info.row.original; // Get the current row data
        const totalSignatures = row.signatures.length; // Current signatures
        // const threshold = row.threshold; // Total required signatures

        return (
          <div className="flex items-center">
            <p className="ml-2 text-sm text-navy-700 dark:text-white">
              {totalSignatures}/{threshold}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("signatures", {
      id: "progressbar",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Signatures
        </p>
      ),
      cell: (info) => {
        const row = info.row.original;
        const totalSignatures = row.signatures.length;
        const threshold = row.threshold;
        const progressValue = (totalSignatures / threshold) * 100;

        let progressColor = "gray";
        if (progressValue > 75) {
          progressColor = "green";
        } else if (progressValue > 50) {
          progressColor = "yellow";
        } else if (progressValue > 25) {
          progressColor = "orange";
        }

        return (
          <div className="flex flex-col space-y-1">
            {/* Progress bar */}
            <Progress
              value={progressValue}
              color={progressColor}
              width="w-[108px]"
            />
          </div>
        );
      },
    }),
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
            <span
              className={`${
                info.getValue() === "open"
                  ? "bg-green-300 border-green-500 border text-sm font-light dark:bg-green-400  p-1  px-3 rounded-full                   text-green-500 dark:text-[#252525]                  "
                  : "bg-red-300 border-red-500 border text-sm font-light dark:bg-red-300  p-1  px-3 rounded-full"
              }`}
            >
              {" "}
              {info.getValue()}
            </span>
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
            cell: (info) => {
              // TODO: Check if the current user is the creator of the petition
              const petition = info.row.original; // Get the row data
              const isCreator = petition.createdBy === currentUser; // Check if the current user created the petition
              const hasSigned = petition.signatures.includes(currentUser); // Check if the current user has already signed

              const cursor = isCreator;
              return (
                <div className="flex">
                  {/* Button for signing petitions */}
                  <button
                    className={`flex items-center justify-center text-black linear rounded-xl px-4 py-2 text-center text-base font-medium transition duration-200 ${
                      isCreator
                        ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                    onClick={() => {
                      if (!isCreator && !hasSigned) {
                        // Sign the petition if not signed and not the creator
                        // TODO: Implement the sign petition functionality with the petition ID with update API
                        signPetition(petition._id, petition.signatures);
                      }

                      if (hasSigned) {
                        toast.warn("You have already signed this petition.");
                      }
                    }}
                    // disabled={isCreator }
                    // style={{
                    //   cursor: cursor ? "not-allowed" : "pointer",
                    // }}
                    disabled={cursor}
                  >
                    {hasSigned ? "Signed" : "Sign"}
                    {hasSigned && (
                      <MdCheckCircle className="text-lg ml-2 text-green-500" />
                    )}
                  </button>
                </div>
              );
            },
          }),
        ]
      : []),
  ];

  const signPetition = async (petitionId, signatures) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const updatedSignatures = [...signatures, currentUser];

      const response = await axios.put(
        `${BASE_URL}/petition/update/${petitionId}`,
        {
          signatures: updatedSignatures,
          status: updatedSignatures.length === threshold ? "closed" : "open",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Petition signed successfully!");
        // update the status of the petition to closed if the threshold is reached
        // if (updatedSignatures.length === threshold) {
        //   await axios.put(
        //     `${BASE_URL}/petition/update/${petitionId}`,
        //     {
        //       status: "closed",
        //     },
        //     {
        //       headers: {
        //         Authorization: `Bearer ${token}`, // Adjust for your auth mechanism
        //       },
        //     }
        //   );
        // }
        getAllPetitions();
        // window.location.reload(); // Reload the page to reflect changes
      }
    } catch (error) {
      console.error("Error signing petition:", error);
      toast.error("Failed to sign the petition. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // useeffect to call the getallpetitions function as soon as someone signs a petition
  useEffect(() => {
    getAllPetitions();
  }, [loading]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
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
                      {{ asc: "↑", desc: "↓" }[header.column.getIsSorted()] ??
                        null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b-[1px] border-gray-200 dark:border-gray-600"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="text-sm font-medium text-navy-700 dark:text-white p-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
