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
import WorkOrderDetailsPage from "./components/workflowExecution/WorkOrderDetailsPage";
import CarrierPage from "./components/workflowExecution/CarrierPage";
import WorkOrderDashboard from "./components/workflowExecution/WorkOrderDashboard";
import ResponsiveAppBar from "./components/AppBar";
import FlowWatcher from "./reactFlow/FlowWatcher";
import CreateGraph from "./reactFlow/NewWorkFlow";
import WorkFlowDashboard from "./components/workflowExecution/WorkFlowDashboard";
import { ToastContainer } from "react-toastify";
import CreateNewGraph from "./reactFlow/FlowBuilder";

 
export default function App() {
	return (
		<React.Fragment>
			<BrowserRouter>
				<ResponsiveAppBar/>
				<ToastContainer

					progressStyle={{ backgroundColor: "black" }}
					/>
				<Routes>
					<Route path="/graph/:workflowId" Component={FlowWatcher}/>
					{/* <Route path="/graph" Component={CreateGraph}/> */}
					<Route path="/graph" Component={CreateNewGraph}/>
					<Route path="/" Component={ExecutionPage}/>
					<Route path="/:workOrderId" Component={WorkOrderDetailsPage}/>
					<Route path="/carriers" Component={CarrierPage}/>
					<Route path="/workOrderDash" Component={WorkOrderDashboard}/>
					<Route path="/workflowDash" Component={WorkFlowDashboard}/>
				</Routes>
			</BrowserRouter>
		</React.Fragment>
	);
}