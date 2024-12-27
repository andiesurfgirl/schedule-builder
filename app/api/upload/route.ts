import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    // Verify authentication with secret
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token?.email) {
      console.log('Auth failed:', { token })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Generate unique filename with user ID for better tracking
    const filename = `${token.email}-${Date.now()}-${file.name}`
    
    // Upload to blob storage
    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}