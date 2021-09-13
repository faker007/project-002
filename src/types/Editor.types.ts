export interface EditorTypes {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  imgUrlList: string[];
  setImgUrlList: React.Dispatch<React.SetStateAction<string[]>>;
}
