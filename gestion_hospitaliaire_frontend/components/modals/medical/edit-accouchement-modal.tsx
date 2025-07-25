"use client"

import { useState, useEffect } from "react"
import { CreateAccouchementModal } from "./create-accouchement-modal"
import type { Accouchement, CreateAccouchementPayload } from "@/types/accouchement"
import type { DossierGrossesse } from "@/types/medical"

interface EditAccouchementModalProps {
  accouchement: Accouchement | null
  onClose: () => void
  onUpdate: (id: number, data: Partial<CreateAccouchementPayload>) => Promise<void>
  dossiers: DossierGrossesse[]
}

export function EditAccouchementModal({ accouchement, onClose, onUpdate, dossiers }: EditAccouchementModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsModalOpen(!!accouchement)
  }, [accouchement])

  const handleSubmit = async (data: CreateAccouchementPayload) => {
    if (!accouchement?.id) return
    await onUpdate(accouchement.id, data)
    setIsModalOpen(false)
    onClose()
  }

  const handleClose = () => {
    setIsModalOpen(false)
    onClose()
  }

  return (
    <CreateAccouchementModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      dossiers={dossiers}
      initialData={accouchement}
    />
  )
}
