export interface EditionItem {
  version: string
  edition: string[][]
}

export interface ActivateFormData {
  edition: string
  arch: string
  host: string
  license: string
}
