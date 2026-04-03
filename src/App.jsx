// App.jsx
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import LoginPage from './Components/LoginPage'
import RegisterPage from './Components/RegisterPage'
import NotFound from './Components/NotFound'
// import AdminHomePage from './Components/AdminHomePage'
import UsersPage from './Components/admin/UsersPage'
import VehiclesPage from './Components/admin/VehiclesPage'
import BookingsPage from './Components/admin/BookingsPage'
import RolesPage from './Components/admin/RolesPage'
import PaymentsPage from './Components/admin/PaymentsPage'
import NotificationsPage from './Components/admin/NotificationsPage'
import AuditLogsPage from './Components/admin/AuditLogsPage'
import Dashboard from './Components/admin/Dashboard'
import FinanceDashboard from './Components/admin/FinanceDashboard'
import PendingVehiclesPage from './Components/admin/PendingVehicles'
import AddVehiclePage from './Components/admin/AddVehiclePage'
import CarOwnerDashboard from './Components/owners/CarOwnerDashboard';
import MyVehicles from './Components/owners/MyVehicles';
import AddVehicle from './Components/owners/AddVehicle';
import EditVehicle from './Components/owners/EditVehicle';
import VehicleBookings from './Components/owners/VehicleBookings';
import BookingDetail from './Components/owners/BookingDetail';
import Earnings from './Components/owners/Earnings';
import QuickAddVehicle from './QuickAddVehicle'
import TestApi from './Components/owners/TestApi'
import Layout from './Components/Layout' // Import Layout

function App() {
  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/quick-add-vehicle' element={<QuickAddVehicle />} />
      <Route path='/car-owner/test' element={<TestApi />} />
      
      {/* Admin Routes with Layout */}
      <Route element={<Layout />}>
        <Route path='/admin' element={<Dashboard />} />
        <Route path='/admin/users' element={<UsersPage />} />
        <Route path='/admin/vehicles' element={<VehiclesPage />} />
        <Route path='/admin/bookings' element={<BookingsPage />} />
        <Route path='/admin/payments' element={<PaymentsPage />} />
        <Route path='/admin/roles' element={<RolesPage />} />
        <Route path='/admin/logs' element={<AuditLogsPage />} />
        <Route path='/admin/notifications' element={<NotificationsPage />} />
        <Route path='/admin/add-vehicle' element={<AddVehiclePage />} />
        <Route path='/admin/pending-vehicles' element={<PendingVehiclesPage />} />
        <Route path='/admin/finance' element={<FinanceDashboard />} />
        <Route path='/user_dashboard' element={<UsersPage />} />
      </Route>
      
      {/* Owner Routes with Layout */}
      <Route element={<Layout />}>
        <Route path='/car-owner-dashboard' element={<CarOwnerDashboard />} />
        <Route path='/car-owner/vehicles' element={<MyVehicles />} />
        <Route path='/car-owner/vehicles/add' element={<AddVehicle />} />
        <Route path='/car-owner/vehicles/:id/edit' element={<EditVehicle />} />
        <Route path='/car-owner/bookings' element={<VehicleBookings />} />
        <Route path='/car-owner/bookings/:id' element={<BookingDetail />} />
        <Route path='/car-owner/earnings' element={<Earnings />} />
      </Route>
      
      {/* 404 Route */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App