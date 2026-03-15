import React from 'react'
import axios from 'axios'
 export const sendRequest = async (method, url, data) => {
        try {
          const response = await axios({
            method,
            url,
            data,
          });
          return response.data;
        } catch (error) {
          console.error('Error making request:', error);
          throw error;
        }
      };
export  function Request() {
   
  return (
    <div>
      
    </div>
  )
}
