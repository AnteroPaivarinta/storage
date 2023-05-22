import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import { PDFDocument } from 'pdf-lib';
import '../src/styles.css';
function App() {
  const [file, setFile] = useState<any>();
  const [data, setData] =useState<any>();

  const onFileChange = (event:any) => {
    setFile(event.target.files[0]);
  }

 const onFileUpload = () => {
  if(file) {
    const formData = new FormData();
    formData.append(
      'file',
      file,
    );
    axios.post("http://localhost:3001/file", formData)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
   
  };



  const renderPDF = async (pdfBuffer:any) => {
   
  };


 
  const handleDownload = (file:any) => {
    console.log('FILE', file)

    try {
      const pdfBytes = new Uint8Array(file.file.Body.data);
      let blob:any = [];
      if(file.key.includes('.txt')){
        blob = new Blob([pdfBytes], { type: 'text/plain' });
      }

      if(file.key.includes('.pdf')){
        blob = new Blob([pdfBytes], { type: 'application/pdf' });
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.key;
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.error('Virhe PDF-tiedoston muuntamisessa:', error);
    }
    renderPDF(file.file.Body.data)

  };

  useEffect(() => {
    const searchFiles = async() => {
     await axios.get("http://localhost:3001")
      .then(async function (response) {
        console.log('USE EFFECT', response.data)
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    };
     searchFiles();
  }, []);

  return (
    <div className="App">
      <header className='header'></header>
      <div className='sectionContainer'>
        <section className='section1'>
          { data && data.map((file:any)=> 
          <div key={file.key} className='box'>
            { file.key}
            <button onClick={() => handleDownload(file)}> DOWNLOAD</button>
            File Size: {file.file.ContentLength} KT
          </div>)}
        </section>
        <section className='section2'>
          teksti
          <input type="file" onChange={ (e) => onFileChange(e)} />
       <button onClick={() => onFileUpload()}> SEND</button>
        {(data && data.reduce((partialSum:number, file:any) => partialSum + file.file.ContentLength, 0) <  100000000000000)? null : <div>Lisää</div>}
        </section>
      </div>
      <footer className='footer'>
juu
      </footer>
    </div>
  );
}

export default App;
