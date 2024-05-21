import supabase from "@/config/supabaseClient";

interface ITypeDeleteFile {
  bucketName: string;
  fileName: string[];
}

const deleteFileHandler = async ({ bucketName, fileName }: ITypeDeleteFile) => {
  let data: any;
  let errorMsg: string;

  const arrayFileName = fileName.map((value) => {
    return value.split(`/${bucketName}/`)[1];
  });

  await supabase.storage
    .from(bucketName)
    .remove(arrayFileName)
    .then((data) => {
      data = data.data as any;
      errorMsg = data.error?.message;
    });

  return {
    data,
    errorMsg,
  };
};

export default deleteFileHandler;
