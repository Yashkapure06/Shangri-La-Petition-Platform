import React, { useState, useEffect, useRef } from "react";
import InputField from "../../components/fields/InputField";
import { BsQrCode } from "react-icons/bs";
import QrScanner from "qr-scanner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const [isQrPopupOpen, setIsQrPopupOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let scanner = null;

    if (isQrPopupOpen && videoRef.current) {
      scanner = new QrScanner(videoRef.current, (result) => {
        setScanResultWebCam(result);
        setIsQrPopupOpen(false);
        const bioIdInput = document.getElementById("bioId");
        if (bioIdInput) bioIdInput.value = result;
        const regex = /^[A-Z0-9]{10}$/;
        if (!result.match(regex)) {
          toast.error("Invalid Bio Id");
          bioIdInput.value = "";
        }
        toast.success("Bio Id Accepted Successfully");
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
        />
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@jack.com"
          id="email"
          type="text"
        />
        <InputField
          variant="auth"
          extra="mb-3 w-1/2"
          label="Date of Birth*"
          placeholder="DD/MM/YYYY"
          id="dateOfBirth"
          type="date"
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
            readOnly
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
        />

        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
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
