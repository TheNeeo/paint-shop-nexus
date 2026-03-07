export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string
          created_by_user_id: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by_user_id: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by_user_id?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          created_by_user_id: string
          customer_type: string | null
          email: string | null
          gst_no: string | null
          id: string
          mobile: string
          name: string
          outstanding_balance: number | null
          status: string | null
          total_sales: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by_user_id: string
          customer_type?: string | null
          email?: string | null
          gst_no?: string | null
          id?: string
          mobile: string
          name: string
          outstanding_balance?: number | null
          status?: string | null
          total_sales?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by_user_id?: string
          customer_type?: string | null
          email?: string | null
          gst_no?: string | null
          id?: string
          mobile?: string
          name?: string
          outstanding_balance?: number | null
          status?: string | null
          total_sales?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number | null
          created_at: string
          created_by_user_id: string
          date: string
          description: string | null
          id: string
          payment_mode: string | null
          ref_no: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          created_by_user_id: string
          date?: string
          description?: string | null
          id?: string
          payment_mode?: string | null
          ref_no?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          created_by_user_id?: string
          date?: string
          description?: string | null
          id?: string
          payment_mode?: string | null
          ref_no?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          created_by_user_id: string
          current_stock: number | null
          description: string | null
          expiry_date: string | null
          hsn_code: string | null
          id: string
          image_url: string | null
          is_variant: boolean | null
          manufacture_date: string | null
          mrp: number | null
          name: string
          parent_product_id: string | null
          preferred_vendor_id: string | null
          purchase_price: number | null
          purchase_qty: number | null
          remaining_warranty: string | null
          sale_price: number | null
          sale_qty: number | null
          status: string | null
          threshold_qty: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string
          warranty_years: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by_user_id: string
          current_stock?: number | null
          description?: string | null
          expiry_date?: string | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          is_variant?: boolean | null
          manufacture_date?: string | null
          mrp?: number | null
          name: string
          parent_product_id?: string | null
          preferred_vendor_id?: string | null
          purchase_price?: number | null
          purchase_qty?: number | null
          remaining_warranty?: string | null
          sale_price?: number | null
          sale_qty?: number | null
          status?: string | null
          threshold_qty?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string
          warranty_years?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by_user_id?: string
          current_stock?: number | null
          description?: string | null
          expiry_date?: string | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          is_variant?: boolean | null
          manufacture_date?: string | null
          mrp?: number | null
          name?: string
          parent_product_id?: string | null
          preferred_vendor_id?: string | null
          purchase_price?: number | null
          purchase_qty?: number | null
          remaining_warranty?: string | null
          sale_price?: number | null
          sale_qty?: number | null
          status?: string | null
          threshold_qty?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_preferred_vendor_id_fkey"
            columns: ["preferred_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_items: {
        Row: {
          created_at: string
          created_by_user_id: string
          discount_rate: number | null
          id: string
          product_id: string | null
          product_name: string
          purchase_id: string
          quantity: number | null
          tax_rate: number | null
          total_amount: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          discount_rate?: number | null
          id?: string
          product_id?: string | null
          product_name: string
          purchase_id: string
          quantity?: number | null
          tax_rate?: number | null
          total_amount?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          discount_rate?: number | null
          id?: string
          product_id?: string | null
          product_name?: string
          purchase_id?: string
          quantity?: number | null
          tax_rate?: number | null
          total_amount?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          balance_amount: number | null
          created_at: string
          created_by_user_id: string
          discount_amount: number | null
          id: string
          invoice_file_url: string | null
          invoice_number: string
          notes: string | null
          paid_amount: number | null
          payment_method: string | null
          purchase_date: string
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          balance_amount?: number | null
          created_at?: string
          created_by_user_id: string
          discount_amount?: number | null
          id?: string
          invoice_file_url?: string | null
          invoice_number: string
          notes?: string | null
          paid_amount?: number | null
          payment_method?: string | null
          purchase_date?: string
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          balance_amount?: number | null
          created_at?: string
          created_by_user_id?: string
          discount_amount?: number | null
          id?: string
          invoice_file_url?: string | null
          invoice_number?: string
          notes?: string | null
          paid_amount?: number | null
          payment_method?: string | null
          purchase_date?: string
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          amount: number | null
          created_at: string
          gst_percent: number | null
          hsn_code: string | null
          id: string
          product_id: string | null
          product_name: string
          quantity: number | null
          rate: number | null
          sale_id: string
          unit: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          gst_percent?: number | null
          hsn_code?: string | null
          id?: string
          product_id?: string | null
          product_name: string
          quantity?: number | null
          rate?: number | null
          sale_id: string
          unit?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          gst_percent?: number | null
          hsn_code?: string | null
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number | null
          rate?: number | null
          sale_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          created_by_user_id: string
          customer_id: string | null
          customer_name: string | null
          discount_amount: number | null
          id: string
          invoice_date: string
          invoice_number: string
          is_gst_inclusive: boolean | null
          notes: string | null
          paid_amount: number | null
          payment_mode: string | null
          payment_status: string | null
          pending_amount: number | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          id?: string
          invoice_date?: string
          invoice_number: string
          is_gst_inclusive?: boolean | null
          notes?: string | null
          paid_amount?: number | null
          payment_mode?: string | null
          payment_status?: string | null
          pending_amount?: number | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          is_gst_inclusive?: boolean | null
          notes?: string | null
          paid_amount?: number | null
          payment_mode?: string | null
          payment_status?: string | null
          pending_amount?: number | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_adjustments: {
        Row: {
          adjustment_type: string
          created_at: string
          created_by_user_id: string
          id: string
          product_id: string
          quantity: number
          reason: string | null
          reference_id: string | null
        }
        Insert: {
          adjustment_type: string
          created_at?: string
          created_by_user_id: string
          id?: string
          product_id: string
          quantity: number
          reason?: string | null
          reference_id?: string | null
        }
        Update: {
          adjustment_type?: string
          created_at?: string
          created_by_user_id?: string
          id?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          created_by_user_id: string
          email: string | null
          gst_number: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by_user_id: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by_user_id?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_or_manager_role: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "staff"],
    },
  },
} as const
