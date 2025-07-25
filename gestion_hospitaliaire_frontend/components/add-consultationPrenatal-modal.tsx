"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Check,
  ChevronsUpDown,
  Calendar,
  Heart,
  Activity,
  TestTube,
  FileText,
  Syringe,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CreateConsultationPrenatalePayload } from "@/types/consultstionsTraitement"
import { calculateAge, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { DossierGrossesse } from "@/types/medical"

interface AddConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  dossiers: DossierGrossesse[]
  newConsultation: CreateConsultationPrenatalePayload
  setNewConsultation: (data: CreateConsultationPrenatalePayload) => void
  handleAddConsultation: () => Promise<void>
  currentUserId: number
}

const booleanOptions = [
  { label: "Oui", value: "true" },
  { label: "Non", value: "false" },
]

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

export function AddConsultationModal({
  isOpen,
  onClose,
  dossiers,
  newConsultation,
  setNewConsultation,
  handleAddConsultation,
  currentUserId,
}: AddConsultationModalProps) {
  const [openDossier, setOpenDossier] = useState(false)
  const [dossierSearch, setDossierSearch] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newConsultation.dossierGrossesse.id) {
      newErrors.dossier = "Veuillez sélectionner un dossier de grossesse."
    }
    if (!newConsultation.dateConsultation) {
      newErrors.dateConsultation = "La date de consultation est obligatoire."
    }
    if (!newConsultation.poidsMere || newConsultation.poidsMere <= 0) {
      newErrors.poidsMere = "Le poids de la mère est obligatoire."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    // Set current user as employe
    setNewConsultation({
      ...newConsultation,
      employe: { id: currentUserId },
    })

    await handleAddConsultation()
  }

  const selectedDossier = dossiers.find((d) => d.id === newConsultation.dossierGrossesse.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Heart className="h-6 w-6 text-pink-500" />
            Nouvelle Consultation Prénatale
          </DialogTitle>
          <DialogDescription>
            Enregistrer les détails d'une consultation de suivi de grossesse selon le carnet de santé.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-4 -mx-4">
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
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
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
                                    setNewConsultation({
                                      ...newConsultation,
                                      dossierGrossesse: { id: dossier.id || 0 },
                                    })
                                    setOpenDossier(false)
                                    setDossierSearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newConsultation.dossierGrossesse.id === dossier.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {dossier.personne?.prenom} {dossier.personne?.nom}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      DG-{dossier.id} • DDR: {formatDate(dossier.dateDerniereRegle)}
                                      {dossier.personne?.dateNaissance &&
                                        ` • ${calculateAge(dossier.personne.dateNaissance)} ans`}
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
                      <strong>Patiente sélectionnée:</strong> {selectedDossier.personne?.prenom}{" "}
                      {selectedDossier.personne?.nom}
                      <br />
                      <strong>DDR:</strong> {formatDate(selectedDossier.dateDerniereRegle)} •<strong> DPA:</strong>{" "}
                      {formatDate(selectedDossier.datePrevueAccouchement)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations de consultation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Informations de consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="dateConsultation"
                    label="Date de consultation"
                    required
                    error={errors.dateConsultation}
                  >
                    <Input
                      id="dateConsultation"
                      type="date"
                      value={newConsultation.dateConsultation}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          dateConsultation: e.target.value,
                        })
                      }
                      className={cn(errors.dateConsultation && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="dateProchaineConsultation" label="Prochaine consultation">
                    <Input
                      id="dateProchaineConsultation"
                      type="date"
                      value={newConsultation.dateProchaineConsultation || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          dateProchaineConsultation: e.target.value || null,
                        })
                      }
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Examen physique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Examen physique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField id="poidsMere" label="Poids de la mère (kg)" required error={errors.poidsMere}>
                    <Input
                      id="poidsMere"
                      type="number"
                      step="0.1"
                      placeholder="kg"
                      value={newConsultation.poidsMere || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          poidsMere: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className={cn(errors.poidsMere && "border-red-500")}
                    />
                  </FormField>

                  <FormField id="hauteurUterine" label="Hauteur utérine (cm)">
                    <Input
                      id="hauteurUterine"
                      type="number"
                      placeholder="cm"
                      value={newConsultation.hauteurUterine || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          hauteurUterine: e.target.value ? Number.parseInt(e.target.value) : null,
                        })
                      }
                    />
                  </FormField>

                  <FormField id="bruitsCoeurFoetal" label="Bruits du cœur fœtal">
                    <Input
                      id="bruitsCoeurFoetal"
                      placeholder="ex: Positifs, 140 bpm"
                      value={newConsultation.bruitsCoeurFoetal || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          bruitsCoeurFoetal: e.target.value || null,
                        })
                      }
                    />
                  </FormField>

                  <FormField id="mouvementsFoetus" label="Mouvements du fœtus">
                    <Input
                      id="mouvementsFoetus"
                      placeholder="ex: Actifs, perçus par la mère"
                      value={newConsultation.mouvementsFoetus || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          mouvementsFoetus: e.target.value || null,
                        })
                      }
                    />
                  </FormField>

                  <FormField id="oedemes" label="Œdèmes">
                    <Select
                      value={newConsultation.oedemes?.toString() || "none"}
                      onValueChange={(value) =>
                        setNewConsultation({
                          ...newConsultation,
                          oedemes: value === "true" ? true : value === "false" ? false : null,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Présence d'œdèmes..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Non spécifié</SelectItem>
                        {booleanOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Complications et risques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Complications et risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField id="presenceDiabeteGestationnel" label="Diabète gestationnel">
                    <Select
                      value={newConsultation.presenceDiabeteGestationnel?.toString() || "none"}
                      onValueChange={(value) =>
                        setNewConsultation({
                          ...newConsultation,
                          presenceDiabeteGestationnel: value === "true" ? true : value === "false" ? false : null,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Présence de diabète..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Non spécifié</SelectItem>
                        {booleanOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="presenceHypertensionGestationnelle" label="Hypertension gestationnelle">
                    <Select
                      value={newConsultation.presenceHypertensionGestationnelle?.toString() || "none"}
                      onValueChange={(value) =>
                        setNewConsultation({
                          ...newConsultation,
                          presenceHypertensionGestationnelle:
                            value === "true" ? true : value === "false" ? false : null,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Présence d'hypertension..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Non spécifié</SelectItem>
                        {booleanOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Vaccination VAT */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Syringe className="h-5 w-5 text-yellow-500" />
                  Vaccination antitétanique (VAT)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField id="derniereDoseVAT" label="Dernière dose VAT">
                    <Select
                      value={newConsultation.derniereDoseVAT?.toString() || "none"}
                      onValueChange={(value) =>
                        setNewConsultation({
                          ...newConsultation,
                          derniereDoseVAT: value ? Number.parseInt(value) : null,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Numéro de dose..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Non spécifié</SelectItem>
                        <SelectItem value="1">Dose 1</SelectItem>
                        <SelectItem value="2">Dose 2</SelectItem>
                        <SelectItem value="3">Dose 3</SelectItem>
                        <SelectItem value="4">Dose 4</SelectItem>
                        <SelectItem value="5">Dose 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField id="dateDerniereDoseVAT" label="Date de la dernière dose VAT">
                    <Input
                      id="dateDerniereDoseVAT"
                      type="date"
                      value={newConsultation.dateDerniereDoseVAT || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          dateDerniereDoseVAT: e.target.value || null,
                        })
                      }
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Examens et traitements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TestTube className="h-5 w-5 text-indigo-500" />
                  Examens et traitements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField id="resultatsAnalyses" label="Résultats d'analyses">
                    <Textarea
                      id="resultatsAnalyses"
                      placeholder="Résultats des analyses de laboratoire..."
                      value={newConsultation.resultatsAnalyses || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          resultatsAnalyses: e.target.value || null,
                        })
                      }
                      rows={3}
                    />
                  </FormField>

                  <FormField id="examensComplementaires" label="Examens complémentaires">
                    <Textarea
                      id="examensComplementaires"
                      placeholder="Échographies, autres examens demandés..."
                      value={newConsultation.examensComplementaires || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          examensComplementaires: e.target.value || null,
                        })
                      }
                      rows={3}
                    />
                  </FormField>

                  <FormField id="traitementsEnCours" label="Traitements en cours">
                    <Textarea
                      id="traitementsEnCours"
                      placeholder="Médicaments prescrits, suppléments..."
                      value={newConsultation.traitementsEnCours || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          traitementsEnCours: e.target.value || null,
                        })
                      }
                      rows={3}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Observations et décisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Observations et décisions médicales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField id="observationsGenerales" label="Observations générales">
                    <Textarea
                      id="observationsGenerales"
                      placeholder="Notes générales sur la consultation..."
                      value={newConsultation.observationsGenerales || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          observationsGenerales: e.target.value || null,
                        })
                      }
                      rows={4}
                    />
                  </FormField>

                  <FormField id="decisionMedicale" label="Décision médicale">
                    <Textarea
                      id="decisionMedicale"
                      placeholder="Conduite à tenir, prescriptions, recommandations..."
                      value={newConsultation.decisionMedicale || ""}
                      onChange={(e) =>
                        setNewConsultation({
                          ...newConsultation,
                          decisionMedicale: e.target.value || null,
                        })
                      }
                      rows={4}
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
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            onClick={handleSubmit}
          >
            <Heart className="h-4 w-4 mr-2" />
            Enregistrer la consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
