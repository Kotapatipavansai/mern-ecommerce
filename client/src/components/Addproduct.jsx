import React, { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Addproduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ✅ Handle input change (fix number conversion)
  function handleChange(e) {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }))
  }

  // ✅ Submit form
  async function handleAddProduct(e) {
    e.preventDefault()

    // 🔍 Basic validation
    if (!formData.name || !formData.price || !formData.description) {
      alert("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      // ✅ No need to send headers (interceptor handles token)
      const res = await API.post("/products/add", formData)

      if (res.status === 201) {
        alert("Product added successfully")
        navigate("/")
      }

    } catch (err) {
      console.log(err.response?.data || err.message)
      alert(err.response?.data?.message || "Error adding product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <form onSubmit={handleAddProduct} className="col-12 col-md-6">

          <div className="mb-3">
            <h2>Add Product</h2>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              id="price"
              type="number"
              name="price"
              className="form-control"
              placeholder="Enter Price"
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              id="description"
              type="text"
              name="description"
              className="form-control"
              placeholder="Enter description"
              onChange={handleChange}
              required
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image URL</label>
            <input
              id="image"
              type="text"
              name="image"
              className="form-control"
              placeholder="Enter image url"
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-warning w-100"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  )
}