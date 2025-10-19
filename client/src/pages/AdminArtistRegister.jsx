import React, { useState } from 'react'
import AdminNav from '../componets/AdminNav'

function AdminArtistRegister() {
  const [form, setForm] = useState({ name: '', email: '', location: '', serviceName: '', servicePrice: '', services: [], workImages: [] })
  const [message, setMessage] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const addService = () => {
    if (!form.serviceName || !form.servicePrice) return
    const price = Number(form.servicePrice)
    if (Number.isNaN(price)) return
    setForm(prev => ({ ...prev, services: [...prev.services, { name: prev.serviceName, price }], serviceName: '', servicePrice: '' }))
  }

  const removeService = (idx) => {
    setForm(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }))
  }

  const addImage = () => {
    if (!form.imageUrl) return
    setForm(prev => ({ ...prev, workImages: [...prev.workImages, prev.imageUrl], imageUrl: '' }))
  }

  const removeImage = (idx) => {
    setForm(prev => ({ ...prev, workImages: prev.workImages.filter((_, i) => i !== idx) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch('http://localhost:5000/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, location: form.location, services: form.services, workImages: form.workImages })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed')
      }
      setMessage('Artist saved successfully')
      setForm({ name: '', email: '', location: '', serviceName: '', servicePrice: '', services: [], workImages: [], imageUrl: '' })
    } catch (err) {
      setMessage('Error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav/>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Register Makeup Artist</h1>
        {message && <div className="mb-4 text-sm text-blue-700">{message}</div>}
        <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 grid gap-4">
          <input name="name" value={form.name} onChange={onChange} placeholder="Full name" className="border p-2 rounded" required />
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" className="border p-2 rounded" required />
          <input name="location" value={form.location} onChange={onChange} placeholder="Location" className="border p-2 rounded" required />
          <div className="border rounded p-4">
            <div className="font-semibold mb-2">Services</div>
            <div className="flex gap-2 mb-2">
              <input name="serviceName" value={form.serviceName} onChange={onChange} placeholder="Service name" className="border p-2 rounded flex-1" />
              <input name="servicePrice" value={form.servicePrice} onChange={onChange} placeholder="Price" className="border p-2 rounded w-32" />
              <button type="button" onClick={addService} className="bg-blue-600 text-white px-3 rounded">Add</button>
            </div>
            <ul className="list-disc ml-6">
              {form.services.map((s, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{s.name} - ₹{s.price}</span>
                  <button type="button" onClick={() => removeService(i)} className="text-red-600">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border rounded p-4">
            <div className="font-semibold mb-2">Work Images (URLs)</div>
            <div className="flex gap-2 mb-2">
              <input name="imageUrl" value={form.imageUrl || ''} onChange={onChange} placeholder="https://..." className="border p-2 rounded flex-1" />
              <button type="button" onClick={addImage} className="bg-blue-600 text-white px-3 rounded">Add</button>
            </div>
            <ul className="list-disc ml-6">
              {form.workImages.map((u, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="truncate max-w-[500px]">{u}</span>
                  <button type="button" onClick={() => removeImage(i)} className="text-red-600">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Artist</button>
        </form>
      </div>
    </div>
  )
}

export default AdminArtistRegister


