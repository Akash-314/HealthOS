export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'PUBLIC' | 'PATIENT' | 'HOSPITAL' | 'AUTHORITY' | 'ADMIN'
          phone_number: string | null
          created_at: string
        }
      }
      hospitals: {
        Row: {
          id: string
          name: string
          license_number: string
          address: string
          total_beds: number
          available_beds: number
          total_icu: number
          available_icu: number
          emergency_contact: string
        }
      }
    }
  }
}
