import React, { useState, useEffect, useRef } from "react";
import InputField from "../../components/fields/InputField";
import { Link } from "react-router-dom";
import { BsQrCode } from "react-icons/bs";
import QrScanner from "qr-scanner";
import { toast } from "react-toastify";

export default function SignIn() {
  const [scanResult, setScanResult] = useState("");
  const [isQrPopupOpen, setIsQrPopupOpen] = useState(false);
  const videoRef = useRef(null);

  const adminUrl = window.location.href.includes("admin");

  useEffect(() => {
    let scanner = null;

    if (isQrPopupOpen && videoRef.current) {
      scanner = new QrScanner(videoRef.current, (result) => {
        toast.success(`Scanned successfully: ${result}`);
        setScanResult(result);
        // TODO: Call an API for logging in using QR code
        setIsQrPopupOpen(false);
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

  const handleAdminSignIn = () => {};

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
      {/* Sign in section */}
      <div className="mt-[1.2vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          {!adminUrl ? "Sign In" : "Admin Sign In"}
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
          value={scanResult}
          readOnly
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
        />
        {!adminUrl && (
          <>
            <div className="flex items-center justify-center w-full mt-4">
              <hr className="w-1/3 border-gray-300 dark:border-gray-600" />
              <span className="mx-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                OR
              </span>
              <hr className="w-1/3 border-gray-300 dark:border-gray-600" />
            </div>

            <button
              onClick={handleOpenQrPopup}
              className="mt-4 w-full rounded-xl bg-gray-100 py-[12px] text-base font-medium text-gray-800 transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600"
            >
              <BsQrCode className="inline mr-2" />
              Sign in using QR Code
            </button>
          </>
        )}

        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Sign In
        </button>
        {!adminUrl && (
          <div className="mt-4">
            <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
              Not registered yet?
            </span>
            <Link
              to="/auth/petitioner/sign-up"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Create an account
            </Link>
          </div>
        )}
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
