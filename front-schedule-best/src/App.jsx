import './App.css';
import UploadForm from "./pages/UploadForm.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import ScheduleTable from "./pages/ScheduleTable.jsx";

function App() {
    return (
        <Router>
            <div>
                <ToastContainer/>
                <div>
                    <Routes>
                        <Route path="/" element={<UploadForm/>}/>
                        <Route path="/schedule-table" element={<ScheduleTable/>}/>
                    </Routes>
                </div>
            </div>

        </Router>
    );
}

export default App;
