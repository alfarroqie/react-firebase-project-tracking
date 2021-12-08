import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { BrowserRouter} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import 'antd/dist/antd.css'

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
)