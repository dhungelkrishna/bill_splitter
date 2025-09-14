'use client';
import React from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const page = () => {
    const router = useRouter()
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    router.push('/login')

  return (
    <div>
        logout
    </div>
  )
}

export default page