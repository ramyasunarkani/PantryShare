import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#24B6D6] text-white text-center py-4 mt-auto w-full">
      <p className="text-sm">
        © {new Date().getFullYear()} PantryShare — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
