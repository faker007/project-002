//@ts-ignore
import ImageResize from "@looop/quill-image-resize-module-react";
import { useMemo } from "react";
// @ts-ignore
import ReactQuill, { Quill } from "react-quill";
import { authService, storageService } from "../utils/firebase";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { EditorTypes } from "../types/Editor.types";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const Editor: React.FC<EditorTypes> = ({
  setValue,
  value,
  imgUrlList,
  setImgUrlList,
}) => {
  var Block = Quill.import("blots/block");
  Block.tagName = "SPAN";
  Quill.register(Block, true);
  Quill.register("modules/imageResize", ImageResize);
  const [stringedFile, setStringedFile] = useState("");
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = () => {
    // 파일을 업로드 하기 위한 input 태그 생성
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // 파일이 input 태그에 담기면 실행 될 함수
    input.onchange = async () => {
      const file = input.files;
      if (file !== null) {
        fileToUrl(file[0]);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["video", "image"],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },

      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
        handleStyles: {
          backgroundColor: "black",
          border: "none",
          color: "white",
          // other camelCase styles for size display
        },
      },
    }),
    []
  );

  const formats = [
    //'font',
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "video",
    "image",
    "color",
    "background",
  ];

  const fileToUrl = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      if (e.target?.result) {
        setStringedFile(e.target.result);
      }
    };
  };

  const UploadToFirebase = async () => {
    const fireBaseFileRef = ref(
      storageService,
      `${authService.currentUser?.uid || uuid()}/${uuid()}`
    );

    try {
      await uploadString(fireBaseFileRef, stringedFile, "data_url");
      const downloadURL = await getDownloadURL(fireBaseFileRef);
      if (downloadURL !== "") {
        setImgUrlList((prev) => [...prev, downloadURL]);
        const range = quillRef.current?.getEditor().getSelection()?.index;

        if (range !== undefined && range !== null) {
          let quill = quillRef.current?.getEditor();
          quill?.setSelection(range, 1);

          quill?.clipboard.dangerouslyPasteHTML(
            range,
            `<img src=${downloadURL}  alt="이미지 태그 입니다." className="w-full"/>`
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStringedFile("");
    }
  };

  useEffect(() => {
    if (stringedFile !== "") {
      UploadToFirebase();
    }
  }, [stringedFile]);

  useEffect(() => {
    quillRef.current?.getEditor().root.setAttribute("spellcheck", "false");
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
      formats={formats}
      placeholder={"공유할 내용을 입력해 주세요. (최소 11자 이상)"}
    />
  );
};
