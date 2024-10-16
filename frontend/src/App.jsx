import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ShowAllVacancy from "./assets/pages/Vacancy/ShowAllVacancy";
import CreateVacancy from "./assets/pages/Vacancy/CreateVacancy";
import ReadOneVacancy from "./assets/pages/Vacancy/ReadOneVacancy";
import EditVacancy from "./assets/pages/Vacancy/EditVacancy";

import ShowAllApplicant from "./assets/pages/Applicant/ShowAllApplicant";
import CreateApplicant from "./assets/pages/Applicant/CreateApplicant";
import ReadOneApplicant from "./assets/pages/Applicant/ReadOneApplicant";
import EditApplicant from "./assets/pages/Applicant/EditApplicant";

import CreateEmployee from "./assets/pages/Employee/CreateEmployee";
import ShowEmployee from "./assets/pages/Employee/ShowEmployee";
import EditEmployee from "./assets/pages/Employee/EditEmployee";
import DeleteEmployee from "./assets/pages/Employee/DeleteEmployee";
import ReadOneEmployee from "./assets/pages/Employee/ReadOneEmployee";

import ShowEmployeeSalary from "./assets/pages/EmployeeSalary/ShowEmployeeSalary";
import CreateEmployeeSalary from "./assets/pages/EmployeeSalary/CreateEmployeeSalary";
import EditEmployeeSalary from "./assets/pages/EmployeeSalary/EditEmployeeSalary";
import DeleteEmployeeSalary from "./assets/pages/EmployeeSalary/DeleteEmployeeSalary";

import CreateStore from "./assets/pages/Store/CreateStore";
import ShowStore from "./assets/pages/Store/ShowStore";
import EditStore from "./assets/pages/Store/EditStore";
import DeleteStore from "./assets/pages/Store/DeleteStore";
import ReadOneStore from "./assets/pages/Store/ReadOneStore";
import StorePage from "./assets/pages/Store/StorePage";

import CreateRepair from "./assets/pages/Repair/CreateRepair";
import EditRepair from "./assets/pages/Repair/EditRepair";
import DeleteRepair from "./assets/pages/Repair/DeleteRepair";
import ReadOneRepair from "./assets/pages/Repair/ReadOneRepair";
import ShowRepair from "./assets/pages/Repair/ShowRepair";

import CreateInquire from "./assets/pages/Inquire/CreateInquire";
import ShowInquire from "./assets/pages/Inquire/ShowInquire";
import EditInquire from "./assets/pages/Inquire/EditInquire";
import DeleteInquire from "./assets/pages/Inquire/DeleteInquire";
import ReadOneInquire from "./assets/pages/Inquire/ReadOneInquire";

import { CreateVehicle } from "./assets/pages/Vehicle/Createvehicle";
import ShowAllvehicle from "./assets/pages/Vehicle/ShowAllvehicle";
import EditVehicle from "./assets/pages/Vehicle/EditVehicle";
import ReadOneVehicle from "./assets/pages/Vehicle/ReadoneVehicle";
import DeleteVehicle from "./assets/pages/Vehicle/DeleteVehicle";

import CreateFeedback from "./assets/pages/Feedback/CreateFeedback";
import ShowFeedback from "./assets/pages/Feedback/ShowFeedback";
import ReadoneFeedback from "./assets/pages/Feedback/ReadoneFeedback";
import DeleteFeedback from "./assets/pages/Feedback/DeleteFeedback";
import EditFeedback from "./assets/pages/Feedback/EditFeedback";
import OnecustomerFeedback from "./assets/pages/Feedback/OnecustomerFeedback";

import CreateServiceHistory from "./assets/pages/ServiceHistory/CreateServiceHistory";
import EditShowHistory from "./assets/pages/ServiceHistory/EditShowHistory";
import DeleteShowHistory from "./assets/pages/ServiceHistory/DeleteShowHistory";
import ReadoneShowHistory from "./assets/pages/ServiceHistory/ReadoneShowHistory";
import ShowAllServiceHistory from "./assets/pages/ServiceHistory/ShowAllServiceHistory";

import CreatePromotion from "./assets/pages/Promotion/CreatePromotion";
import EditPromotion from "./assets/pages/Promotion/EditPromotion";
import ShowAllPromotion from "./assets/pages/Promotion/ShowAllPromotion";
import DeletePromotion from "./assets/pages/Promotion/DeletePromotion";
import ReadOnePromotion from "./assets/pages/Promotion/ReadOnePromotion";

import ShowAllBooking from "./assets/pages/Booking/ShowAllBooking";
import CreateBooking from "./assets/pages/Booking/CreateBooking";
import EditBooking from "./assets/pages/Booking/EditBooking";
import ReadOneBooking from "./assets/pages/Booking/ReadoneBooking";

import CreateCustomer from "./assets/pages/Customer/CreateCustomer";
import EditCustomer from "./assets/pages/Customer/EditCustomer";
import ReadOneCustomer from "./assets/pages/Customer/ReadOneCustomer";
import DeleteCustomer from "./assets/pages/Customer/DeleteCustomer";
import ShowCustomer from "./assets/pages/Customer/ShowCustomer";
import CLogin from "./assets/components/cLogin";

import Home from "./assets/pages/Home";

import RepairEstimate from "./assets/pages/EstimateRepair/RepairEstimate";
import RepairEstimateList from "./assets/pages/EstimateRepair/RepairEstimateList";
import ShowOneEstimate from "./assets/pages/EstimateRepair/ShowOneEstimate";
import RepairEstimateUpdate from "./assets/pages/EstimateRepair/RepairEstimateUpdate";
import ReadOneHome from "./assets/pages/ReadOneHome";

import ShowService from "./assets/pages/Service/Showservices";
import CreateService from "./assets/pages/Service/CreateService";
import EditService from "./assets/pages/Service/EditService";
import ReadOneService from "./assets/pages/Service/ReadOneService";
import DeleteService from "./assets/pages/Service/DeleteService";


import ShowEmployeeAttendence from "./assets/pages/EmployeeAttendence/ShowEmployeeAttendence";
import CreateEmployeeAttendence from "./assets/pages/EmployeeAttendence/CreateEmployeeAttendence";
import EditEmployeeAttendence from "./assets/pages/EmployeeAttendence/EditEmployeeAttendence";
import DeleteEmployeeAttendence from "./assets/pages/EmployeeAttendence/DeleteEmployeeAttendence";
import Store from "./assets/pages/Store/Store";
// import ReportEmployeeAttendence from './assets/pages/EmployeeAttendence/ReportEmployeeAttendence';
// import EmpADashboard from './assets/pages/EmployeeAttendence/EmpAttendenceDashboard';
import OnecustomerInquire from "./assets/pages/Inquire/OnecustomerInquire";
import OneApplicantShow from "./assets/pages/Applicant/OneApplicantshow";

import Cart from "./assets/pages/Store/Cart";
import Checkout from "./assets/pages/Store/Checkout";

const App = () => {
  return (
    <Routes>
      <Route path="/feedback/get/:cusID" element={<OnecustomerFeedback />} />
      <Route path="/str" element={<Store />} />
      <Route path="/inquire/:cusID" element={<OnecustomerInquire />} />
      <Route path="/applicant/:cusID" element={<OneApplicantShow />} />
      <Route path="/cLogin" element={<CLogin />}></Route>
      <Route path="" element={<Home />} />
      <Route path="/vacancy" element={<ShowAllVacancy />} />
      <Route path="/vacancy/create" element={<CreateVacancy />} />{" "}
      {/*used this route to check tailwind css*/}
      <Route path="/vacancy/get/:id" element={<ReadOneVacancy />} />
      <Route path="/vacancy/edit/:id" element={<EditVacancy />} />
      <Route path="/applicant" element={<ShowAllApplicant />} />
      <Route path="/applicant/create/:cusID" element={<CreateApplicant />} />
      <Route path="/applicant/create" element={<CreateApplicant />} />
      <Route path="/applicant/get/:id" element={<ReadOneApplicant />} />
      <Route path="/applicant/edit/:id" element={<EditApplicant />} />
      <Route path="/vehicles" element={<ShowAllvehicle />} />
      <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
      <Route path="/vehicles/:id" element={<ReadOneVehicle />} />
      <Route path="/vehicles/delete/:id" element={<DeleteVehicle />} />
      <Route path="/vehicles/create" element={<CreateVehicle />} />
      <Route path="/vehicles" element={<ShowAllvehicle />} />
      <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
      <Route path="/vehicles/:id" element={<ReadOneVehicle />} />
      <Route path="/vehicles/delete/:id" element={<DeleteVehicle />} />
      <Route path="/feedback/create/:cusID" element={<CreateFeedback />} />
      <Route path="/feedback" element={<ShowFeedback />} />
      <Route path="/feedback/get/:id" element={<ReadoneFeedback />} />
      <Route path="/feedback/delete/:id" element={<DeleteFeedback />} />
      <Route path="/feedback/edit/:id" element={<EditFeedback />} />
      <Route path="/ServiceHistory/create" element={<CreateServiceHistory />} />
      <Route path="/Promotion/Create" element={<CreatePromotion />} />
      <Route path="/Promotion/edit/:id" element={<EditPromotion />} />
      <Route path="/Promotion/delete/:id" element={<DeletePromotion />} />
      <Route path="/Promotion" element={<ShowAllPromotion />} />
      <Route path="/Promotion/:id" element={<ReadOnePromotion />} />
      <Route path="/ServiceHistory/create" element={<CreateServiceHistory />} />
      <Route path="/ServiceHistory/edit/:id" element={<EditShowHistory />} />
      <Route
        path="/ServiceHistory/delete/:id"
        element={<DeleteShowHistory />}
      />
      <Route path="/ServiceHistory/:id" element={<ReadoneShowHistory />} />
      <Route path="/ServiceHistory" element={<ShowAllServiceHistory />} />
      <Route path="/Booking" element={<ShowAllBooking />} />
      <Route path="/Booking/create/:cusID" element={<CreateBooking />} />
      <Route path="/Booking/edit/:id" element={<EditBooking />} />
      <Route path="/Booking/get/:id" element={<ReadOneBooking />} />
      <Route path="/Booking/:cusID" element={<ReadOneBooking />} />
      <Route path="/Employee" element={<ShowEmployee />} />
      <Route path="/Employee/create" element={<CreateEmployee />} />
      <Route path="/Employee/edit/:id" element={<EditEmployee />} />
      <Route path="/Employee/delete/:id" element={<DeleteEmployee />} />
      <Route path="/Employee/:id" element={<ReadOneEmployee />} />
      <Route path="/EmployeeSalary" element={<ShowEmployeeSalary />} />
      <Route path="/EmployeeSalary/create" element={<CreateEmployeeSalary />} />
      <Route path="/EmployeeSalary/edit/:id" element={<EditEmployeeSalary />} />
      <Route
        path="/EmployeeSalary/delete/:id"
        element={<DeleteEmployeeSalary />}
      />
      <Route path="/Str/:cusID" element={<StorePage />} />
      <Route path="/Store" element={<ShowStore />} />
      <Route path="/Store/create" element={<CreateStore />} />
      <Route path="/Store/edit/:id" element={<EditStore />} />
      <Route path="/Store/delete/:id" element={<DeleteStore />} />
      <Route path="/Store/:id" element={<ReadOneStore />} />
      <Route path="/Repair" element={<ShowRepair />} />
      <Route path="/Repair/create" element={<CreateRepair />} />
      <Route path="/Repair/edit/:id" element={<EditRepair />} />
      <Route path="/Repair/delete/:id" element={<DeleteRepair />} />
      <Route path="/Repair/:id" element={<ReadOneRepair />} />
      <Route path="/Inquire" element={<ShowInquire />} />
      <Route path="/Inquire/create/:cusID" element={<CreateInquire />} />
      <Route path="/Inquire/edit/:id" element={<EditInquire />} />
      <Route path="/Inquire/delete/:id" element={<DeleteInquire />} />
      <Route path="/Inquire/:id" element={<ReadOneInquire />} />
      <Route path="/Inquire/get/:id" element={<ReadOneInquire />} />
      <Route path="/Inquire" element={<ShowInquire />} />
      <Route path="/Inquire/create/:cusID" element={<CreateInquire />} />
      <Route path="/Inquire/edit/:id" element={<EditInquire />} />
      <Route path="/Inquire/delete/:id" element={<DeleteInquire />} />
      <Route path="/Inquire/:id" element={<ReadOneInquire />} />
      <Route path="/Customer" element={<ShowCustomer />} />
      <Route path="/Customer/create" element={<CreateCustomer />} />
      <Route path="/Customer/edit/:id" element={<EditCustomer />} />
      <Route path="/Customer/delete/:id" element={<DeleteCustomer />} />
      <Route path="/Customer/:id" element={<ReadOneCustomer />} />
      <Route path="/Est" element={<RepairEstimate />} />
      <Route path="/EstList" element={<RepairEstimateList />} />
      <Route path="/EstOne/:id" element={<ShowOneEstimate />} />
      <Route path="/EstUpd/:id" element={<RepairEstimateUpdate />} />

      <Route
        path="/EmployeeAttendence"
        element={<ShowEmployeeAttendence />}
      ></Route>
      <Route
        path="/EmployeeAttendence/create"
        element={<CreateEmployeeAttendence />}
      ></Route>
      <Route
        path="/EmployeeAttendence/edit/:id"
        element={<EditEmployeeAttendence />}
      ></Route>
      <Route
        path="/EmployeeAttendence/delete/:id"
        element={<DeleteEmployeeAttendence />}
      ></Route>
      {/* <Route path='/EmployeeAttendence/reportEmployeeAttendence' element={<ReportEmployeeAttendence />}></Route>
      <Route path='/EmployeeAttendence/EmpADashboard' element={<EmpADashboard />}></Route> */}
      <Route path="/service" element={<ShowService />}></Route>
      <Route path="/service/create" element={<CreateService />} />
      <Route path="/service/edit/:id" element={<EditService />} />
      <Route path="/service/get/:id" element={<ReadOneService />} />
      <Route path="/service/delete/:id" element={<DeleteService />} />
      <Route path="/ReadOneHome/:cusID" element={<ReadOneHome />}></Route>

      <Route path="/Cart/:Name" element={<Cart />} />
      <Route path="/Checkout/:Name" element={<Checkout />} />

      
    </Routes>
  );
};

export default App;
