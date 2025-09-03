"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import api from "./api"

const BookSession = () => {
  const [locationInput, setLocationInput] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [therapists, setTherapists] = useState([])
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  }

  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#1a1a1a" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#000000" }, { lightness: 13 }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#08304b" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#0c4152" }, { lightness: 5 }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b434f" }, { lightness: 25 }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b3d51" }, { lightness: 16 }],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ color: "#146474" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#021019" }],
    },
  ]

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setError("")
    setSelectedTherapist(null)
    setTherapists([])
    setLoading(true)

    try {
      const res = await api.get("/therapists/search", {
        params: { location: locationInput },
      })

      if (!res.data.success || !Array.isArray(res.data.data)) {
        throw new Error(res.data.message || "Unexpected response format")
      }

      setTherapists(res.data.data)
      if (res.data.data.length > 0) {
        setUserLocation(res.data.data[0].geometry.location)
      } else {
        setError("No therapists found nearby.")
      }
    } catch (err) {
      console.error("Error searching therapists:", err)
      setError("Failed to find therapists.")
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time")
      return
    }

    setBookingLoading(true)
    try {
      // Mock booking API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setShowBookingModal(false)
      setSelectedDate("")
      setSelectedTime("")
      // Show success message or redirect
      alert("Session booked successfully!")
    } catch (err) {
      setError("Failed to book session")
    } finally {
      setBookingLoading(false)
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`)
      if (hour < 17) slots.push(`${hour}:30`)
    }
    return slots
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Find Therapists Near You
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover qualified mental health professionals in your area and book sessions that fit your schedule
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 12.414a1 1 0 00-.707-.293H11.5a6.5 6.5 0 10-1.414 1.414v1.207a1 1 0 00.293.707l4.243 4.243a1 1 0 001.414-1.414z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter your city, zip code, or address"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>Search Therapists</span>
                  </div>
                )}
              </button>
            </form>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Therapists List */}
            {therapists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1 space-y-4"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">Available Therapists</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {therapists.map((therapist) => (
                    <motion.div
                      key={therapist.place_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                        selectedTherapist?.place_id === therapist.place_id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedTherapist(therapist)}
                    >
                      <h3 className="font-semibold text-white mb-2">{therapist.name || "Unnamed Therapist"}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {therapist.vicinity || therapist.formatted_address || "No address available"}
                      </p>
                      {therapist.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-gray-300 text-sm">{therapist.rating}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`${therapists.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} bg-white/5 rounded-lg overflow-hidden border border-white/10`}
            >
              <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={userLocation ? 12 : 2}
                  center={userLocation || { lat: 0, lng: 0 }}
                  options={{
                    styles: mapStyles,
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {therapists.map((therapist) => (
                    <Marker
                      key={therapist.place_id}
                      position={therapist.geometry.location}
                      onClick={() => setSelectedTherapist(therapist)}
                      icon={{
                        url:
                          "data:image/svg+xml;charset=UTF-8," +
                          encodeURIComponent(`
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#ffffff" strokeWidth="2"/>
                            <path d="M20 10C16.686 10 14 12.686 14 16C14 20 20 30 20 30S26 20 26 16C26 12.686 23.314 10 20 10ZM20 18C18.896 18 18 17.104 18 16C18 14.896 18.896 14 20 14C21.104 14 22 14.896 22 16C22 17.104 21.104 18 20 18Z" fill="white"/>
                          </svg>
                        `),
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  ))}

                  {selectedTherapist && (
                    <InfoWindow
                      position={selectedTherapist.geometry.location}
                      onCloseClick={() => setSelectedTherapist(null)}
                    >
                      <div className="bg-white p-4 rounded-lg shadow-lg max-w-[280px] text-black">
                        <h3 className="font-bold text-lg mb-2">{selectedTherapist.name || "Unnamed Therapist"}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {selectedTherapist.vicinity || selectedTherapist.formatted_address || "No address available"}
                        </p>
                        {selectedTherapist.rating && (
                          <div className="flex items-center space-x-1 mb-3">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-gray-700 text-sm">{selectedTherapist.rating}</span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setShowBookingModal(true)
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          Book Session
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedTherapist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Book Session</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">{selectedTherapist.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedTherapist.vicinity || selectedTherapist.formatted_address}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="" className="bg-gray-800">
                        Choose a time
                      </option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time} className="bg-gray-800">
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookSession}
                    disabled={bookingLoading || !selectedDate || !selectedTime}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Booking...</span>
                      </div>
                    ) : (
                      "Book Session"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookSession
