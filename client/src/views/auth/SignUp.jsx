import React, { useState, useEffect, useRef } from "react";
import InputField from "../../components/fields/InputField";
import { BsQrCode } from "react-icons/bs";
import QrScanner from "qr-scanner";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../config";

export default function SignUp() {
  const navigate = useNavigate();

  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const [isQrPopupOpen, setIsQrPopupOpen] = useState(false);
  const videoRef = useRef(null);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
    bioId: "",
    password: "",
  });

  useEffect(() => {
    let scanner = null;

    if (isQrPopupOpen && videoRef.current) {
      scanner = new QrScanner(videoRef.current, async (result) => {
        setScanResultWebCam(result);
        setIsQrPopupOpen(false);
        const bioIdInput = document.getElementById("bioId");
        if (bioIdInput) bioIdInput.value = result;
        const regex = /^[A-Z0-9]{10}$/;
        if (!result.match(regex)) {
          toast.error("Invalid Bio Id");
          bioIdInput.value = "";
        }
        // toast.success("Bio Id Accepted Successfully");
        const bioIdExists = await checkIsBioIdExists(result);
        if (bioIdExists === false) {
          bioIdInput.value = "";
        }
      });
      scanner.start();
    }

    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [isQrPopupOpen]);

  const handleOpenQrPopup = () => {
    setIsQrPopupOpen(true);
  };

  const handleCloseQrPopup = () => {
    setIsQrPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCredentials({ ...credentials, [id]: value });
  };

  const checkIsBioIdExists = async (bioId) => {
    try {
      const response = await axios.get(`${BASE_URL}/check/bioId/${bioId}`);
      console.log(response.data);
      if (response.data.status === true) {
        toast.error("Bio Id already exists");
        setScanResultWebCam("");
      } else {
        toast.success("Bio Id Accepted Successfully");
      }
      // return response.data;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handlePetitionerSignUp = async () => {
    try {
      const body = {
        username: credentials.username,
        email: credentials.email,
        dob: credentials.dateOfBirth,
        bioId: scanResultWebCam,
        password: credentials.password,
        role: "petitioner",
      };
      const response = await axios.post(
        `${BASE_URL}/auth/petitioner/register`,
        body
      );
      toast.success("SignUp successful!");
      console.log(response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("role", "petitioner");
      localStorage.setItem("userId", response.data.data._id);

      navigate("/petitioner");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
      <div className="mt-[1.2vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your details to create your account!
        </p>
        <InputField
          variant="auth"
          extra="mb-3"
          label="UserName*"
          placeholder="Jack"
          id="username"
          type="text"
          value={credentials.username}
          handleChange={handleInputChange}
        />
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@jack.com"
          id="email"
          type="text"
          value={credentials.email}
          handleChange={handleInputChange}
        />
        <InputField
          variant="auth"
          extra="mb-3 w-1/2"
          label="Date of Birth*"
          placeholder="DD/MM/YYYY"
          id="dateOfBirth"
          type="date"
          value={credentials.dateOfBirth}
          handleChange={handleInputChange}
        />
        <div className="flex items-center justify-between w-full mb-3">
          <InputField
            variant="auth"
            extra="mb-3 mr-2 w-1/2"
            label="Bio Id*"
            placeholder="7D*******2"
            id="bioId"
            type="text"
            value={scanResultWebCam}
            handleChange={handleInputChange}
          />
          <button
            onClick={handleOpenQrPopup}
            className="ml-2 mt-4 w-1/2 rounded-xl bg-gray-100 py-[12px] text-base font-medium text-gray-800 transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          >
            <BsQrCode className="inline mr-2" />
            Scan QR Code
          </button>
        </div>

        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          value={credentials.password}
          handleChange={handleInputChange}
        />

        <button
          onClick={handlePetitionerSignUp}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Sign Up
        </button>
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already registered?
          </span>
          <Link
            to="/auth/petitioner/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign In
          </Link>
        </div>
      </div>

      {isQrPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-3/4 max-w-md p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
            <button
              onClick={handleCloseQrPopup}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300"
            >
              ✕
            </button>
            <h3 className="mb-4 text-lg font-bold text-center text-navy-700 dark:text-white">
              Scan QR Code
            </h3>
            <video
              ref={videoRef}
              className="rounded-lg"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
