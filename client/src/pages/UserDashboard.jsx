import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function UserDashboard() {
  const [artists, setArtists] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [artistsError, setArtistsError] = useState('')
  const [bookingsError, setBookingsError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [userName, setUserName] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    date: null,
    selectedServiceNames: new Set()
  })

  useEffect(() => {
    // Get user name from localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const aRes = await fetch('/artists')
        if (aRes.ok) {
          setArtists(await aRes.json())
        } else {
          setArtistsError('Failed to load artists')
        }
      } catch {
        setArtistsError('Failed to load artists')
      }

      try {
        const email = localStorage.getItem('userEmail') || ''
        if (email) {
          const bRes = await fetch(`/appoinment/by-user/${encodeURIComponent(email)}`)
          if (bRes.ok) {
            setBookings(await bRes.json())
          } else {
            setBookingsError('Failed to load bookings')
          }
        } else {
          setBookings([])
        }
      } catch {
        setBookingsError('Failed to load bookings')
      }
      setLoading(false)
    }
    load()
  }, [refreshKey])

  const openBookingForm = (artist) => {
    setSelectedArtist(artist)
    setForm({
      name: '',
      email: localStorage.getItem('userEmail') || '',
      location: '',
      date: null,
      selectedServiceNames: new Set()
    })
    setShowModal(true)
  }

  const toggleService = (serviceName) => {
    setForm(prev => {
      const next = new Set(prev.selectedServiceNames)
      if (next.has(serviceName)) next.delete(serviceName); else next.add(serviceName)
      return { ...prev, selectedServiceNames: next }
    })
  }

  const totalPrice = selectedArtist
    ? selectedArtist.services.reduce((t, s) => t + (form.selectedServiceNames.has(s.name) ? Number(s.price || 0) : 0), 0)
    : 0

  const submitBooking = async () => {
    if (!selectedArtist) return
    if (!form.name || !form.email || !form.location || !form.date || form.selectedServiceNames.size === 0) {
      alert('Please fill all required fields (name, email, complete address, date) and select at least one service');
      return
    }
    const selectedServices = Array.from(form.selectedServiceNames)
    const selectedSubServices = selectedArtist.services
      .filter(s => form.selectedServiceNames.has(s.name))
      .map(s => `${s.name}:${s.price}`)
    const payload = {
      name: form.name,
      email: form.email,
      selectedServices,
      selectedSubServices,
      staff: selectedArtist.name,
      date: form.date.toISOString().split('T')[0],
      address: form.location,
      totalPrice
    }
    const res = await fetch('/appoinment', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (!res.ok) { const t = await res.text(); alert(t || 'Booking failed'); return }
    alert('Booking requested')
    setShowModal(false)
    setRefreshKey(prev => prev + 1) // Refresh bookings list
  }

  const deleteBooking = async (id) => {
    if (!id) return
    if (!window.confirm('Are you sure you want to delete this booking?')) return
    try {
      const res = await fetch(`/appoinment/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const txt = await res.text()
        alert(txt || 'Failed to delete booking')
        return
      }
      alert('Booking deleted')
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      console.error('Delete booking error', err)
      alert('Failed to delete booking')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Modern Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">User Dashboard</span>
            </div>
              <nav className="hidden md:flex space-x-8">
              <a href="#artists" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">Artists</a>
              <a href="#bookings" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">My Bookings</a>
            </nav>
              <div className="hidden md:flex items-center space-x-4">
                <button onClick={() => {
                  try {
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('artistName');
                    localStorage.removeItem('artistEmail');
                    localStorage.removeItem('adminName');
                    localStorage.removeItem('adminEmail');
                  } catch (e) { console.warn('Failed clearing localStorage on logout', e) }
                  if (window && window.location) {
                    if (window.location.hash !== '#/' && window.location.hash.startsWith('#')) window.location.hash = '/'
                    else window.location.href = '/'
                  }
                }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Logout</button>
              </div>
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {userName ? `Hello ${userName}!` : 'Welcome to Your Beauty Hub'}
          </h1>
          {userName && (
            <p className="text-xl text-gray-600 mb-4">Welcome to your personalized beauty booking dashboard</p>
          )}
          <p className="text-lg text-gray-600">Discover talented makeup artists and manage your bookings</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Artists Section */}
            <section id="artists" className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Available Makeup Artists</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              
              {artistsError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{artistsError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artists.map(artist => (
                  <div key={artist._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                    {artist.workImages && artist.workImages[0] && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={artist.workImages[0]} 
                          alt={artist.name} 
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {artist.location}
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-900">Services:</h4>
                        {artist.services.map((service, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-sm font-medium text-gray-700">{service.name}</span>
                            <span className="text-sm font-bold text-purple-600">₹{service.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => openBookingForm(artist)} 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bookings Section */}
            <section id="bookings" className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Your Booking Status</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              
              {bookingsError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{bookingsError}</p>
                    </div>
                  </div>
                </div>
              )}

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Book your first appointment with our talented artists!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{booking.staff?.charAt(0) || 'A'}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{booking.staff}</h3>
                              <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            booking.status === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'rejected' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status || 'pending'}
                          </span>
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="ml-2 inline-flex items-center px-3 py-2 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 transition-colors duration-150"
                            title="Delete booking"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {showModal && selectedArtist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Book {selectedArtist.name}</h2>
                  <p className="text-purple-100">Complete your booking details</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-white hover:text-purple-200 transition-colors duration-200 p-2 hover:bg-white/20 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      placeholder="Enter your full name" 
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      placeholder="your.email@example.com" 
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                  <input
                    placeholder="Enter your full address (street, city, zip)" 
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Please provide the complete address where the service will be provided.</p>
                </div>
              </div>

              {/* Services Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Select Services *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedArtist.services.map((service, index) => (
                    <label key={index} className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      form.selectedServiceNames.has(service.name) 
                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={form.selectedServiceNames.has(service.name)} 
                          onChange={() => toggleService(service.name)}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-purple-600 font-semibold">₹{service.price}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Choose Date *</h3>
                <DatePicker
                  selected={form.date}
                  onChange={(d) => setForm({ ...form, date: d })}
                  minDate={new Date()}
                  placeholderText="Select your preferred date"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Total and Submit */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-purple-600">₹{totalPrice}</span>
                </div>
                <button 
                  onClick={submitBooking} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard


