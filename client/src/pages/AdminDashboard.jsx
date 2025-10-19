import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminNav from '../componets/AdminNav'

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('')
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [artistId, setArtistId] = useState(null)
  const [artistServices, setArtistServices] = useState([])
  const [manageOpen, setManageOpen] = useState(false)
  const [newServiceName, setNewServiceName] = useState('')
  const [newServicePrice, setNewServicePrice] = useState('')

  const normalize = (s) => (s || '').toString().trim().toLowerCase()

  useEffect(() => {
    const storedAdminName = localStorage.getItem('adminName')
    const storedAdminEmail = localStorage.getItem('adminEmail')
    if (storedAdminName) setAdminName(storedAdminName)
    else {
      const fallback = localStorage.getItem('artistName')
      if (fallback) setAdminName(fallback)
    }
    const artistName = storedAdminName || localStorage.getItem('artistName')
    if (artistName) fetchAppointmentsForArtist(artistName)
    const artistEmail = storedAdminEmail || localStorage.getItem('artistEmail')
    if (artistEmail) fetchArtistDetailsByEmail(artistEmail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchArtistDetailsByEmail = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/artists/by-email/${encodeURIComponent(email)}`)
      if (!res.ok) return
      const data = await res.json()
      setArtistId(data._id)
      setArtistServices(Array.isArray(data.services) ? data.services : [])
    } catch (err) { console.error('Failed to load artist details', err) }
  }

  const openManageModal = () => setManageOpen(true)
  const closeManageModal = () => { setManageOpen(false); setNewServiceName(''); setNewServicePrice('') }

  const addServiceLocal = () => {
    if (!newServiceName || !newServicePrice) return alert('Please enter service name and price')
    const price = Number(newServicePrice)
    if (isNaN(price)) return alert('Price must be a number')
    setArtistServices(prev => [...prev, { name: newServiceName, price }])
    setNewServiceName(''); setNewServicePrice('')
  }

  const removeServiceLocal = (index) => setArtistServices(prev => prev.filter((_, i) => i !== index))

  const saveServicesToServer = async () => {
    if (!artistId) return alert('Artist id not available')
    try {
      const res = await fetch(`http://localhost:5000/artists/${artistId}/services`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ services: artistServices }) })
      if (!res.ok) { const t = await res.text(); throw new Error(t || 'Failed') }
      const data = await res.json()
      setArtistServices(Array.isArray(data.services) ? data.services : [])
      alert('Services updated')
      closeManageModal()
    } catch (err) { console.error('Failed to save services', err); alert('Failed to save services') }
  }

  const confirmDeleteAccount = async () => {
    if (!artistId) return alert('Artist id not available')
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    try {
      const res = await fetch(`http://localhost:5000/artists/${artistId}`, { method: 'DELETE' })
      if (!res.ok) { const t = await res.text(); throw new Error(t || 'Failed') }
      alert('Account deleted')
      try {
        localStorage.removeItem('artistName')
        localStorage.removeItem('artistEmail')
        localStorage.removeItem('adminName')
        localStorage.removeItem('adminEmail')
      } catch (e) {}
      // Redirect to artist registration so they can start the process again
      if (window && window.location) window.location.href = '/admin/artists/register'
    } catch (err) { console.error('Failed to delete account', err); alert('Failed to delete account') }
  }

  useEffect(() => {
    fetchAppointments()
    const handler = (e) => {
      const nameFromEvent = e?.detail?.artistName
      const updatedAppointment = e?.detail?.appointment
      const deletedAppointmentId = e?.detail?.deletedAppointmentId
      const name = nameFromEvent || adminName || localStorage.getItem('artistName')

      if (updatedAppointment) {
        setAppointments(prev => {
          const exists = prev.some(a => a._id === updatedAppointment._id)
          const merged = exists ? prev.map(a => a._id === updatedAppointment._id ? updatedAppointment : a) : [updatedAppointment, ...prev]
          const normName = normalize(name)
          const artistAppointments = merged.filter(a => normalize(a.staff) === normName)
          setFilteredAppointments(artistAppointments)
          const pending = artistAppointments.filter(apt => !apt.status || apt.status === 'pending').length
          setPendingCount(pending)
          const acceptedBookings = artistAppointments.filter(apt => apt.status === 'accepted')
          const revenue = acceptedBookings.reduce((sum, apt) => {
            const raw = apt.totalPrice
            const num = raw == null ? 0 : Number(String(raw).replace(/[^0-9.-]+/g, ''))
            return sum + (isNaN(num) ? 0 : num)
          }, 0)
          setTotalRevenue(revenue)
          return merged
        })
        return
      }

      if (deletedAppointmentId) {
        setAppointments(prev => {
          const remaining = prev.filter(a => a._id !== deletedAppointmentId)
          const normName = normalize(name)
          const artistAppointments = remaining.filter(a => normalize(a.staff) === normName)
          setFilteredAppointments(artistAppointments)
          const pending = artistAppointments.filter(apt => !apt.status || apt.status === 'pending').length
          setPendingCount(pending)
          const acceptedBookings = artistAppointments.filter(apt => apt.status === 'accepted')
          const revenue = acceptedBookings.reduce((sum, apt) => {
            const raw = apt.totalPrice
            const num = raw == null ? 0 : Number(String(raw).replace(/[^0-9.-]+/g, ''))
            return sum + (isNaN(num) ? 0 : num)
          }, 0)
          setTotalRevenue(revenue)
          return remaining
        })
        return
      }

      if (name) fetchAppointmentsForArtist(name)
      else fetchAppointments()
    }
    window.addEventListener('appointmentsUpdated', handler)
    return () => window.removeEventListener('appointmentsUpdated', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/appoinment')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
        const artist = normalize(adminName || localStorage.getItem('artistName') || '')
        const artistAppointments = artist ? data.filter(apt => normalize(apt.staff) === artist) : data
        setFilteredAppointments(artistAppointments)
        const pending = artistAppointments.filter(apt => !apt.status || apt.status === 'pending').length
        setPendingCount(pending)
        const acceptedBookings = artistAppointments.filter(apt => apt.status === 'accepted')
        const revenue = acceptedBookings.reduce((sum, apt) => {
          const raw = apt.totalPrice
          const num = raw == null ? 0 : Number(String(raw).replace(/[^0-9.-]+/g, ''))
          return sum + (isNaN(num) ? 0 : num)
        }, 0)
        setTotalRevenue(revenue)
      } else console.error('Failed to fetch appointments')
    } catch (err) { console.error('Error fetching appointments:', err) }
    finally { setLoading(false) }
  }

  const fetchAppointmentsForArtist = async (artistName) => {
    if (!artistName) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/appoinment/by-staff/${encodeURIComponent(artistName)}`)
      if (!res.ok) { setAppointments([]); setFilteredAppointments([]); setPendingCount(0); setTotalRevenue(0); return }
      const data = await res.json()
      setAppointments(data); setFilteredAppointments(data)
      const pending = data.filter(apt => !apt.status || apt.status === 'pending').length
      setPendingCount(pending)
      const acceptedBookings = data.filter(apt => apt.status === 'accepted')
      const revenue = acceptedBookings.reduce((sum, apt) => {
        const raw = apt.totalPrice
        const num = raw == null ? 0 : Number(String(raw).replace(/[^0-9.-]+/g, ''))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
      setTotalRevenue(revenue)
    } catch (err) { console.error('Error fetching appointments for artist:', err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const artist = normalize(adminName || localStorage.getItem('artistName') || '')
    if (artist && appointments.length > 0) {
      const artistAppointments = appointments.filter(apt => normalize(apt.staff) === artist)
      setFilteredAppointments(artistAppointments)
      const pending = artistAppointments.filter(apt => !apt.status || apt.status === 'pending').length
      setPendingCount(pending)
      const acceptedBookings = artistAppointments.filter(apt => apt.status === 'accepted')
      const revenue = acceptedBookings.reduce((sum, apt) => {
        const raw = apt.totalPrice
        const num = raw == null ? 0 : Number(String(raw).replace(/[^0-9.-]+/g, ''))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
      setTotalRevenue(revenue)
    }
  }, [adminName, appointments])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{adminName ? `Hello ${adminName}!` : 'Artist Panel'}</h1>
              <p className="text-lg text-gray-600">{adminName ? 'Manage your makeup artist appointments and bookings' : 'Manage your salon operations efficiently'}</p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <button onClick={() => { try { localStorage.removeItem('artistName'); localStorage.removeItem('artistEmail'); localStorage.removeItem('adminName'); localStorage.removeItem('adminEmail'); localStorage.removeItem('userName'); localStorage.removeItem('userEmail') } catch (e) { console.warn('Failed clearing localStorage on logout', e) } if (window && window.location) { if (window.location.hash !== '#/' && window.location.hash.startsWith('#')) window.location.hash = '/'; else window.location.href = '/' } }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Logout</button>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-600">Last updated:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue (Accepted Only)</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : `₹${totalRevenue.toLocaleString()}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/admin/artists/register" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  </div>
                  <div className="text-white/80 text-sm font-medium">New</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">Register Makeup Artist</h3>
                <p className="text-gray-600 mb-4">Add a new artist with location, services and portfolio images to expand your team.</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/bookings" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">{loading ? '...' : `${pendingCount} Pending`}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">Manage Bookings</h3>
                <p className="text-gray-600 mb-4">Review new booking requests, accept or reject appointments, and manage your schedule.</p>
              </div>
            </div>
          </Link>

          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7" /></svg>
                  </div>
                  <div className="text-white/80 text-sm font-medium">Manage</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">Manage Services & Account</h3>
                <p className="text-gray-600 mb-4">Add or remove services offered by you. Delete your account if you wish to stop providing services.</p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 gap-4">
                  <button onClick={openManageModal} className="bg-white text-purple-700 px-4 py-2 rounded-lg">Manage Services</button>
                  <button onClick={confirmDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {manageOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Manage Services</h3>
              <button onClick={closeManageModal} className="text-gray-500">Close</button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Current Services</h4>
              {artistServices.length === 0 ? (
                <p className="text-sm text-gray-500">No services listed.</p>
              ) : (
                <ul className="space-y-2">
                  {artistServices.map((s, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-500">₹{s.price}</div>
                      </div>
                      <div>
                        <button onClick={() => removeServiceLocal(idx)} className="text-red-600">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Add New Service</h4>
              <div className="flex gap-2">
                <input value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="Service name" className="flex-1 border p-2 rounded" />
                <input value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} placeholder="Price" className="w-28 border p-2 rounded" />
                <button onClick={addServiceLocal} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={saveServicesToServer} className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
              <button onClick={closeManageModal} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

