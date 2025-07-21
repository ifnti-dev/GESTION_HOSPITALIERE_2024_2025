import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateHospitalisation } from "@/types/consultstionsTraitement"

interface AddHospitalisationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (hospitalisation: any) => void
  patients: any[]
  services: any[]
}

export function AddHospitalisationModal({
  isOpen,
  onClose,
  onSuccess,
  patients,
  services,
}: AddHospitalisationModalProps) {
  const [formData, setFormData] = useState<CreateHospitalisation>({
    date_entree: new Date().toISOString(),
    lit: 0,
    patient: { id: 0 },
    service: { id: 0 }
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/hospitalisations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error("Erreur lors de la création")
      
      const newHospitalisation = await response.json()
      onSuccess(newHospitalisation)
      onClose()
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Hospitalisation</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour enregistrer une nouvelle hospitalisation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Patient
              </Label>
              <Select
                onValueChange={(value) => setFormData({...formData, patient: { id: parseInt(value) }})}
                defaultValue={formData.patient.id.toString()}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.prenom} {patient.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Select
                onValueChange={(value) => setFormData({...formData, service: { id: parseInt(value) }})}
                defaultValue={formData.service.id.toString()}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_entree" className="text-right">
                Date d'entrée
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !formData.date_entree && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_entree ? (
                      format(new Date(formData.date_entree), "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.date_entree)}
                    onSelect={(date) => 
                      date && setFormData({...formData, date_entree: date.toISOString()})
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lit" className="text-right">
                Numéro de lit
              </Label>
              <Input
                id="lit"
                type="number"
                className="col-span-3"
                value={formData.lit}
                onChange={(e) => setFormData({...formData, lit: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}