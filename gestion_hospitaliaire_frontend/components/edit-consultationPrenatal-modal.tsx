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
  Edit,
  Scale,
  Ruler,
  Baby,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  ConsultationPrenatale,
  CreateConsultationPrenatalePayload,
} from "@/types/consultstionsTraitement"
import { calculateAge, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { DossierGrossesse } from "@/types/medical"

interface EditConsultationModalProps {
  consultation: ConsultationPrenatale | null
  onClose: () => void
  onUpdate: (data: CreateConsultationPrenatalePayload, id: number) => Promise<void>
  dossiers: DossierGrossesse[]
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

export function EditConsultationModal({ consultation, onClose, onUpdate, dossiers }: EditConsultationModalProps) {
  const [openDossier, setOpenDossier] = useState(false)
  const [dossierSearch, setDossierSearch] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // États pour les champs du formulaire
  const [formData, setFormData] = useState<CreateConsultationPrenatalePayload>({
    dateConsultation: "",
    poidsMere: 0,
    hauteurUterine: null,
    bruitsCoeurFoetal: null,
    oedemes: null,
    mouvementsFoetus: null,
    presenceDiabeteGestationnel: null,
    presenceHypertensionGestationnelle: null,
    resultatsAnalyses: null,
    examensComplementaires: null,
    traitementsEnCours: null,
    observationsGenerales: null,
    decisionMedicale: null,
    dateProchaineConsultation: null,
    derniereDoseVAT: null,
    dateDerniereDoseVAT: null,
    dossierGrossesse: { id: 0 },
    employe: { id: 1 },
  })

  // Initialiser le formulaire avec les données de la consultation
  useEffect(() => {
    if (consultation) {
      setFormData({
        dateConsultation: consultation.dateConsultation,
        poidsMere: consultation.poidsMere,
        hauteurUterine: consultation.hauteurUterine,
        bruitsCoeurFoetal: consultation.bruitsCoeurFoetal,
        oedemes: consultation.oedemes,
        mouvementsFoetus: consultation.mouvementsFoetus,
        presenceDiabeteGestationnel: consultation.presenceDiabeteGestationnel,
        presenceHypertensionGestationnelle: consultation.presenceHypertensionGestationnelle,
        resultatsAnalyses: consultation.resultatsAnalyses,
        examensComplementaires: consultation.examensComplementaires,
        traitementsEnCours: consultation.traitementsEnCours,
        observationsGenerales: consultation.observationsGenerales,
        decisionMedicale: consultation.decisionMedicale,
        dateProchaineConsultation: consultation.dateProchaineConsultation,
        derniereDoseVAT: consultation.derniereDoseVAT,
        dateDerniereDoseVAT: consultation.dateDerniereDoseVAT,
        dossierGrossesse: { id: consultation.dossierGrossesse?.id || 0 },
        employe: { id: consultation.employe?.id || 1 },
      })
    }
  }, [consultation])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dossierGrossesse.id) {
      newErrors.dossier = "Veuillez sélectionner un dossier de grossesse."
    }
    if (!formData.dateConsultation) {
      newErrors.dateConsultation = "La date de consultation est obligatoire."
    }
    if (!formData.poidsMere || formData.poidsMere <= 0) {
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

    if (!consultation?.id) {
      toast.error("ID de consultation manquant.")
      return
    }

    await onUpdate(formData, consultation.id)
  }

  const selectedDossier = dossiers.find((d) => d.id === formData.dossierGrossesse.id)

  if (!consultation) return null

  return (
    <Dialog open={!!consultation} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Edit className="h-6 w-6 text-blue-500" />
            Modifier la Consultation Prénatale
          </DialogTitle>
          <DialogDescription>Mettre à jour les détails de la consultation de suivi de grossesse.</DialogDescription>
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
                      value={formData.dateConsultation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.dateProchaineConsultation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                    <div className="relative">
                      <Scale className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="poidsMere"
                        type="number"
                        step="0.1"
                        placeholder="kg"
                        value={formData.poidsMere || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            poidsMere: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        className={cn("pl-10", errors.poidsMere && "border-red-500")}
                      />
                    </div>
                  </FormField>

                  <FormField id="hauteurUterine" label="Hauteur utérine (cm)">
                    <div className="relative">
                      <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="hauteurUterine"
                        type="number"
                        placeholder="cm"
                        value={formData.hauteurUterine || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hauteurUterine: e.target.value ? Number.parseInt(e.target.value) : null,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </FormField>

                  <FormField id="bruitsCoeurFoetal" label="Bruits du cœur fœtal">
                    <div className="relative">
                      <Baby className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="bruitsCoeurFoetal"
                        placeholder="ex: Positifs, 140 bpm"
                        value={formData.bruitsCoeurFoetal || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bruitsCoeurFoetal: e.target.value || null,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </FormField>

                  <FormField id="mouvementsFoetus" label="Mouvements du fœtus">
                    <Input
                      id="mouvementsFoetus"
                      placeholder="ex: Actifs, perçus par la mère"
                      value={formData.mouvementsFoetus || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mouvementsFoetus: e.target.value || null,
                        })
                      }
                    />
                  </FormField>

                  <FormField id="oedemes" label="Œdèmes">
                    <Select
                      value={formData.oedemes?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
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
                      value={formData.presenceDiabeteGestationnel?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
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
                      value={formData.presenceHypertensionGestationnelle?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
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
                      value={formData.derniereDoseVAT?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
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
                      value={formData.dateDerniereDoseVAT || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.resultatsAnalyses || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.examensComplementaires || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.traitementsEnCours || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.observationsGenerales || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.decisionMedicale || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={handleSubmit}
          >
            <Heart className="h-4 w-4 mr-2" />
            Mettre à jour la consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
