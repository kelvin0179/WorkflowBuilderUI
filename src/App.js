import { AppBar, Button } from "@mui/material";
import React from "react";
import ButtonAppBar from "./components/AppBar";
import MyForm from "./components/TestForm";
import DynamicInputFields from "./components/DynamicInputField";
import ChosenWorkflow from "./components/ChosenWorkflow";
import OrderComponent from "./components/OrderComponents";
import UpdateNode from "./reactFlow/Dashboard";
import {BrowserRouter,Route, Routes} from "react-router-dom"
import ExecutionPage from "./components/workflowExecution/ExecutionPage";


 
export default function App() {
	return (
		<React.Fragment>
			<ButtonAppBar/>
			<BrowserRouter>
				<Routes>
					<Route path="/graph/:workflowId" Component={UpdateNode}/>
					<Route path="/" Component={ExecutionPage}/>
				</Routes>
			</BrowserRouter>
		</React.Fragment>
	);
}