import { supabase } from './supabaseClient';

type UpsertSignupInput = {
  email: string;
  phone?: string;
};

type UpsertCompletionInput = {
  name: string;
  phone: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  const cleaned = email.trim().toLowerCase();
  if (!cleaned || cleaned.length > 254 || !EMAIL_RE.test(cleaned)) {
    throw new Error('Invalid email address.');
  }
  return cleaned;
}

function normalizePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  // Strip formatting, keep only digits; enforce E.164-ish length
  const digits = trimmed.replace(/[\s\-().+]/g, '');
  if (!/^\d{7,15}$/.test(digits)) {
    throw new Error('Invalid phone number.');
  }
  return trimmed;
}

export async function upsertKeepincontactSignup(input: UpsertSignupInput) {
  const email = normalizeEmail(input.email);
  const phone = input.phone ? normalizePhone(input.phone) : null;

  if (!email) {
    throw new Error('Email is required.');
  }

  // Ensure dedupe by email or phone:
  // - Prefer merging into the email row if it exists.
  // - If not, merge into the phone row if it exists.
  const emailRow = await supabase
    .from('keepincontact_signups')
    .select('id, phone')
    .eq('email', email)
    .maybeSingle();

  if (emailRow.error) throw emailRow.error;

  const phoneRow = phone
    ? await supabase
        .from('keepincontact_signups')
        .select('id, email')
        .eq('phone', phone)
        .maybeSingle()
    : { data: null as any, error: null as any };

  if (phoneRow.error) throw phoneRow.error;

  const emailId = emailRow.data?.id ?? null;
  const phoneId = phoneRow.data?.id ?? null;

  if (!emailId && !phoneId) {
    // Neither exists -> insert
    const insertRes = await supabase
      .from('keepincontact_signups')
      .insert({ email, phone })
      .select('id')
      .single();
    if (insertRes.error) throw insertRes.error;
    return insertRes.data;
  }

  if (emailId && !phoneId) {
    // Email exists. If phone provided, add it.
    if (!phone) return;
    const updateRes = await supabase
      .from('keepincontact_signups')
      .update({ phone })
      .eq('id', emailId)
      .select('id')
      .single();
    if (updateRes.error) throw updateRes.error;
    return updateRes.data;
  }

  if (!emailId && phoneId) {
    // Phone exists. If email provided, add it.
    const updateRes = await supabase
      .from('keepincontact_signups')
      .update({ email })
      .eq('id', phoneId)
      .select('id')
      .single();
    if (updateRes.error) throw updateRes.error;
    return updateRes.data;
  }

  // Both exist (emailId && phoneId). If they are different rows, merge by:
  // 1) delete the phone row
  // 2) update email row to include the phone
  if (emailId && phoneId && emailId !== phoneId) {
    const deleteRes = await supabase
      .from('keepincontact_signups')
      .delete()
      .eq('id', phoneId);
    if (deleteRes.error) throw deleteRes.error;

    const updateRes = await supabase
      .from('keepincontact_signups')
      .update({ phone })
      .eq('id', emailId)
      .select('id')
      .single();
    if (updateRes.error) throw updateRes.error;
    return updateRes.data;
  }

  // Same row already: only update phone if provided.
  if (emailId && phoneId && emailId === phoneId) {
    if (!phone) return;
    const updateRes = await supabase
      .from('keepincontact_signups')
      .update({ phone })
      .eq('id', emailId)
      .select('id')
      .single();
    if (updateRes.error) throw updateRes.error;
    return updateRes.data;
  }
}

export async function upsertScavengerCompletion(input: UpsertCompletionInput) {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new Error('Phone is required.');

  const nowIso = new Date().toISOString();

  // Dedupe by phone: the table should have a unique constraint on `phone`.
  const upsertRes = await supabase
    .from('scavenger_completions')
    .upsert(
      {
        phone,
        name: input.name.trim(),
        completed_at: nowIso,
      },
      { onConflict: 'phone' }
    );

  if (upsertRes.error) throw upsertRes.error;
  return upsertRes.data;
}

