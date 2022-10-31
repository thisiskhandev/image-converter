import axios from "axios";
import React, { useEffect, useState } from "react";
// import { SECRET_KEY } from "./constants";
import { Base64 } from "./base64";
import FileBase from "react-file-base64";
import {
  ChakraProvider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  AlertDialogCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Input,
} from "@chakra-ui/react";

export default function App() {
  // Name of image
  const [seletedFile, setSelectedFile] = useState(null);
  // Base64 of image
  const [singleFile, setSingleFile] = useState([]);

  useEffect(() => {
    // console.log(singleFile);
    if (singleFile.selectedFile !== undefined) {
      let base64Pure = singleFile.selectedFile.slice(21);
      // console.log(base64Pure);
    }
    // document.querySelector('input[type="file"]').onchange = function () {
    //   console.log("Selected file: " + this.value);
    // };
    let file = document.querySelectorAll('input[type="file"]')[0];
    file.setAttribute("accept", "image/png, image/gif, image/jpeg");
    file.onchange = function () {
      console.log(this.value);
    };
  }, [singleFile]);

  const convertJPEGtoWEBP = async (event) => {
    event.preventDefault();
    // const formData = new FormData();
    // formData.append("seletedFile", seletedFile);
    // console.log(formData);
    try {
      const url = `https://v2.convertapi.com/convert/jpeg/to/webp?Secret=${process.env.REACT_APP_API_KEY}&StoreFile=true`;
      const res = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Name: "test.jpg",
              Data: singleFile,
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
      <ChakraProvider>
        {/* <img src={`data:image/jpeg;base64,${Base64}`} alt="" /> */}
        <form method="POST" onSubmit={convertJPEGtoWEBP}>
          <FormControl>
            {/* <input type="file" name="" id="" onChange={handleFileSelect} /> */}
            <Flex direction="column">
              <FormLabel>Select A File</FormLabel>
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) =>
                  setSingleFile({ ...singleFile, selectedFile: base64 })
                }
                onChange={handleFileSelect}
              />
              <Button type="submit">Submit</Button>
            </Flex>
          </FormControl>
        </form>
      </ChakraProvider>
    </>
  );
}
