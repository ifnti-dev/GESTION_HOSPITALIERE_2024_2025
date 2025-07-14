"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Personne } from "@/types/utilisateur"
import { toast } from "sonner"
import type { CreateDossierGrossessePayload, DossierGrossesse } from "@/types/medical"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CreateDossierGrossesseModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (data: CreateDossierGrossessePayload, id?: number) => void
  patientes: Personne[]
  initialData?: DossierGrossesse | null
}

const rhesusOptions = ["+", "-"]
const statutImmunisationOptions = ["Immunisé", "Non immunisé", "Inconnu"]
const statutSerologieOptions = ["Positif", "Négatif", "Inconnu"]
const booleanOptions = [
  { label: "Oui", value: "true" },
  { label: "Non", value: "false" },
]

const FormField = ({ id, label, children, error }: { id: string; label: string; children: React.ReactNode; error?: string }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && <p className="text-sm font-medium text-red-500">{error}</p>}
  </div>
)

export function CreateDossierGrossesseModal({
  isOpen,
  onOpenChange,
  onSubmit,
  patientes,
  initialData,
}: CreateDossierGrossesseModalProps) {
  const isEditMode = !!initialData

  // State for form fields
  const [selectedPatienteId, setSelectedPatienteId] = useState<string | undefined>()
  const [antecedents, setAntecedents] = useState("")
  const [allergies, setAllergies] = useState("")
  const [traitementsEnCours, setTraitementsEnCours] = useState("")
  const [tension, setTension] = useState("")
  const [groupeSanguin, setGroupeSanguin] = useState<string | undefined>()
  const [dateOuverture, setDateOuverture] = useState("")
  const [nombreGrossesses, setNombreGrossesses] = useState("")
  const [nombreAccouchements, setNombreAccouchements] = useState("")
  const [dateDerniereRegle, setDateDerniereRegle] = useState("")
  const [datePrevueAccouchement, setDatePrevueAccouchement] = useState("")
  const [rhesus, setRhesus] = useState<string | undefined>()
  const [statutImmunisationRubeole, setStatutImmunisationRubeole] = useState<string | undefined>()
  const [statutImmunisationToxo, setStatutImmunisationToxo] = useState<string | undefined>()
  const [statutImmunisationHepatiteB, setStatutImmunisationHepatiteB] = useState<string | undefined>()
  const [statutSerologieHiv, setStatutSerologieHiv] = useState<string | undefined>()
  const [statutSerologieSyphilis, setStatutSerologieSyphilis] = useState<string | undefined>()
  const [presenceDiabeteGestationnel, setPresenceDiabeteGestationnel] = useState<string | undefined>()
  const [presenceHypertensionGestationnelle, setPresenceHypertensionGestationnelle] = useState<string | undefined>()
  const [observationsGenerales, setObservationsGenerales] = useState("")

  const [isPatientComboboxOpen, setIsPatientComboboxOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setSelectedPatienteId(undefined)
    setAntecedents("")
    setAllergies("")
    setTraitementsEnCours("")
    setTension("")
    setGroupeSanguin(undefined)
    setDateOuverture("")
    setNombreGrossesses("")
    setNombreAccouchements("")
    setDateDerniereRegle("")
    setDatePrevueAccouchement("")
    setRhesus(undefined)
    setStatutImmunisationRubeole(undefined)
    setStatutImmunisationToxo(undefined)
    setStatutImmunisationHepatiteB(undefined)
    setStatutSerologieHiv(undefined)
    setStatutSerologieSyphilis(undefined)
    setPresenceDiabeteGestationnel(undefined)
    setPresenceHypertensionGestationnelle(undefined)
    setObservationsGenerales("")
    setErrors({})
  }

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setSelectedPatienteId(initialData.personne?.id?.toString())
        setAntecedents(initialData.antecedents || "")
        setAllergies(initialData.allergies || "")
        setTraitementsEnCours(initialData.traitementsEnCours || "")
        setTension(initialData.tension?.toString() || "")
        setGroupeSanguin(initialData.groupeSanguin)
        setDateOuverture(initialData.dateOuverture?.split("T")[0] || "")
        setNombreGrossesses(initialData.nombreGrossesses?.toString() || "")
        setNombreAccouchements(initialData.nombreAccouchements?.toString() || "")
        setDateDerniereRegle(initialData.dateDerniereRegle?.split("T")[0] || "")
        setDatePrevueAccouchement(initialData.datePrevueAccouchement?.split("T")[0] || "")
        setRhesus(initialData.rhesus)
        setStatutImmunisationRubeole(initialData.statutImmunisationRubeole)
        setStatutImmunisationToxo(initialData.statutImmunisationToxo)
        setStatutImmunisationHepatiteB(initialData.statutImmunisationHepatiteB)
        setStatutSerologieHiv(initialData.statutSerologieHiv)
        setStatutSerologieSyphilis(initialData.statutSerologieSyphilis)
        setPresenceDiabeteGestationnel(initialData.presenceDiabeteGestationnel?.toString())
        setPresenceHypertensionGestationnelle(initialData.presenceHypertensionGestationnelle?.toString())
        setObservationsGenerales(initialData.observationsGenerales || "")
      } else {
        resetForm()
      }
    }
  }, [isOpen, initialData, isEditMode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedPatienteId) newErrors.patiente = "Veuillez sélectionner une patiente."
    if (!dateOuverture) newErrors.dateOuverture = "La date d'ouverture est obligatoire."
    // Add more validations as needed
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    const payload: CreateDossierGrossessePayload = {
      personne: { id: Number(selectedPatienteId) },
      antecedents,
      allergies,
      traitementsEnCours,
      tension: Number(tension) || 0,
      groupeSanguin: groupeSanguin || "",
      dateOuverture,
      nombreGrossesses: Number(nombreGrossesses) || 0,
      nombreAccouchements: Number(nombreAccouchements) || 0,
      dateDerniereRegle,
      datePrevueAccouchement,
      rhesus: rhesus || "",
      statutImmunisationRubeole: statutImmunisationRubeole || "",
      statutImmunisationToxo: statutImmunisationToxo || "",
      statutImmunisationHepatiteB: statutImmunisationHepatiteB || "",
      statutSerologieHiv: statutSerologieHiv || "",
      statutSerologieSyphilis: statutSerologieSyphilis || "",
      presenceDiabeteGestationnel: presenceDiabeteGestationnel === "true",
      presenceHypertensionGestationnelle: presenceHypertensionGestationnelle === "true",
      observationsGenerales,
    }

    onSubmit(payload, isEditMode ? initialData?.id : undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier le Dossier de Grossesse" : "Créer un Nouveau Dossier de Grossesse"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Mettez à jour les informations du dossier." : "Remplissez les informations pour le suivi de grossesse."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Section Patiente */}
            <div className="col-span-full">
              <FormField id="patiente" label="Patiente *" error={errors.patiente}>
                <Popover open={isPatientComboboxOpen} onOpenChange={setIsPatientComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className={cn("w-full justify-between", errors.patiente && "border-red-500")}>
                      {selectedPatienteId ? patientes.find((p) => p.id?.toString() === selectedPatienteId)?.prenom + " " + patientes.find((p) => p.id?.toString() === selectedPatienteId)?.nom : "Sélectionner une patiente..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="bg-white">
                      <CommandInput placeholder="Rechercher une patiente..." className="bg-white" />
                      <CommandList>
                        <CommandEmpty>Aucune patiente trouvée.</CommandEmpty>
                        <CommandGroup>
                          {patientes.map((patiente) => (
                            <CommandItem key={patiente.id} value={`${patiente.prenom} ${patiente.nom}`} onSelect={() => { setSelectedPatienteId(patiente.id?.toString()); setIsPatientComboboxOpen(false) }}>
                              <Check className={cn("mr-2 h-4 w-4", selectedPatienteId === patiente.id?.toString() ? "opacity-100" : "opacity-0")} />
                              {patiente.prenom} {patiente.nom}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormField>
            </div>

            {/* Section Informations Générales */}
            <FormField id="dateOuverture" label="Date d'ouverture *" error={errors.dateOuverture}>
              <Input type="date" value={dateOuverture} onChange={(e) => setDateOuverture(e.target.value)} />
            </FormField>
            <FormField id="dateDerniereRegle" label="Date des dernières règles">
              <Input type="date" value={dateDerniereRegle} onChange={(e) => setDateDerniereRegle(e.target.value)} />
            </FormField>
            <FormField id="datePrevueAccouchement" label="Date prévue d'accouchement">
              <Input type="date" value={datePrevueAccouchement} onChange={(e) => setDatePrevueAccouchement(e.target.value)} />
            </FormField>
            <FormField id="nombreGrossesses" label="Nombre de grossesses">
              <Input type="number" value={nombreGrossesses} onChange={(e) => setNombreGrossesses(e.target.value)} />
            </FormField>
            <FormField id="nombreAccouchements" label="Nombre d'accouchements">
              <Input type="number" value={nombreAccouchements} onChange={(e) => setNombreAccouchements(e.target.value)} />
            </FormField>

            {/* Section Antécédents */}
            <div className="col-span-full">
              <FormField id="antecedents" label="Antécédents">
                <Textarea value={antecedents} onChange={(e) => setAntecedents(e.target.value)} />
              </FormField>
            </div>
            <div className="col-span-full">
              <FormField id="allergies" label="Allergies">
                <Textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} />
              </FormField>
            </div>
            <div className="col-span-full">
              <FormField id="traitementsEnCours" label="Traitements en cours">
                <Textarea value={traitementsEnCours} onChange={(e) => setTraitementsEnCours(e.target.value)} />
              </FormField>
            </div>

            {/* Section Infos Médicales */}
            <FormField id="tension" label="Tension">
              <Input type="text" value={tension} onChange={(e) => setTension(e.target.value)} />
            </FormField> 
            <FormField id="groupeSanguin" label="Groupe Sanguin">
              <Select value={groupeSanguin} onValueChange={setGroupeSanguin}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent className="bg-white">{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(gs => <SelectItem key={gs} value={gs}>{gs}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <FormField id="rhesus" label="Rhésus">
              <Select value={rhesus} onValueChange={setRhesus}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent className="bg-white">{rhesusOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>

            {/* Section Sérologies */}
            <h3 className="col-span-full font-medium text-lg mt-4 border-b pb-2 ">Sérologies et Statuts</h3>
            <FormField id="statutImmunisationRubeole" label="Rubéole">
              <Select value={statutImmunisationRubeole} onValueChange={setStatutImmunisationRubeole}><SelectTrigger className="bg-white"><SelectValue placeholder="Statut..." /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{statutImmunisationOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </FormField> 
            <FormField id="statutImmunisationToxo" label="Toxoplasmose">
              <Select value={statutImmunisationToxo} onValueChange={setStatutImmunisationToxo}><SelectTrigger className="bg-white"><SelectValue placeholder="Statut..." /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{statutImmunisationOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </FormField>
            <FormField id="statutImmunisationHepatiteB" label="Hépatite B">
              <Select value={statutImmunisationHepatiteB} onValueChange={setStatutImmunisationHepatiteB}><SelectTrigger className="bg-white"><SelectValue placeholder="Statut..." /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{statutImmunisationOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </FormField> 
            <FormField id="statutSerologieHiv" label="VIH">
              <Select value={statutSerologieHiv} onValueChange={setStatutSerologieHiv}><SelectTrigger className="bg-white"><SelectValue placeholder="Statut..." /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{statutSerologieOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </FormField> 
            <FormField id="statutSerologieSyphilis" label="Syphilis">
              <Select value={statutSerologieSyphilis} onValueChange={setStatutSerologieSyphilis}><SelectTrigger className="bg-white"><SelectValue placeholder="Statut..." /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{statutSerologieOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </FormField>

            {/* Section Risques */}
            <h3 className="col-span-full font-medium text-lg mt-4 border-b pb-2 ">Risques Spécifiques</h3>
            <FormField id="presenceDiabeteGestationnel" label="Diabète gestationnel">
              <Select value={presenceDiabeteGestationnel} onValueChange={setPresenceDiabeteGestationnel}><SelectTrigger className="bg-white"><SelectValue placeholder="Oui/Non" /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{booleanOptions.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent></Select>
            </FormField>
            <FormField id="presenceHypertensionGestationnelle" label="Hypertension gestationnelle">
              <Select value={presenceHypertensionGestationnelle} onValueChange={setPresenceHypertensionGestationnelle}><SelectTrigger className="bg-white"><SelectValue placeholder="Oui/Non" /></SelectTrigger><SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">{booleanOptions.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent></Select>
            </FormField>

            {/* Section Observations */}
            <div className="col-span-full">
              <FormField id="observationsGenerales" label="Observations générales">
                <Textarea value={observationsGenerales} onChange={(e) => setObservationsGenerales(e.target.value)} />
              </FormField>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {isEditMode ? "Modifier le Dossier" : "Créer le Dossier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}