"use client"

import { useStoreModal } from '@/hooks/use-store-modal'
import { useEffect } from 'react'

const RootPage = () => {
  const onOpen = useStoreModal(state => state.onOpen)
  const isOpen = useStoreModal(state => state.isOpen)

  useEffect(() => {
    !isOpen && onOpen()
  }, [isOpen, onOpen])
  return (
    <div className=""></div>
  )
}

export default RootPage