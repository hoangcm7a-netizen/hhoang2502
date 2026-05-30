import { createClient } from '@supabase/supabase-js'

// Dán trực tiếp chuỗi URL vào (có dấu nháy đơn bao quanh)
const supabaseUrl = 'https://gfpdgxuvarjocinapbam.supabase.co'

// Dán trực tiếp chuỗi KEY vào (có dấu nháy đơn bao quanh)
const supabaseAnonKey = 'sb_publishable_bKduQLxTeN9QWAlhuMFGhw_p5-qtCb6'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)