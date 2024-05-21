import { decode } from "base64-arraybuffer";
import supabase from "@/config/supabaseClient";

interface ITypeUpload {
  bucketName: string;
  bufferFiles: Express.Multer.File;
}

const uploadHandler = async ({ bucketName, bufferFiles }: ITypeUpload) => {
  const fileBase64 = decode(bufferFiles.buffer.toString("base64"));
  let dataPath: string;
  let errorMsg: string;

  await supabase.storage
    .from(bucketName)
    .upload(bufferFiles.originalname, fileBase64, {
      contentType: bufferFiles.mimetype,
      upsert: true,
    })
    .then((data) => {
      const mainURL = process.env.SUPABASE_URL;
      const folderPath = `/storage/v1/object/public/${bucketName}/`;

      dataPath = `${mainURL}${folderPath}${encodeURI(data.data?.path)}`;
      errorMsg = data.error?.message;
    });

  return {
    dataPath,
    errorMsg,
  };
};

export default uploadHandler;
