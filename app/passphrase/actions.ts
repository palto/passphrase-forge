"use server";

export async function generatePassphrase() {
  'use server'
  // Generate password from random 8 characters
  return {
    passphrase: Math.random().toString(36).slice(-8)
  };
}
