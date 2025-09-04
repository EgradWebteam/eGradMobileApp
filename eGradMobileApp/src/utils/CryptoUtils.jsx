
import { backEndUrl, frontEndUrl,backEndPort} from '../apiConfig';
import axios from 'axios';
export const encryptBatch = async (textsArray) => {
  if (!Array.isArray(textsArray) || textsArray.length === 0) {
    throw new Error('encryptBatch expects a non-empty array of texts');
  }

  try {
    const response = await axios.post(`${backEndUrl}/EncryptDecrypt/encrypt`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers here if needed
      },
    
        texts: textsArray.map(item => item.toString()),
    
    });

    if (response.status !== 200) {
      const errorBody = response.data;
      throw new Error(`Encryption API call failed: ${response.status} ${errorBody}`);
    }

    const data = response.data;

    if (!data.shortCodes) {
      throw new Error('Encryption API did not return shortCodes');
    }

    return data.shortCodes;
  } catch (error) {
    console.error('Batch encryption error:', error);
    throw error;
  }
};

export const decryptBatch = async (shortCodesArray) => {
  if (!Array.isArray(shortCodesArray) || shortCodesArray.length === 0) {
    throw new Error('decryptBatch expects a non-empty array of short codes');
  }

  try {
    const response = await axios.post(`${backEndUrl}/EncryptDecrypt/decrypt`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers here if needed
      },
      
        shortCodes: shortCodesArray,
     
    });

    if (response.status !== 200) {
      const errorBody = response.data;
      throw new Error(`Decryption API call failed: ${response.status} ${errorBody}`);
    }

    const data = response.data;

    if (!data.decryptedArray) {
      throw new Error('Decryption API did not return decryptedArray');
    }

    return data.decryptedArray;
  } catch (error) {
    console.error('Batch decryption error:', error);
    throw error;
  }
};
