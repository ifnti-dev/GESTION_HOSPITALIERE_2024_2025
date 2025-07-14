"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Personne } from "@/types/utilisateur"
import { ConsultationFormData } from "@/types/consultstionsTraitement"
import { calculateAge } from "@/lib/utils"

interface AddConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  patientes: Personne[]
  newConsultation: ConsultationFormData
  setNewConsultation: (data: ConsultationFormData) => void
  handleAddConsultation: () => Promise<void>
}

export function AddConsultationModal({
  isOpen,
  onClose,
  patientes,
  newConsultation,
  setNewConsultation,
  handleAddConsultation
}: AddConsultationModalProps) {
  const [openPatiente, setOpenPatiente] = useState(false)
  const [patienteSearch, setPatienteSearch] = useState("")
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Consultation Prénatale</DialogTitle>
          <DialogDescription>Enregistrer les détails d'une nouvelle consultation.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="patiente">Patiente *</Label>
            <Popover open={openPatiente} onOpenChange={setOpenPatiente}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPatiente}
                  className="w-full justify-between"
                >
                  {newConsultation.patiente.id
                    ? patientes.find(p => p.id === newConsultation.patiente.id)?.prenom + " " + 
                      patientes.find(p => p.id === newConsultation.patiente.id)?.nom
                    : "Sélectionner une patiente..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher une patiente..."
                    value={patienteSearch}
                    onValueChange={setPatienteSearch}
                  />
                  <CommandEmpty>Aucune patiente trouvée.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {patientes
                      .filter(p => 
                        `${p.prenom} ${p.nom}`.toLowerCase().includes(patienteSearch.toLowerCase())
                      )
                      .map(patiente => (
                        <CommandItem
                          key={patiente.id}
                          value={`${patiente.prenom} ${patiente.nom}`}
                          onSelect={() => {
                            setNewConsultation({
                              ...newConsultation,
                              patiente: { id: patiente.id || 0 }
                            })
                            setOpenPatiente(false)
                            setPatienteSearch("")
                          }}
                        >
                          {patiente.prenom} {patiente.nom}
                          {patiente.dateNaissance && ` (${calculateAge(patiente.dateNaissance)} ans)`}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date de consultation *</Label>
            <Input 
              id="date"
              type="date"
              value={newConsultation.dateConsultation}
              onChange={(e) => setNewConsultation({...newConsultation, dateConsultation: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="semaines">Semaines d'aménorrhée *</Label>
            <Input 
              id="semaines"
              type="number"
              placeholder="SA"
              value={newConsultation.semaineAmenorrhee}
              onChange={(e) => setNewConsultation({...newConsultation, semaineAmenorrhee: parseInt(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poids">Poids (kg) *</Label>
            <Input 
              id="poids"
              type="number"
              step="0.1"
              placeholder="kg"
              value={newConsultation.poids}
              onChange={(e) => setNewConsultation({...newConsultation, poids: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tension">Tension artérielle *</Label>
            <Input 
              id="tension"
              placeholder="ex: 120/80"
              value={newConsultation.tensionArterielle}
              onChange={(e) => setNewConsultation({...newConsultation, tensionArterielle: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hauteur">Hauteur utérine (cm)</Label>
            <Input 
              id="hauteur"
              type="number"
              placeholder="cm"
              value={newConsultation.hauteurUterine || ""}
              onChange={(e) => setNewConsultation({
                ...newConsultation, 
                hauteurUterine: e.target.value ? parseInt(e.target.value) : null
              })}
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="bruits">Bruits cardiaques fœtaux</Label>
            <Input 
              id="bruits"
              placeholder="ex: Positifs, 140 bpm"
              value={newConsultation.bruitsCardiaquesFoetaux || ""}
              onChange={(e) => setNewConsultation({...newConsultation, bruitsCardiaquesFoetaux: e.target.value})}
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="observations">Observations</Label>
            <Textarea 
              id="observations"
              placeholder="Notes et observations..."
              value={newConsultation.observations || ""}
              onChange={(e) => setNewConsultation({...newConsultation, observations: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rdv">Prochain RDV</Label>
            <Input 
              id="rdv"
              type="date"
              value={newConsultation.prochainRdv || ""}
              onChange={(e) => setNewConsultation({...newConsultation, prochainRdv: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alerte">Alerte</Label>
            <Input 
              id="alerte"
              placeholder="ex: Hypertension suspectée"
              value={newConsultation.alerte || ""}
              onChange={(e) => setNewConsultation({...newConsultation, alerte: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button 
            className="bg-gradient-to-r from-rose-600 to-pink-600"
            onClick={handleAddConsultation}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}