import multer from "multer";

interface ITypeArrayField {
  name: string;
  maxCount: number;
}

interface ITypeMulter {
  fieldName: string;
  typeUpload: "single" | "fields";
  arrayField?: ITypeArrayField[];
}

const multerHandler = ({
  fieldName,
  typeUpload = "single",
  arrayField,
}: ITypeMulter) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  switch (typeUpload) {
    case "single":
      return upload.single(fieldName);
    case "fields":
      return upload.fields(arrayField);
  }
};

export default multerHandler;
