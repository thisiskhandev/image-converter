import { AlertBadFileType, AlertUnavailable } from "./components/AlertDialogs";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import { Base64 } from "./base64";
import FileBase from "react-file-base64";
import SweetAlert2 from "react-sweetalert2";

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
  useToast,
  Wrap,
  WrapItem,
  Image,
  Skeleton,
  Container,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  SkeletonText,
} from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./App.css";
export default function App() {
  // Name of image
  const [seletedFileName, setSelectedFileName] = useState(null);
  // Getting image from input field
  const [singleFile, setSingleFile] = useState([]);
  // Converting image into base64
  const [singleFileBase64, setSinglFileBase64] = useState();
  // Button Loading
  const [btnLoading, setBtnLoading] = useState(false);
  // Loading
  // const [isLoading, setLoading] = useState(false);
  // Btn Disable Loading
  const [btnDisableLoading, setbtnDisableLoading] = useState(true);
  // Show Downlod Button
  const [showDownload, setShowDownload] = useState(false);
  // WebP Converted file name and download button
  const [convertedWebpData, setConvertedWebpData] = useState({
    fileName: "",
    downloadLink: "",
  });
  // Alert State
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (singleFile.selectedFile !== undefined) {
      // PNG
      let base64Pure = singleFile.selectedFile.slice(22);
      // JPG
      // let base64Pure = singleFile.selectedFile.slice(23);
      setSinglFileBase64(base64Pure);
      // console.log(singleFileBase64);
    }
    let file = document.querySelectorAll('input[type="file"]')[0];
    // file.setAttribute("accept", "image/png, image/gif, image/jpeg");
    file.setAttribute("accept", "image/png");
    file.setAttribute("id", "imageShot");
    file.onchange = function (e) {
      setSelectedFileName(e.target.value.slice(12));
      setbtnDisableLoading(false);
    };
  }, [singleFile, singleFileBase64]);

  useEffect(() => {
    if (seletedFileName === null || seletedFileName === undefined) {
      return;
    }
    console.log(seletedFileName);
  }, [seletedFileName]);

  const convertJPEGtoWEBP = async (event) => {
    event.preventDefault();
    try {
      // setLoading(true);
      const url = `https://v2.convertapi.com/convert/png/to/webp?Secret=${process.env.REACT_APP_API_KEY}&StoreFile=true`;
      const res = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Name: seletedFileName,
              Data: singleFileBase64,
            },
          },
          {
            Name: "StoreFile",
            Value: true,
          },
        ],
      });
      setBtnLoading(false);
      if (res.status === 200) {
        setbtnDisableLoading(true);
        setShowDownload(true);
      }
      if (res.status === 200 && res.data !== null) {
        // fileName: res.data.Files[0].FileName,
        // downloadLink: res.data.Files[0].Url,
        res.data.Files.forEach((val) => {
          setConvertedWebpData({
            fileName: val.FileName,
            downloadLink: val.Url,
          });
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 500 || error.response.status === 503) {
        setSwalProps(AlertBadFileType);
      }
    }
  };
  // const handleFileSelect = (e) => {
  //   console.log(e.target.files[0].name);
  //   setSelectedFileName(e.target.files[0]);
  // };
  const [swalProps, setSwalProps] = useState({});
  return (
    <>
      <ChakraProvider>
        <SweetAlert2
          {...swalProps}
          didClose={() => {
            window.location.reload();
          }}
        />
        <Container maxW={"1140px"}>
          <Flex
            bg={"gray.100"}
            alignItems={"center"}
            justifyContent="center"
            h="100vh"
            direction={"column"}
            rowGap={10}
          >
            <Heading as={"h1"} textAlign="center">
              Convert PNG to WEBP
            </Heading>
            <Box
              border="2px dashed"
              borderColor="gray.300"
              p={25}
              borderRadius={8}
              w={"80%"}
              cursor="pointer"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              {singleFileBase64 ? (
                <Flex justifyContent="center">
                  <Image
                    src={`data:image/jpeg;base64,${singleFileBase64}`}
                    alt={seletedFileName}
                    objectFit="contain"
                    height={300}
                  />
                </Flex>
              ) : (
                <Flex
                  textAlign={"center"}
                  justifyContent={"center"}
                  direction="column"
                  h={250}
                >
                  <FaCloudUploadAlt
                    fontSize={150}
                    fill="#A0AEC0"
                    style={{ margin: "auto" }}
                  />
                  <Heading
                    mt={3}
                    as={"h5"}
                    color="gray.500"
                    fontWeight="300"
                    fontSize="md"
                  >
                    Upload files here...
                  </Heading>
                </Flex>
              )}
            </Box>
            <form method="POST" onSubmit={convertJPEGtoWEBP}>
              <FormControl>
                {/* <input type="file" name="" id="" onChange={handleFileSelect} /> */}
                <Flex direction="column">
                  <FormLabel textAlign="center" textTransform="capitalize">
                    {seletedFileName
                      ? "File Name: " + seletedFileName.slice(0, -4)
                      : "Select A File"}
                  </FormLabel>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) =>
                      setSingleFile({ ...singleFile, selectedFile: base64 })
                    }
                  />
                  <Button
                    isLoading={btnLoading}
                    loadingText={"Converting..."}
                    disabled={btnDisableLoading}
                    w={300}
                    type="submit"
                    bg={"green.400"}
                    color="white"
                    _hover={{ bg: "green.300" }}
                    onClick={() => setBtnLoading(true)}
                  >
                    Submit
                  </Button>
                </Flex>
              </FormControl>
            </form>
            <DownloadTable
              showDownload={showDownload}
              title={convertedWebpData.fileName}
              link={convertedWebpData.downloadLink}
            />
          </Flex>
        </Container>
      </ChakraProvider>
    </>
  );
}

const DownloadTable = (props) => {
  let showDownload = props.showDownload;
  return showDownload ? (
    <TableContainer minWidth={"80%"}>
      <Table variant={"striped"}>
        <Thead bg="blackAlpha.800" color="white" fontWeight={600}>
          <Tr>
            <Td>Number of files</Td>
            <Td>File Name</Td>
            <Td></Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1</Td>
            <Td>{props.title}</Td>
            <Td textAlign="end">
              <a href={props.link}>
                <Button bg="blackAlpha.400" _hover={{ bg: "gray.300" }}>
                  Download Now
                </Button>
              </a>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    ""
  );
};

function ToastStatusExample() {
  const toast = useToast();
  const statuses = ["success", "error", "warning", "info"];

  return (
    <Wrap>
      {statuses.map((status, i) => (
        <WrapItem key={i}>
          <Button
            onClick={() =>
              toast({
                title: `${status} toast`,
                status: status,
                isClosable: true,
              })
            }
          >
            Show {status} toast
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
}
