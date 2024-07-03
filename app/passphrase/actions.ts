"use server";

import {unstable_cache} from 'next/cache';
import {PasswordGenerator} from '@/app/passphrase/password-generator';

const passwordFileUrl = process.env.PASSWORD_LIST_URL as string;

async function getPasswordList() {
  const response = await fetch(passwordFileUrl)
  const wordsFile = await response.text()
  const wordList = wordsFile.split('\n').map(password => password.trim());
  console.info( `Loaded ${wordList.length} words`);
  return wordList;
}

const cachedGetWordList = unstable_cache(getPasswordList, ['password_list', passwordFileUrl]);

export async function generatePassphrase() {
  const wordList = await cachedGetWordList();
  const passwordGenerator = new PasswordGenerator(wordList);
  return {
    passphrase: passwordGenerator.generate()
  };
}
