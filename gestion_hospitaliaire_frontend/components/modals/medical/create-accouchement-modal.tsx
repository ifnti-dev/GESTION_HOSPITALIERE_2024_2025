"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, ChevronsUpDown, Baby, Calendar, Heart, Syringe, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CreateAccouchementPayload, Accouchement } from "@/types/accouchement"
import type { DossierGrossesse } from "@/types/medical"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

interface CreateAccouchementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateAccouchementPayload) => Promise<void>
  dossiers: DossierGrossesse[]
  initialData?: Accouchement | null
}

const typeAccouchementOptions = [
  "Voie basse spontanée",
  "Voie basse assistée",
  "Césarienne programmée",
  "Césarienne d'urgence",
  "Forceps",
  "Ventouse",
  "Siège",
]

const presentationOptions = ["Sommet", "Siège complet", "Siège décomplété", "Transverse", "Face", "Front"]

const typeDelivranceOptions = ["Spontanée", "Dirigée", "Artificielle", "Manuelle"]

const FormField = ({
  id,
  label,
  children,
  required = false,
  error,
}: {
  id: string
  label: string
  children: React.ReactNode
  required?: boolean
  error?: string
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && <p className="text-sm font-medium text-red-500">{error}</p>}
  </div>
)

export function CreateAccouchementModal({
  isOpen,
  onClose,
  onSubmit,
  dossiers,
  initialData,
}: CreateAccouchementModalProps) {

  const { user } = useAuth()
  const currentUserId = user?.profile?.employe.id
  const isEditMode = !!initialData
  const [openDossier, setOpenDossier] = useState(false)
  const [dossierSearch, setDossierSearch] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // États pour les champs du formulaire
  const [formData, setFormData] = useState<CreateAccouchementPayload>({
    date: new Date().toISOString().split("T")[0],
    heure: new Date().toTimeString().slice(0, 8),
    lieu: "",
    presentation: "",
    typeAccouchement: "",
    etatPerinee: null,
    etatVulve: null,
    typeDelivrance: "",
    revisionUterine: false,
    hemorragieGrave: false,
    allaitement30min: false,
    allaitementApres30min: false,
    suitesCouches: null,
    aTerme: false,
    premature: false,
    vivant: false,
    criantAussitot: false,
    mortNe: false,
    reanime: false,
    dureeReanimation: null,
    reanimationEnVain: false,
    apgar1min: null,
    apgar5min: null,
    apgar10min: null,
    taille: null,
    perimetreCranien: null,
    sexe: null,
    poids: 0,
    dateBCG: null,
    datePolio: null,
    
    employe: { id: currentUserId ?? 1 }, // Utiliser l'ID de l'employé connecté ou 1 par défaut
    dossierGrossesse: { id: 0 },
  })

  // Initialiser le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        date: initialData.date,
        heure: initialData.heure,
        lieu: initialData.lieu,
        presentation: initialData.presentation,
        typeAccouchement: initialData.typeAccouchement,
        etatPerinee: initialData.etatPerinee,
        etatVulve: initialData.etatVulve,
        typeDelivrance: initialData.typeDelivrance,
        revisionUterine: initialData.revisionUterine ?? false,
        hemorragieGrave: initialData.hemorragieGrave ?? false,
        allaitement30min: initialData.allaitement30min ?? false,
        allaitementApres30min: initialData.allaitementApres30min ?? false,
        suitesCouches: initialData.suitesCouches,
        aTerme: initialData.aTerme ?? false,
        premature: initialData.premature ?? false,
        vivant: initialData.vivant ?? false,
        criantAussitot: initialData.criantAussitot ?? false,
        mortNe: initialData.mortNe ?? false,
        reanime: initialData.reanime ?? false,
        dureeReanimation: initialData.dureeReanimation,
        reanimationEnVain: initialData.reanimationEnVain ?? false,
        apgar1min: initialData.apgar1min,
        apgar5min: initialData.apgar5min,
        apgar10min: initialData.apgar10min,
        taille: initialData.taille,
        perimetreCranien: initialData.perimetreCranien,
        sexe: initialData.sexe,
        poids: initialData.poids,
        dateBCG: initialData.dateBCG,
        datePolio: initialData.datePolio,
        employe: { id: currentUserId ?? 1 }, // Utiliser l'ID de l'employé connecté ou 1 par défaut
        dossierGrossesse: { id: initialData.dossierGrossesse?.id || 0 },
      })
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        heure: new Date().toTimeString().slice(0, 8),
        lieu: "",
        presentation: "",
        typeAccouchement: "",
        etatPerinee: null,
        etatVulve: null,
        typeDelivrance: "",
        revisionUterine: false,
        hemorragieGrave: false,
        allaitement30min: false,
        allaitementApres30min: false,
        suitesCouches: null,
        aTerme: false,
        premature: false,
        vivant: false,
        criantAussitot: false,
        mortNe: false,
        reanime: false,
        dureeReanimation: null,
        reanimationEnVain: false,
        apgar1min: null,
        apgar5min: null,
        apgar10min: null,
        taille: null,
        perimetreCranien: null,
        sexe: null,
        poids: 0,
        dateBCG: null,
        datePolio: null,
        employe: { id: currentUserId ?? 1 }, // Utiliser l'ID de l'employé connecté ou 1 par défaut
        dossierGrossesse: { id: 0 },
      })
    }
  }, [isEditMode, initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dossierGrossesse.id) {
      newErrors.dossier = "Veuillez sélectionner un dossier de grossesse."
    }
    if (!formData.date) {
      newErrors.date = "La date d'accouchement est obligatoire."
    }
    if (!formData.heure) {
      newErrors.heure = "L'heure d'accouchement est obligatoire."
    }
    if (!formData.lieu) {
      newErrors.lieu = "Le lieu d'accouchement est obligatoire."
    }
    if (!formData.typeAccouchement) {
      newErrors.typeAccouchement = "Le type d'accouchement est obligatoire."
    }
    if (!formData.poids || formData.poids <= 0) {
      newErrors.poids = "Le poids du nouveau-né est obligatoire."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    // Set dossierGrossesse ID from selected dossier (personne is not part of payload)
    const selectedDossier = dossiers.find((d) => d.id === formData.dossierGrossesse.id)
    // If you need to use personne.id, you may need to update your payload type and formData structure accordingly.
    // Otherwise, remove this assignment as personne is not part of CreateAccouchementPayload.

    await onSubmit(formData)
  }

  const selectedDossier = dossiers.find((d) => d.id === formData.dossierGrossesse.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Baby className="h-6 w-6 text-rose-500" />
            {isEditMode ? "Modifier l'Accouchement" : "Nouvel Accouchement"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mettre à jour les informations de l'accouchement et du nouveau-né."
              : "Enregistrer les détails de l'accouchement et les données néonatales."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] p-4 -mx-4">
          <div className="space-y-6 px-2">
            {/* Sélection du dossier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Dossier de grossesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField id="dossier" label="Dossier de grossesse" required error={errors.dossier}>
                  <Popover open={openDossier} onOpenChange={setOpenDossier}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDossier}
                        className={cn("w-full justify-between", errors.dossier && "border-red-500")}
                      >
                        {selectedDossier
                          ? `${selectedDossier.personne?.prenom} ${selectedDossier.personne?.nom} - DG-${selectedDossier.id}`
                          : "Sélectionner un dossier de grossesse..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un dossier..."
                          value={dossierSearch}
                          onValueChange={setDossierSearch}
                        />
                        <CommandList>
                          <CommandEmpty>Aucun dossier trouvé.</CommandEmpty>
                          <CommandGroup>
                            {dossiers
                              .filter(
                                (d) =>
                                  `${d.personne?.prenom} ${d.personne?.nom}`
                                    .toLowerCase()
                                    .includes(dossierSearch.toLowerCase()) || d.id?.toString().includes(dossierSearch),
                              )
                              .map((dossier) => (
                                <CommandItem
                                  key={dossier.id}
                                  value={`${dossier.personne?.prenom} ${dossier.personne?.nom} DG-${dossier.id}`}
                                  onSelect={() => {
                                    setFormData({
                                      ...formData,
                                      dossierGrossesse: { id: dossier.id || 0 },
                                    })
                                    setOpenDossier(false)
                                    setDossierSearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.dossierGrossesse.id === dossier.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {dossier.personne?.prenom} {dossier.personne?.nom}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      DG-{dossier.id} • DPA: {dossier.datePrevueAccouchement}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormField>

                {selectedDossier && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="text-sm">
                      <strong>Patiente:</strong> {selectedDossier.personne?.prenom} {selectedDossier.personne?.nom}
                      <br />
                      <strong>DPA:</strong> {selectedDossier.datePrevueAccouchement}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations d'accouchement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Informations d'accouchement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField id="date" label="Date d'accouchement" required error={errors.date}>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={cn(errors.date && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="heure" label="Heure d'accouchement" required error={errors.heure}>
                    <Input
                      id="heure"
                      type="time"
                      step="1"
                      value={formData.heure}
                      onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                      className={cn(errors.heure && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="lieu" label="Lieu d'accouchement" required error={errors.lieu}>
                    <Input
                      id="lieu"
                      placeholder="ex: Salle de travail 1"
                      value={formData.lieu}
                      onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                      className={cn(errors.lieu && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="typeAccouchement" label="Type d'accouchement" required error={errors.typeAccouchement}>
                    <Select
                      value={formData.typeAccouchement}
                      onValueChange={(value) => setFormData({ ...formData, typeAccouchement: value })}
                    >
                      <SelectTrigger className={cn(errors.typeAccouchement && "border-red-500")}>
                        <SelectValue placeholder="Sélectionner le type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {typeAccouchementOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="presentation" label="Présentation">
                    <Select
                      value={formData.presentation}
                      onValueChange={(value) => setFormData({ ...formData, presentation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {presentationOptions.map((pres) => (
                          <SelectItem key={pres} value={pres}>
                            {pres}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="typeDelivrance" label="Type de délivrance">
                    <Select
                      value={formData.typeDelivrance}
                      onValueChange={(value) => setFormData({ ...formData, typeDelivrance: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {typeDelivranceOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField id="etatPerinee" label="État du périnée">
                    <Input
                      id="etatPerinee"
                      placeholder="ex: Intact, déchirure 1er degré..."
                      value={formData.etatPerinee || ""}
                      onChange={(e) => setFormData({ ...formData, etatPerinee: e.target.value || null })}
                    />
                  </FormField>

                  <FormField id="etatVulve" label="État de la vulve">
                    <Input
                      id="etatVulve"
                      placeholder="ex: Normal, œdème..."
                      value={formData.etatVulve || ""}
                      onChange={(e) => setFormData({ ...formData, etatVulve: e.target.value || null })}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Complications et suites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-red-500" />
                  Complications et suites de couches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="revisionUterine"
                        checked={formData.revisionUterine || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, revisionUterine: checked as boolean })}
                      />
                      <Label htmlFor="revisionUterine">Révision utérine</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hemorragieGrave"
                        checked={formData.hemorragieGrave || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, hemorragieGrave: checked as boolean })}
                      />
                      <Label htmlFor="hemorragieGrave">Hémorragie grave</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allaitement30min"
                        checked={formData.allaitement30min || false}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, allaitement30min: checked as boolean })
                        }
                      />
                      <Label htmlFor="allaitement30min">Allaitement dans les 30 min</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allaitementApres30min"
                        checked={formData.allaitementApres30min || false}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, allaitementApres30min: checked as boolean })
                        }
                      />
                      <Label htmlFor="allaitementApres30min">Allaitement après 30 min</Label>
                    </div>
                  </div>

                  <div>
                    <FormField id="suitesCouches" label="Suites de couches">
                      <Textarea
                        id="suitesCouches"
                        placeholder="Observations sur les suites de couches..."
                        value={formData.suitesCouches || ""}
                        onChange={(e) => setFormData({ ...formData, suitesCouches: e.target.value || null })}
                        rows={4}
                      />
                    </FormField>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Données du nouveau-né */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Baby className="h-5 w-5 text-purple-500" />
                  Données du nouveau-né
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField id="poids" label="Poids (grammes)" required error={errors.poids}>
                    <Input
                      id="poids"
                      type="number"
                      min="0"
                      placeholder="ex: 3200"
                      value={formData.poids || ""}
                      onChange={(e) => setFormData({ ...formData, poids: Number.parseInt(e.target.value) || 0 })}
                      className={cn(errors.poids && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="taille" label="Taille (cm)">
                    <Input
                      id="taille"
                      type="number"
                      min="0"
                      placeholder="ex: 50"
                      value={formData.taille || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, taille: e.target.value ? Number.parseInt(e.target.value) : null })
                      }
                    />
                  </FormField>

                  <FormField id="perimetreCranien" label="Périmètre crânien (cm)">
                    <Input
                      id="perimetreCranien"
                      type="number"
                      min="0"
                      placeholder="ex: 35"
                      value={formData.perimetreCranien || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          perimetreCranien: e.target.value ? Number.parseInt(e.target.value) : null,
                        })
                      }
                    />
                  </FormField>

                  <FormField id="sexe" label="Sexe">
                    <Select
                      value={formData.sexe || ""}
                      onValueChange={(value) => setFormData({ ...formData, sexe: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="apgar1min" label="APGAR 1 min">
                    <Input
                      id="apgar1min"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      value={formData.apgar1min || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, apgar1min: e.target.value ? Number.parseInt(e.target.value) : null })
                      }
                    />
                  </FormField>

                  <FormField id="apgar5min" label="APGAR 5 min">
                    <Input
                      id="apgar5min"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      value={formData.apgar5min || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, apgar5min: e.target.value ? Number.parseInt(e.target.value) : null })
                      }
                    />
                  </FormField>
                  <FormField id="apgar10min" label="APGAR 10 min">
                    <Input
                      id="apgar5min"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      value={formData.apgar10min || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, apgar10min: e.target.value ? Number.parseInt(e.target.value) : null })
                      }
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">État du nouveau-né</h4>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terme"
                        checked={formData.aTerme || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, aTerme: checked as boolean })}
                      />
                      <Label htmlFor="terme">À terme</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="premature"
                        checked={formData.premature || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, premature: checked as boolean })}
                      />
                      <Label htmlFor="premature">Prématuré</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vivant"
                        checked={formData.vivant || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, vivant: checked as boolean })}
                      />
                      <Label htmlFor="vivant">Vivant</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="criantAussitot"
                        checked={formData.criantAussitot || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, criantAussitot: checked as boolean })}
                      />
                      <Label htmlFor="criantAussitot">Criant aussitôt</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mortNe"
                        checked={formData.mortNe || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, mortNe: checked as boolean })}
                      />
                      <Label htmlFor="mortNe">Mort-né</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Réanimation</h4>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reanime"
                        checked={formData.reanime || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, reanime: checked as boolean })}
                      />
                      <Label htmlFor="reanime">Réanimé</Label>
                    </div>

                    {formData.reanime && (
                      <>
                        <FormField id="dureeReanimation" label="Durée réanimation (min)">
                          <Input
                            id="dureeReanimation"
                            type="number"
                            min="0"
                            placeholder="en minutes"
                            value={formData.dureeReanimation || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dureeReanimation: e.target.value ? Number.parseInt(e.target.value) : null,
                              })
                            }
                          />
                        </FormField>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="reanimationEnVain"
                            checked={formData.reanimationEnVain || false}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, reanimationEnVain: checked as boolean })
                            }
                          />
                          <Label htmlFor="reanimationEnVain">Réanimation en vain</Label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vaccinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Syringe className="h-5 w-5 text-yellow-500" />
                  Vaccinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField id="dateBCG" label="Date BCG">
                    <Input
                      id="dateBCG"
                      type="date"
                      value={formData.dateBCG || ""}
                      onChange={(e) => setFormData({ ...formData, dateBCG: e.target.value || null })}
                    />
                  </FormField>

                  <FormField id="datePolio" label="Date Polio">
                    <Input
                      id="datePolio"
                      type="date"
                      value={formData.datePolio || ""}
                      onChange={(e) => setFormData({ ...formData, datePolio: e.target.value || null })}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
          >
            <Baby className="h-4 w-4 mr-2" />
            {isEditMode ? "Mettre à jour" : "Enregistrer l'accouchement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
