'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { createTheatre } from '../api/authService'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Plus, Minus } from "lucide-react"

export default function CreateTheatreForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: {
            city: '',
            pincode: '',
            latitude: '',
            longitude: '',
            address: ''
        },
        screens: [
            {
                name: 'Screen 1',
                slots: [{ startTime: '' }],
                seatCategories: [{ name: '', capacity: 0, price: 0 }]
            }
        ]
    })
    const [error, setError] = useState('')
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        console.log(user)
        // if (!user) {
        //     router.push('/login')
        // }
    }, [user, router])

    const handleChange = (e, screenIndex, slotIndex, categoryIndex) => {
        const { name, value } = e.target
        setFormData(prevData => {
            const newData = { ...prevData }
            if (screenIndex !== undefined) {
                if (slotIndex !== undefined) {
                    newData.screens[screenIndex].slots[slotIndex].startTime = value
                } else if (categoryIndex !== undefined) {
                    newData.screens[screenIndex].seatCategories[categoryIndex][name] = name === 'name' ? value : Number(value)
                } else {
                    newData.screens[screenIndex][name] = value
                }
            } else if (name.startsWith('address.')) {
                newData.address[name.split('.')[1]] = value
            } else {
                newData[name] = value
            }
            return newData
        })
    }

    const addScreen = () => {
        if (formData.screens.length < 5) {
            setFormData(prevData => ({
                ...prevData,
                screens: [
                    ...prevData.screens,
                    {
                        name: `Screen ${prevData.screens.length + 1}`,
                        slots: [{ startTime: '' }],
                        seatCategories: [{ name: '', capacity: 0, price: 0 }]
                    }
                ]
            }))
        }
    }

    const removeScreen = (index) => {
        setFormData(prevData => ({
            ...prevData,
            screens: prevData.screens.filter((_, i) => i !== index)
        }))
    }

    const addSlot = (screenIndex) => {
        if (formData.screens[screenIndex].slots.length < 5) {
            setFormData(prevData => {
                const newData = { ...prevData }
                newData.screens[screenIndex].slots.push({ startTime: '' })
                return newData
            })
        }
    }

    const removeSlot = (screenIndex, slotIndex) => {
        setFormData(prevData => {
            const newData = { ...prevData }
            newData.screens[screenIndex].slots = newData.screens[screenIndex].slots.filter((_, i) => i !== slotIndex)
            return newData
        })
    }

    const addSeatCategory = (screenIndex) => {
        if (formData.screens[screenIndex].seatCategories.length < 5) {
            setFormData(prevData => {
                const newData = { ...prevData }
                newData.screens[screenIndex].seatCategories.push({ name: '', capacity: 0, price: 0 })
                return newData
            })
        }
    }

    const removeSeatCategory = (screenIndex, categoryIndex) => {
        setFormData(prevData => {
            const newData = { ...prevData }
            newData.screens[screenIndex].seatCategories = newData.screens[screenIndex].seatCategories.filter((_, i) => i !== categoryIndex)
            return newData
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await createTheatre(formData)
            console.log('Theatre created:', response)
            //TODO : add theatere 
            //router.push('/theatres') // Assuming you have a page to list theatres
            router.push('/')
        } catch (err) {
            setError(err.message)
        }
    }

    const getGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setFormData(prevData => ({
                    ...prevData,
                    address: {
                        ...prevData.address,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }
                }))
            }, function (error) {
                setError("Error: " + error.message)
            })
        } else {
            setError("Geolocation is not supported by this browser.")
        }
    }

    if (!user) {
        return null // or a loading spinner
    }

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Create a New Theatre</CardTitle>
                <CardDescription>Enter the details of your new theatre</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Theatre Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Address</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="address.city"
                                placeholder="City"
                                value={formData.address.city}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="address.pincode"
                                placeholder="Pincode"
                                value={formData.address.pincode}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="address.latitude"
                                placeholder="Latitude"
                                value={formData.address.latitude}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="address.longitude"
                                placeholder="Longitude"
                                value={formData.address.longitude}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Input
                            name="address.address"
                            placeholder="Full Address"
                            value={formData.address.address}
                            onChange={handleChange}
                            required
                        />
                        <Button type="button" onClick={getGeolocation}>Get Current Location</Button>
                    </div>

                    {formData.screens.map((screen, screenIndex) => (
                        <Card key={screenIndex} className="p-4">
                            <CardTitle className="text-lg mb-2">Screen {screenIndex + 1}</CardTitle>
                            <div className="space-y-2">
                                <Label>Screen Name</Label>
                                <Input
                                    name="name"
                                    value={screen.name}
                                    onChange={(e) => handleChange(e, screenIndex)}
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <Label>Slots</Label>
                                {screen.slots.map((slot, slotIndex) => (
                                    <div key={slotIndex} className="flex items-center mt-2">
                                        <Input
                                            type="time"
                                            step="1"
                                            value={slot.startTime}
                                            onChange={(e) => {
                                                const time = e.target.value;
                                                const [hours, minutes] = time.split(':');
                                                const formattedTime = `${hours}:${minutes}:00`;
                                                handleChange({ target: { value: formattedTime } }, screenIndex, slotIndex);
                                            }}
                                            required
                                        />
                                        {screen.slots.length > 1 && (
                                            <Button type="button" variant="ghost" onClick={() => removeSlot(screenIndex, slotIndex)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {screen.slots.length < 5 && (
                                    <Button type="button" variant="outline" onClick={() => addSlot(screenIndex)} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" /> Add Slot
                                    </Button>
                                )}
                            </div>

                            <div className="mt-4">
                                <Label>Seat Categories</Label>
                                {screen.seatCategories.map((category, categoryIndex) => (
                                    <div key={categoryIndex} className="grid grid-cols-3 gap-2 mt-2">
                                        <Input
                                            name="name"
                                            placeholder="Category Name"
                                            value={category.name}
                                            onChange={(e) => handleChange(e, screenIndex, undefined, categoryIndex)}
                                            required
                                        />
                                        <Input
                                            name="capacity"
                                            type="number"
                                            placeholder="Capacity"
                                            value={category.capacity}
                                            onChange={(e) => handleChange(e, screenIndex, undefined, categoryIndex)}
                                            required
                                        />
                                        <Input
                                            name="price"
                                            type="number"
                                            placeholder="Price"
                                            value={category.price}
                                            onChange={(e) => handleChange(e, screenIndex, undefined, categoryIndex)}
                                            required
                                        />
                                        {screen.seatCategories.length > 1 && (
                                            <Button type="button" variant="ghost" onClick={() => removeSeatCategory(screenIndex, categoryIndex)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {screen.seatCategories.length < 5 && (
                                    <Button type="button" variant="outline" onClick={() => addSeatCategory(screenIndex)} className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" /> Add Seat Category
                                    </Button>
                                )}
                            </div>

                            {formData.screens.length > 1 && (
                                <Button type="button" variant="destructive" onClick={() => removeScreen(screenIndex)} className="mt-4">
                                    Remove Screen
                                </Button>
                            )}
                        </Card>
                    ))}

                    {formData.screens.length < 5 && (
                        <Button type="button" variant="outline" onClick={addScreen}>
                            <Plus className="h-4 w-4 mr-2" /> Add Screen
                        </Button>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} className="w-full">Create Theatre</Button>
            </CardFooter>
        </Card>
    )
}