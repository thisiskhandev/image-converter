import axios from "axios";
import React, { useEffect, useState } from "react";
import { SECRET_KEY } from "./constants";
import { Base64 } from "./base64";

export default function App() {
  const [seletedFile, setSelectedFile] = useState(null);
  const convertJPEGtoWEBP = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("seletedFile", seletedFile);
    console.log(formData);
    try {
      const url = `https://v2.convertapi.com/convert/jpeg/to/webp?Secret=${SECRET_KEY}&StoreFile=true`;
      const res = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        // data: {},
        Parameters: [
          {
            Name: "File",
            FileValue: {
              // Name: seletedFile.name,
              // Data: "<Base64 encoded file content>",
              Name: "test.jpg",
              Data: Base64,
            },
          },
          {
            Name: "StoreFile",
            Value: true,
          },
        ],
      });
      console.log(res);
      console.log(res.data);
    } catch (error) {
      console.log("Catching error: " + error);
    }
  };
  const handleFileSelect = (e) => {
    console.log(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };
  return (
    <>
      {/* <img src={Base64} alt="" /> */}
      <form method="POST" onSubmit={convertJPEGtoWEBP}>
        <label htmlFor="">Upload some file</label>
        <br />
        <input type="file" name="" id="" onChange={handleFileSelect} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
