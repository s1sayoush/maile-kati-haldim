import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Uploads the property image file to Firebase Storage
export const uploadPropertyImage = async (
  propertyId: string,
  file: File
): Promise<string> => {
  const storageRef = ref(storage, `propertyImages/${propertyId}/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading image:", error as Error);
    throw new Error(`Failed to upload image: ${(error as Error).message}`);
  }
};

export const uploadImageToStorage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// b2f35a30-6675-45f9-9270-14aa69339ca5
// 1c5ffa22-4a05-4876-ad03-d06ae37720ad
// 7c263753-cecb-41ad-bc83-d64a0b81b203
