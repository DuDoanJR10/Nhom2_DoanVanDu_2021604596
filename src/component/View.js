import React, { useRef } from 'react'
import { useState } from 'react';
import { Input } from 'antd';
import { encryptData, decryptData } from '../library/main'
import './View.scss'

const FileSaver = require('file-saver');

const { TextArea } = Input;

const Example = () => {
  const [value, setValue] = useState('');
  const [cipherText, setCipherText] = useState('')
  const [cipherNew, setCipherNew] = useState('')
  const [plainText, setPlainText] = useState('')

  const inputRef = useRef(null);
  const inputArea = useRef(null);
  const inputFileDecrypt = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleEncrypt = (value) => {
    const encryptedExam = encryptData(value)
    setCipherText(encryptedExam)
  }

  const handleDecrypt = (cipherNew) => {
    const plainText = decryptData(cipherNew)
    setPlainText(plainText)
  }
  const handleChangeInputFile = () => {
    let files = inputRef.current.files;
    if (files.length === 0) return;

    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
      const file = e.target.result;
      const lines = file.split(/\r\n|\n/);
      setValue(lines.join('\n'));
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
  }

  const handleChangeInputFileDecrypt = () => {
    let files = inputFileDecrypt.current.files;
    if (files.length === 0) return;
    const file = files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      const file = e.target.result;
      const lines = file.split(/\r\n|\n/);
      setCipherNew(lines.join('\n'))
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
  }

  const handleSaveEncrypt = () => {
    var blob = new Blob([cipherText], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "fileName.txt");
  }

  const handleSaveDecrypt = () => {
    var blob = new Blob([plainText], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "fileName.txt");
  }

  return (
    <div className='view'>
      <div className='content'>
        <h2 className='content__heading'>Mã hóa</h2>
        <form className='content__form'>
          <p className='content__form__title'>Bản rõ</p>
          <input 
            className='content__form__input--file' 
            ref={inputRef} onChange={() => handleChangeInputFile()} 
            type="file" />
          <TextArea 
            className='content__form__input--text' 
            onChange={handleChange} 
            ref={inputArea}  
            value={value} 
            rows={4}
          />
        </form>
        <button className='content__button' onClick={() => handleEncrypt(value)}>Mã hóa</button>

        <form className='content__form'>
          <p className='content__form__title'>Bản mã</p>
          <TextArea 
            className='content__form__input--text' 
            value={cipherText} 
            onChange={(e) => setCipherText(e.target.value)}
            rows={4} 
          />
        </form>
        <button className='content__button' onClick={() => handleSaveEncrypt()}>Lưu</button>
      </div>

      <button className='button' onClick={() => setCipherNew(cipherText)}>Chuyển</button>

      <div className='content'>
        <h2 className='content__heading'>Giải mã</h2>
        <form className='content__form'>
          <p className='content__form__title'>Bản mã</p>  
          <input 
            className='content__form__input--file' 
            onChange={() => handleChangeInputFileDecrypt()} 
            ref={inputFileDecrypt} 
            type="file" />
          <TextArea 
            className='content__form__input--text' 
            value={cipherNew} 
            onChange={(e) => setCipherNew(e.target.value)} 
            rows={4} 
          />
        </form>
        <button className='content__button' onClick={() => handleDecrypt(cipherNew)}>Giải mã</button>
        
        <form className='content__form'>
          <p className='content__form__title'>Bản rõ</p>
          <TextArea 
            className='content__form__input--text' 
            value={plainText} 
            rows={4} 
            onChange={(e) => setPlainText(e.target.value)}  
          />
        </form>
        <button className='content__button' onClick={() => handleSaveDecrypt()}>Lưu</button>
      </div>
    </div>
  )
}

export default Example