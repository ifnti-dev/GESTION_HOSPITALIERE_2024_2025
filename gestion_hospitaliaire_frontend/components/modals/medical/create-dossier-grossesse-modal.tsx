"use client"

import type React from "react"

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
import { Check, ChevronsUpDown, User, Heart, Calendar, TestTube, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Personne } from "@/types/utilisateur"
import { toast } from "sonner"
import type { CreateDossierGrossessePayload, DossierGrossesse } from "@/types/medical"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreateDossierGrossesseModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (data: CreateDossierGrossessePayload, id?: number) => void
  patientes: Personne[]
  initialData?: DossierGrossesse | null
}

const groupesSanguins = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const rhesusOptions = ["+", "-"]
const statutSerologieOptions = ["Immunisé", "Non immunisé"]
const statutSerologieResultOptions = ["Positif", "Négatif", "Inconnue", "Non fait"]

const FormField = ({
  id,
  label,
  children,
  error,
  required = false,
}: {
  id: string
  label: string
  children: React.ReactNode
  error?: string
  required?: boolean
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
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

  // Informations du partenaire
  const [nomPartenaire, setNomPartenaire] = useState("")
  const [prenomsPartenaire, setPrenomsPartenaire] = useState("")
  const [professionPartenaire, setProfessionPartenaire] = useState("")
  const [adressePartenaire, setAdressePartenaire] = useState("")

  // Antécédents
  const [antecedentsMedicaux, setAntecedentsMedicaux] = useState("")
  const [antecedentsChirurgicaux, setAntecedentsChirurgicaux] = useState("")
  const [antecedentsGynecologiques, setAntecedentsGynecologiques] = useState("")
  const [antecedentsObstetricaux, setAntecedentsObstetricaux] = useState("")

  // Informations de grossesse
  const [dateOuverture, setDateOuverture] = useState("")
  const [dateDerniereRegle, setDateDerniereRegle] = useState("")
  const [datePrevueAccouchement, setDatePrevueAccouchement] = useState("")
  const [nombreGrossesses, setNombreGrossesses] = useState("")
  const [nombreAccouchements, setNombreAccouchements] = useState("")

  // Informations médicales
  const [groupeSanguin, setGroupeSanguin] = useState<string | undefined>()
  const [rhesus, setRhesus] = useState<string | undefined>()

  // Sérologies
  const [statutSerologieRubeole, setStatutSerologieRubeole] = useState<string | undefined>()
  const [statutSerologieToxo, setStatutSerologieToxo] = useState<string | undefined>()
  const [statutSerologieHepatiteB, setStatutSerologieHepatiteB] = useState<string | undefined>()
  const [statutSerologieHiv, setStatutSerologieHiv] = useState<string | undefined>()
  const [statutSerologieSyphilis, setStatutSerologieSyphilis] = useState<string | undefined>()

  const [isPatientComboboxOpen, setIsPatientComboboxOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setSelectedPatienteId(undefined)
    setNomPartenaire("")
    setPrenomsPartenaire("")
    setProfessionPartenaire("")
    setAdressePartenaire("")
    setAntecedentsMedicaux("")
    setAntecedentsChirurgicaux("")
    setAntecedentsGynecologiques("")
    setAntecedentsObstetricaux("")
    setDateOuverture("")
    setDateDerniereRegle("")
    setDatePrevueAccouchement("")
    setNombreGrossesses("")
    setNombreAccouchements("")
    setGroupeSanguin(undefined)
    setRhesus(undefined)
    setStatutSerologieRubeole(undefined)
    setStatutSerologieToxo(undefined)
    setStatutSerologieHepatiteB(undefined)
    setStatutSerologieHiv(undefined)
    setStatutSerologieSyphilis(undefined)
    setErrors({})
  }

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setSelectedPatienteId(initialData.personne?.id?.toString())
        setNomPartenaire(initialData.nomPartenaire || "")
        setPrenomsPartenaire(initialData.prenomsPartenaire || "")
        setProfessionPartenaire(initialData.professionPartenaire || "")
        setAdressePartenaire(initialData.adressePartenaire || "")
        setAntecedentsMedicaux(initialData.antecedentsMedicaux || "")
        setAntecedentsChirurgicaux(initialData.antecedentsChirurgicaux || "")
        setAntecedentsGynecologiques(initialData.antecedentsGynecologiques || "")
        setAntecedentsObstetricaux(initialData.antecedentsObstetricaux || "")
        setDateOuverture(initialData.dateOuverture?.split("T")[0] || "")
        setDateDerniereRegle(initialData.dateDerniereRegle?.split("T")[0] || "")
        setDatePrevueAccouchement(initialData.datePrevueAccouchement?.split("T")[0] || "")
        setNombreGrossesses(initialData.nombreGrossesses?.toString() || "")
        setNombreAccouchements(initialData.nombreAccouchements?.toString() || "")
        setGroupeSanguin(initialData.groupeSanguin)
        setRhesus(initialData.rhesus)
        setStatutSerologieRubeole(initialData.statutSerologieRubeole)
        setStatutSerologieToxo(initialData.statutSerologieToxo)
        setStatutSerologieHepatiteB(initialData.statutSerologieHepatiteB)
        setStatutSerologieHiv(initialData.statutSerologieHiv)
        setStatutSerologieSyphilis(initialData.statutSerologieSyphilis)
      } else {
        resetForm()
      }
    }
  }, [isOpen, initialData, isEditMode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedPatienteId) newErrors.patiente = "Veuillez sélectionner une patiente."
    if (!dateOuverture) newErrors.dateOuverture = "La date d'ouverture est obligatoire."
    if (!dateDerniereRegle) newErrors.dateDerniereRegle = "La date des dernières règles est obligatoire."

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
      nomPartenaire,
      prenomsPartenaire,
      professionPartenaire,
      adressePartenaire,
      antecedentsMedicaux,
      antecedentsChirurgicaux,
      antecedentsGynecologiques,
      antecedentsObstetricaux,
      dateOuverture,
      dateDerniereRegle,
      datePrevueAccouchement,
      nombreGrossesses: Number(nombreGrossesses) || 0,
      nombreAccouchements: Number(nombreAccouchements) || 0,
      groupeSanguin: groupeSanguin || "",
      rhesus: rhesus || "",
      statutSerologieRubeole: statutSerologieRubeole || "",
      statutSerologieToxo: statutSerologieToxo || "",
      statutSerologieHepatiteB: statutSerologieHepatiteB || "",
      statutSerologieHiv: statutSerologieHiv || "",
      statutSerologieSyphilis: statutSerologieSyphilis || "",
    }

    onSubmit(payload, isEditMode ? initialData?.id : undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            {isEditMode ? "Modifier le Dossier de Grossesse" : "Créer un Nouveau Dossier de Grossesse"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mettez à jour les informations du dossier de suivi de grossesse."
              : "Remplissez les informations pour le suivi de grossesse selon le carnet de santé mère et enfant."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] p-4">
          <div className="space-y-6">
            {/* Section Patiente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-500" />
                  Gestante (Femme enceinte)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField id="patiente" label="Patiente" error={errors.patiente} required>
                  <Popover open={isPatientComboboxOpen} onOpenChange={setIsPatientComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", errors.patiente && "border-red-500")}
                      >
                        {selectedPatienteId
                          ? patientes.find((p) => p.id?.toString() === selectedPatienteId)?.prenom +
                            " " +
                            patientes.find((p) => p.id?.toString() === selectedPatienteId)?.nom
                          : "Sélectionner une patiente..."}
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
                              <CommandItem
                                key={patiente.id}
                                value={`${patiente.prenom} ${patiente.nom}`}
                                onSelect={() => {
                                  setSelectedPatienteId(patiente.id?.toString())
                                  setIsPatientComboboxOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedPatienteId === patiente.id?.toString() ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {patiente.prenom} {patiente.nom}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormField>
              </CardContent>
            </Card>

            {/* Section Partenaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-green-500" />
                  Partenaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField id="nomPartenaire" label="Nom du partenaire">
                    <Input
                      value={nomPartenaire}
                      onChange={(e) => setNomPartenaire(e.target.value)}
                      placeholder="Nom de famille"
                    />
                  </FormField>

                  <FormField id="prenomsPartenaire" label="Prénoms du partenaire">
                    <Input
                      value={prenomsPartenaire}
                      onChange={(e) => setPrenomsPartenaire(e.target.value)}
                      placeholder="Prénoms"
                    />
                  </FormField>

                  <FormField id="professionPartenaire" label="Profession du partenaire">
                    <Input
                      value={professionPartenaire}
                      onChange={(e) => setProfessionPartenaire(e.target.value)}
                      placeholder="Profession"
                    />
                  </FormField>

                  <FormField id="adressePartenaire" label="Adresse du partenaire">
                    <Input
                      value={adressePartenaire}
                      onChange={(e) => setAdressePartenaire(e.target.value)}
                      placeholder="Adresse complète"
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Section Antécédents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Antécédents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField id="antecedentsMedicaux" label="Antécédents médicaux">
                    <Textarea
                      value={antecedentsMedicaux}
                      onChange={(e) => setAntecedentsMedicaux(e.target.value)}
                      placeholder="Maladies graves, traitements en cours..."
                      rows={3}
                    />
                  </FormField>

                  <FormField id="antecedentsChirurgicaux" label="Antécédents chirurgicaux">
                    <Textarea
                      value={antecedentsChirurgicaux}
                      onChange={(e) => setAntecedentsChirurgicaux(e.target.value)}
                      placeholder="Opérations, interventions chirurgicales..."
                      rows={3}
                    />
                  </FormField>

                  <FormField id="antecedentsGynecologiques" label="Antécédents gynécologiques">
                    <Textarea
                      value={antecedentsGynecologiques}
                      onChange={(e) => setAntecedentsGynecologiques(e.target.value)}
                      placeholder="Traitements d'infertilité, opérations sur l'utérus..."
                      rows={3}
                    />
                  </FormField>

                  <FormField id="antecedentsObstetricaux" label="Antécédents obstétricaux">
                    <Textarea
                      value={antecedentsObstetricaux}
                      onChange={(e) => setAntecedentsObstetricaux(e.target.value)}
                      placeholder="Césariennes, complications lors d'accouchements précédents..."
                      rows={3}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Section Grossesse actuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Grossesse actuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    id="dateOuverture"
                    label="Date d'ouverture du dossier"
                    error={errors.dateOuverture}
                    required
                  >
                    <Input
                      type="date"
                      value={dateOuverture}
                      onChange={(e) => setDateOuverture(e.target.value)}
                      className={cn(errors.dateOuverture && "border-red-500")}
                    />
                  </FormField>

                  <FormField
                    id="dateDerniereRegle"
                    label="DDR (Date des dernières règles)"
                    error={errors.dateDerniereRegle}
                    required
                  >
                    <Input
                      type="date"
                      value={dateDerniereRegle}
                      onChange={(e) => setDateDerniereRegle(e.target.value)}
                      className={cn(errors.dateDerniereRegle && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="datePrevueAccouchement" label="DPA (Date prévue d'accouchement)">
                    <Input
                      type="date"
                      value={datePrevueAccouchement}
                      onChange={(e) => setDatePrevueAccouchement(e.target.value)}
                    />
                  </FormField>

                  <FormField id="nombreGrossesses" label="Nombre de grossesses (G)">
                    <Input
                      type="number"
                      min="0"
                      value={nombreGrossesses}
                      onChange={(e) => setNombreGrossesses(e.target.value)}
                      placeholder="0"
                    />
                  </FormField>

                  <FormField id="nombreAccouchements" label="Nombre d'accouchements (P)">
                    <Input
                      type="number"
                      min="0"
                      value={nombreAccouchements}
                      onChange={(e) => setNombreAccouchements(e.target.value)}
                      placeholder="0"
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Section Informations médicales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TestTube className="h-5 w-5 text-red-500" />
                  Informations médicales et sérologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField id="groupeSanguin" label="Groupe sanguin">
                    <Select value={groupeSanguin} onValueChange={setGroupeSanguin}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {groupesSanguins.map((gs) => (
                          <SelectItem key={gs} value={gs}>
                            {gs}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="rhesus" label="Rhésus">
                    <Select value={rhesus} onValueChange={setRhesus}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {rhesusOptions.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-base mb-4 border-b pb-2">Sérologies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField id="statutSerologieRubeole" label="Rubéole">
                      <Select value={statutSerologieRubeole} onValueChange={setStatutSerologieRubeole}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Statut..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {statutSerologieOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField id="statutSerologieToxo" label="Toxoplasmose">
                      <Select value={statutSerologieToxo} onValueChange={setStatutSerologieToxo}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Statut..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {statutSerologieOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField id="statutSerologieHepatiteB" label="Hépatite B">
                      <Select value={statutSerologieHepatiteB} onValueChange={setStatutSerologieHepatiteB}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Statut..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {statutSerologieResultOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField id="statutSerologieHiv" label="VIH">
                      <Select value={statutSerologieHiv} onValueChange={setStatutSerologieHiv}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Statut..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {statutSerologieResultOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField id="statutSerologieSyphilis" label="Syphilis">
                      <Select value={statutSerologieSyphilis} onValueChange={setStatutSerologieSyphilis}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Statut..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {statutSerologieResultOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="bg-pink-600 hover:bg-pink-700 text-white">
            {isEditMode ? "Modifier le Dossier" : "Créer le Dossier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
