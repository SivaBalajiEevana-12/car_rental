
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


function App() {
 

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/register' element={<RegisterPage/>}></Route>
      {/* <Route path='/admin_dashboard' element={<AdminHomePage/>}></Route> */}
      <Route path='/user_dashboard' element={<UsersPage/>}></Route>
      <Route path="/admin/users" element={<UsersPage />} />
<Route path="/admin/vehicles" element={<VehiclesPage />} />
<Route path="/admin/bookings" element={<BookingsPage />} />
<Route path="/admin/payments" element={<PaymentsPage />} />
<Route path="/admin/roles" element={<RolesPage />} />
<Route path="/admin/logs" element={<AuditLogsPage />} />
<Route path="/admin/notifications" element={<NotificationsPage />} />
      <Route path="*" element={<NotFound/>}></Route>
    </Routes>
  
    </>
  )
}

export default App
