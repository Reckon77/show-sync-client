'use client'

import { useState } from 'react'
import { createMovie } from '../api/movieService'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function CreateMovieForm() {
  const [formData, setFormData] = useState({
    movieName: '',
    movieDesc: '',
    genre: '',
    movieLength: '',
    language: '',
    rated: '',
    releaseDate: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const movieDataToSend = {
        ...formData,
        movieLength: parseInt(formData.movieLength, 10)
      }
      const response = await createMovie(movieDataToSend)
      console.log('Movie created:', response)
      setSuccess(true)
      // Reset form after successful submission
      setFormData({
        movieName: '',
        movieDesc: '',
        genre: '',
        movieLength: '',
        language: '',
        rated: '',
        releaseDate: ''
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Create a New Movie</CardTitle>
        <CardDescription className="text-center text-lg">Enter the details of the new movie</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="movieName" className="text-lg font-semibold">Movie Name</Label>
            <Input
              id="movieName"
              name="movieName"
              value={formData.movieName}
              onChange={handleChange}
              required
              className="text-lg"
              placeholder="Enter movie name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movieDesc" className="text-lg font-semibold">Movie Description</Label>
            <Textarea
              id="movieDesc"
              name="movieDesc"
              value={formData.movieDesc}
              onChange={handleChange}
              required
              className="min-h-[100px] text-lg"
              placeholder="Enter movie description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-lg font-semibold">Genre</Label>
              <Select name="genre" onValueChange={(value) => handleSelectChange('genre', value)}>
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                  <SelectItem value="Horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-lg font-semibold">Language</Label>
              <Input
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="text-lg"
                placeholder="Enter language"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="movieLength" className="text-lg font-semibold">Movie Length (minutes)</Label>
              <Input
                id="movieLength"
                name="movieLength"
                type="number"
                value={formData.movieLength}
                onChange={handleChange}
                required
                className="text-lg"
                placeholder="Enter length"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rated" className="text-lg font-semibold">Rating</Label>
              <Select name="rated" onValueChange={(value) => handleSelectChange('rated', value)}>
                <SelectTrigger id="rated">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G">G</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                  <SelectItem value="PG-13">PG-13</SelectItem>
                  <SelectItem value="R">R</SelectItem>
                  <SelectItem value="NC-17">NC-17</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-lg font-semibold">Release Date</Label>
              <Input
                id="releaseDate"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                className="text-lg"
              />
            </div>
          </div>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="mt-6 bg-green-100 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Movie created successfully!</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full text-lg py-6">Create Movie</Button>
      </CardFooter>
    </Card>
  )
}