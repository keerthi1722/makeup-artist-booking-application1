import React, { useState, useEffect } from 'react'
import AdminNav from '../componets/AdminNav'

function Admin() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/appoinment')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        setError('Failed to fetch appointments')
      }
    } catch (err) {
      setError('Error fetching appointments')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:5000/appoinment/${id}/${action}`, {
        method: 'PATCH'
      })
      if (response.ok) {
        const updated = await response.json()
        setAppointments(prev => prev.map(a => a._id === id ? updated : a))
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Error updating status')
    }
  }

  const deleteAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/appoinment/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setAppointments(appointments.filter(apt => apt._id !== id))
        alert('Appointment deleted successfully')
      } else {
        alert('Failed to delete appointment')
      }
    } catch (err) {
      console.error('Error deleting appointment:', err)
      alert('Error deleting appointment')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav/>
      
    <div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-8">Artist Panel</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No appointments found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{appointment.name}</h3>
                    <p className="text-gray-600">{appointment.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{appointment.totalPrice}</p>
                    <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Services:</h4>
                    <p className="text-gray-600">
                      {Array.isArray(appointment.selectedServices) 
                        ? appointment.selectedServices.join(', ') 
                        : appointment.selectedServices}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Makeup Artist:</h4>
                    <p className="text-gray-600">{appointment.staff}</p>
                  </div>
                </div>
                
                {appointment.selectedSubServices && appointment.selectedSubServices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Sub-Services:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {appointment.selectedSubServices.map((subService, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {subService.name} - ₹{subService.price}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm">
                    <span className="font-semibold">Status: </span>
                    <span className={
                      appointment.status === 'accepted' ? 'text-green-700' : appointment.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'
                    }>
                      {appointment.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(appointment._id, 'accept')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(appointment._id, 'reject')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteAppointment(appointment._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin