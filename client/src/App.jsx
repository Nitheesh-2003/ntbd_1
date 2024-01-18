import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [htmlfile,setHtmfile]=useState(null);
  const file1 = useRef(null);
  const [href,setHref]=useState("");
  useEffect(() => {
    const label = document.getElementById('inp2');
    if (htmlfile) {
      label.value = htmlfile.name;
    } else {
      label.value = '';
    }
  }, [htmlfile]);


  const handleFileChange=(e)=>{
    setHtmfile(e.target.files[0])
  }

  const handleFileChoose=(e)=>{
    file1.current.click();
  }
  const handleUpload=async()=>{
    try{
      if(htmlfile){
        const fd=new FormData()
        fd.append('file1',htmlfile)
        const res=await axios.post('http://localhost:5000/upload',fd,{
          headers : {
            'Content-Type' : 'multipart/form-data'
          },
          responseType: 'blob'
        })
        const blob = new Blob([res.data], { type: 'application/json' });
        setHref(URL.createObjectURL(blob));
      }
      else{
        console.log("No file selected")
      }
    }
    catch (error) {
      console.error('Error uploading file:', error.message);
    }
  }
  
  return (
    <>
      <div className='flex justify-center items-center h-[100vh] w-[100vw] bg-slate-200'>
        <div className='flex flex-col gap-4 items-center border p-10 bg-white'>
          <div className='text-xl font-bold'>Choose the file to upload</div>
          <div className='relative flex justify-between mt-1 mb-10'>
            <input className='opacity-0' ref={file1} type="file" id="file1" name='file1' accept='.html' onChange={handleFileChange}/>
            <button onClick={handleUpload} className='btn'>Upload</button>
            <input type="text" className='op border-gray-500 shadow-md outline-none rounded-md border w-60 py-3 absolute top-0 left-0 cursor-pointer' placeholder='Click to choose File' onClick={handleFileChoose} id='inp2'/>
          </div>
          {href ?
            <button><a href={href} download="result.json" id='download' className='btn bg-blue'>Download</a></button> :
            null
          }
        </div>
      </div>
    </>
  )
}

export default App
