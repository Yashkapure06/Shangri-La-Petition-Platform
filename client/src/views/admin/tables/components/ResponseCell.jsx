import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../config";

function ResponseCell({ row, getAllPetitions }) {
  const [response, setResponse] = useState(row.original.response || "");
  //also update the status of the petition
  const [status, setStatus] = useState(row.original.status || "");

  // update the stauts of the petition when threshold is equal to the number of signatures
  const handleResponseChange = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (row.original.signatures.length === row.original.threshold) {
        setStatus("closed");
      }

      const body = {
        response,
        status:
          row.original.signatures.length === row.original.threshold
            ? "closed"
            : "open",
      };

      const result = await axios.put(
        `${BASE_URL}/petition/update-response/${row.original._id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.status === 200) {
        toast.success("Response updated successfully!");
        getAllPetitions();
      }
    } catch (error) {
      toast.error("Failed to update response.");
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Write a response"
        className="border-[1px] border-gray-200 p-2 rounded-lg mr-2"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />
      <button
        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl"
        onClick={handleResponseChange}
      >
        Respond
      </button>
    </div>
  );
}

export default ResponseCell;
