import { useEffect } from "react";


function useKey(key, action) {
  
  
  
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener('keydown', callback)

    return function () { // Always remove the event listener when u use keypress
      document.removeEventListener('keydown', callback) 
    }
  }, [action, key])
}

export default useKey
